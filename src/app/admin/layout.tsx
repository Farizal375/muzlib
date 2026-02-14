// src/app/admin/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  // Cek Role di Database (Security Layer 1)
  // Catatan: Idealnya menggunakan Claims di Clerk, tapi cek DB juga aman
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "ADMIN") {
    // Jika bukan admin, tendang ke home
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider">MuzLib ADMIN</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/books">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
              <BookOpen className="mr-2 h-4 w-4" />
              Kelola Buku
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
              <Users className="mr-2 h-4 w-4" />
              Daftar User
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/">
            <Button variant="secondary" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar ke Web
            </Button>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}