import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 1. Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800 hover:opacity-80 transition">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <BookOpen size={20} />
          </div>
          MuzLib
        </Link>

        {/* 2. Menu Tengah (Desktop) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition">Beranda</Link>
          <Link href="/search" className="hover:text-blue-600 transition">Cari Buku</Link>
          
          {/* Menu ini hanya muncul kalau login */}
          <SignedIn>
            <Link href="/my-books" className="hover:text-blue-600 transition">Koleksi Saya</Link>
          </SignedIn>
        </nav>

        {/* 3. Auth Buttons (Clerk) */}
        <div className="flex items-center gap-4">
          <SignedOut>
            {/* Kalau belum login, muncul tombol ini */}
            <SignInButton mode="modal">
              <Button size="sm">Masuk</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {/* Kalau sudah login, muncul Avatar */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}