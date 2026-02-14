"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Book } from "@/types";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(book: Book) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, message: "Anda harus login terlebih dahulu" };
    }

    // 1. Pastikan User terdaftar di database lokal kita
    // Kita gunakan upsert: jika ada update emailnya, jika belum ada buat baru
    await prisma.user.upsert({
      where: { id: userId },
      update: { email: user.emailAddresses[0].emailAddress },
      create: {
        id: userId,
        email: user.emailAddresses[0].emailAddress,
        role: "USER",
      },
    });

    // 2. Cek apakah buku sudah ada di database lokal
    let localBook = await prisma.book.findUnique({
      where: { openLibraryId: book.openLibraryId },
    });

    // 3. Jika buku BELUM ADA, simpan dulu detailnya (Cache lokal)
    if (!localBook) {
      localBook = await prisma.book.create({
        data: {
          openLibraryId: book.openLibraryId,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          // --- PERBAIKAN DI SINI ---
          // Kita tambahkan publishYear (gunakan 0 jika tidak ada datanya)
          publishYear: book.publishYear || 0, 
          description: book.description || "",
          // ------------------------
        },
      });
    }

    // 4. Cek apakah user sudah mem-bookmark buku ini
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: localBook.id,
        },
      },
    });

    if (existingBookmark) {
      // Jika sudah ada, maka hapus (Un-bookmark)
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      revalidatePath("/my-books");
      return { success: true, isBookmarked: false, message: "Berhasil dihapus dari koleksi" };
    } else {
      // Jika belum ada, maka tambah (Bookmark)
      await prisma.bookmark.create({
        data: {
          userId: userId,
          bookId: localBook.id,
        },
      });
      revalidatePath("/my-books");
      return { success: true, isBookmarked: true, message: "Berhasil disimpan ke koleksi" };
    }
  } catch (error) {
    console.error("Bookmark Error:", error);
    return { success: false, message: "Terjadi kesalahan pada sistem" };
  }
}

// Fungsi pembantu untuk cek status awal (dipakai di halaman Detail Buku)
export async function checkBookmarkStatus(openLibraryId: string) {
  const { userId } = await auth();
  if (!userId) return false;

  const bookmark = await prisma.bookmark.findFirst({
    where: {
      userId: userId,
      book: {
        openLibraryId: openLibraryId,
      },
    },
  });

  return !!bookmark;
}