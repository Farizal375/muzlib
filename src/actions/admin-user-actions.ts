"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper: Pastikan yang melakukan aksi adalah ADMIN
async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const requester = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!requester || requester.role !== "ADMIN") {
    throw new Error("Forbidden: Hanya Admin yang boleh melakukan ini.");
  }
  return requester;
}

// 1. UBAH ROLE (Promote/Demote)
export async function updateUserRole(targetUserId: string, newRole: "ADMIN" | "USER") {
  try {
    await checkAdmin();

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    revalidatePath("/admin/users");
    return { success: true, message: `Role user berhasil diubah menjadi ${newRole}` };
  } catch (error) {
    return { success: false, message: "Gagal mengubah role user" };
  }
}

// 2. HAPUS USER (Ban)
export async function deleteUser(targetUserId: string) {
  try {
    const requester = await checkAdmin();

    // Mencegah Admin menghapus dirinya sendiri
    if (requester.id === targetUserId) {
      return { success: false, message: "Anda tidak bisa menghapus akun sendiri saat login." };
    }

    await prisma.user.delete({
      where: { id: targetUserId },
    });

    revalidatePath("/admin/users");
    return { success: true, message: "User berhasil dihapus dari database." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus user" };
  }
}