"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Book } from "@/types";
import { revalidatePath } from "next/cache";

// Fungsi untuk Toggle (Simpan/Hapus) Bookmark
export async function toggleBookmark(book: Book) {
  // 1. Cek User Login
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "Anda harus login untuk menyimpan buku." };
  }

  try {
    // 2. Cek apakah user sudah ada di database lokal?
    // (Clerk menangani auth, tapi kita butuh record user di tabel Prisma kita untuk relasi)
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Jika user belum ada di DB lokal, buat dulu (Sync otomatis)
    if (!user) {
      // Kita butuh email user, tapi auth() clerk cuma kasih ID.
      // Untuk simplifikasi, kita buat user tanpa email dulu atau abaikan relasi strict
      // Tapi solusi terbaik adalah menggunakan Webhook Clerk (Nanti di Phase optimasi).
      // SEMENTARA: Kita "Upsert" user sederhana
      await prisma.user.create({
        data: {
          id: userId,
          email: `user_${userId}@clerk.placeholder`, // Placeholder aman
          role: "USER",
        }
      });
    }

    // 3. Cek apakah BUKU ini sudah ada di database lokal kita?
    // Kita pakai openLibraryId sebagai acuan unik
    let localBook = await prisma.book.findUnique({
      where: { openLibraryId: book.openLibraryId },
    });

    // Jika buku belum ada, kita simpan dulu data detailnya (Cache lokal)
    if (!localBook) {
      localBook = await prisma.book.create({
        data: {
          openLibraryId: book.openLibraryId,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          // Properti lain default false
        },
      });
    }

    // 4. Cek Status Bookmark saat ini
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: localBook.id, // Pakai ID internal database (CUID), bukan OpenLibID
        },
      },
    });

    if (existingBookmark) {
      // A. Jika SUDAH ada -> HAPUS (Un-bookmark)
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      revalidatePath("/my-books"); // Refresh halaman koleksi
      return { success: true, message: "Buku dihapus dari koleksi.", isBookmarked: false };
    } else {
      // B. Jika BELUM ada -> BUAT BARU (Bookmark)
      await prisma.bookmark.create({
        data: {
          userId: userId,
          bookId: localBook.id,
        },
      });
      revalidatePath("/my-books");
      return { success: true, message: "Buku disimpan ke koleksi!", isBookmarked: true };
    }

  } catch (error) {
    console.error("Bookmark Error:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}

// Fungsi Cek Status (Untuk UI awal)
export async function checkBookmarkStatus(openLibraryId: string) {
  const { userId } = await auth();
  if (!userId) return false;

  const book = await prisma.book.findUnique({
    where: { openLibraryId },
    include: {
      bookmarks: {
        where: { userId },
      },
    },
  });

  // Return true jika book ada DAN punya bookmark dari user ini
  return !!book?.bookmarks.length;
}