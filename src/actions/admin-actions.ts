"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper: Cek apakah user adalah ADMIN
async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Forbidden: Access denied");
  }
  return true;
}

// 1. Ambil Statistik Dashboard
export async function getAdminStats() {
  await checkAdmin();

  const totalUsers = await prisma.user.count();
  const totalBooks = await prisma.book.count(); // Buku yang tersimpan di DB lokal
  const totalBookmarks = await prisma.bookmark.count();
  
  // Hitung buku featured & hidden
  const featuredBooks = await prisma.book.count({ where: { isFeatured: true } });
  const hiddenBooks = await prisma.book.count({ where: { isHidden: true } });

  return {
    totalUsers,
    totalBooks,
    totalBookmarks,
    featuredBooks,
    hiddenBooks
  };
}

// 2. Toggle Status Featured (Untuk Hero Section Homepage)
export async function toggleBookFeatured(bookId: string) {
  await checkAdmin();

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return { success: false, message: "Buku tidak ditemukan" };

  await prisma.book.update({
    where: { id: bookId },
    data: { isFeatured: !book.isFeatured },
  });

  revalidatePath("/"); // Refresh Homepage
  revalidatePath("/admin/books"); // Refresh Admin Page
  return { success: true, message: `Status Featured berhasil diubah.` };
}

// 3. Toggle Status Hidden (Blacklist - Hilang dari pencarian)
export async function toggleBookHidden(bookId: string) {
  await checkAdmin();

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return { success: false, message: "Buku tidak ditemukan" };

  await prisma.book.update({
    where: { id: bookId },
    data: { isHidden: !book.isHidden },
  });

  revalidatePath("/search"); // Refresh Search Page
  revalidatePath("/admin/books");
  return { success: true, message: `Status Hidden (Blacklist) berhasil diubah.` };
}