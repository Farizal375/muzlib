import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
// IMPORT USERBUTTON CLERK
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 shadow-xl shrink-0">
        <AdminSidebar />
      </aside>

      {/* AREA UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER KHUSUS ADMIN */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 z-30 shadow-sm">
          
          {/* KIRI: Judul & Toggle Mobile */}
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-none">
                  <AdminSidebar />
                </SheetContent>
              </Sheet>
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Panel Admin
            </h2>
          </div>
          
          {/* KANAN: PROFIL ADMIN (YANG ANDA MINTA) */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Administrator
              </p>
              <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">
                {user.email.split("@")[0]} {/* Tampilkan nama depan email */}
              </p>
            </div>
            
            {/* Tombol Bulat Profil Clerk */}
            <div className="h-8 w-8 flex items-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* AREA KONTEN SCROLLABLE */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50/50">
          <div className="flex-1 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>

          {/* FOOTER ADMIN (KECIL) */}
          <footer className="p-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} MuzLib System. Authorized Personnel Only.
          </footer>
        </main>
      </div>
    </div>
  );
}