"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { BookOpen, ShieldCheck } from "lucide-react";

// Menerima props 'userRole' dari parent (Layout)
interface NavbarProps {
  userRole?: string | null;
}

export function Navbar({ userRole }: NavbarProps) {
  const pathname = usePathname();
  const { user } = useUser(); // Hook untuk mengambil nama user dari Clerk

  // JANGAN RENDER NAVBAR JIKA DI HALAMAN ADMIN
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            MuzLib
          </span>
        </Link>

        {/* MENU TENGAH */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <Link href="/search" className="hover:text-blue-600 transition-colors">Cari Buku</Link>
          <SignedIn>
            <Link href="/my-books" className="hover:text-blue-600 transition-colors">Koleksi Saya</Link>
          </SignedIn>
        </div>

        {/* MENU KANAN (AUTH) */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">Masuk</Button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            {/* LOGIKA PENTING: Hanya Tampilkan Dashboard jika ADMIN */}
            {userRole === "ADMIN" ? (
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              // Jika User Biasa, tampilkan nama sapaan saja
              <div className="hidden sm:block text-sm font-medium text-slate-600 mr-2">
                Hai, {user?.firstName || "Pembaca"}
              </div>
            )}
            
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}