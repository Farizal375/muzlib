import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* 1. SIDEBAR DESKTOP (Hidden di Mobile) */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <AdminSidebar />
      </aside>

      {/* 2. HEADER MOBILE (Hidden di Desktop) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <span className="font-bold">MuzLib Admin</span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-slate-800 text-white">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* 3. MAIN CONTENT (Padding menyesuaikan layar) */}
      {/* md:ml-64 artinya margin kiri 64 hanya ada di Desktop */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}