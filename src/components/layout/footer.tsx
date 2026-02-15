"use client"; // <--- Tambahkan ini agar bisa cek URL

import Link from "next/link";
import { usePathname } from "next/navigation"; // <--- Import hook
import { BookOpen, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // LOGIKA: Jika sedang di halaman Admin, JANGAN tampilkan footer publik
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Kolom 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">MuzLib</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Platform perpustakaan digital modern untuk meningkatkan literasi dan wawasan Anda.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/" className="hover:text-blue-600">Beranda</Link></li>
              <li><Link href="/search" className="hover:text-blue-600">Cari Buku</Link></li>
              <li><Link href="/my-books" className="hover:text-blue-600">Koleksi Saya</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kategori */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Kategori Populer</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/search?q=programming" className="hover:text-blue-600">Programming</Link></li>
              <li><Link href="/search?q=design" className="hover:text-blue-600">Design</Link></li>
              <li><Link href="/search?q=business" className="hover:text-blue-600">Business</Link></li>
              <li><Link href="/search?q=fiction" className="hover:text-blue-600">Fiction</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Sosmed */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Ikuti Kami</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 mt-12 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} MuzLib. All rights reserved. Built with Next.js & Supabase.
        </div>
      </div>
    </footer>
  );
}