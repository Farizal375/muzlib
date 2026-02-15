"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// KUNCI KONFIGURASI
const TRENDING_LIMIT_KEY = "trending_limit";
const DEFAULT_LIMIT = "10";

// Helper: Cek Admin
async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
}

// 1. GET: Ambil Limit saat ini (Server Side)
export async function getTrendingLimit(): Promise<number> {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: TRENDING_LIMIT_KEY },
    });

    // Jika belum ada di DB, kembalikan default 10
    return parseInt(config?.value || DEFAULT_LIMIT, 10);
  } catch (error) {
    console.error("Gagal mengambil config:", error);
    return 10; // Fallback aman
  }
}

// 2. UPDATE: Ubah Limit (Server Action)
export async function updateTrendingLimit(newLimit: number) {
  try {
    await checkAdmin();

    if (newLimit < 4 || newLimit > 100) {
      return { success: false, message: "Jumlah harus antara 4 sampai 100." };
    }

    // Upsert: Update jika ada, Create jika belum ada
    await prisma.systemConfig.upsert({
      where: { key: TRENDING_LIMIT_KEY },
      update: { value: newLimit.toString() },
      create: { 
        key: TRENDING_LIMIT_KEY,
        value: newLimit.toString() 
      },
    });

    // Revalidate Homepage agar perubahan langsung terlihat
    revalidatePath("/"); 
    revalidatePath("/admin/settings");
    
    return { success: true, message: "Pengaturan berhasil disimpan." };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, message: "Gagal menyimpan pengaturan." };
  }
}