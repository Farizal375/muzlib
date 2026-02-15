import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, LogOut, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";


interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void; // Opsional: untuk menutup menu saat diklik di mobile
}

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  return (
    <div className={`flex flex-col h-full bg-slate-900 text-white ${className}`}>
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">MuzLib ADMIN</h1>
        {/* Tombol Close hanya visual bantuan di mobile, logic diurus Sheet */}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/admin/dashboard" onClick={onNavigate}>
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/admin/books" onClick={onNavigate}>
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <BookOpen className="mr-2 h-4 w-4" />
            Kelola Buku
          </Button>
        </Link>
        <Link href="/admin/users" onClick={onNavigate}>
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <Users className="mr-2 h-4 w-4" />
            Daftar User
          </Button>
        </Link>
        <Link href="/admin/settings" onClick={onNavigate}>
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan
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
    </div>
  );
}