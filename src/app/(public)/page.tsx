import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { getTrendingBooks } from "@/lib/openlibrary";
import { prisma } from "@/lib/prisma"; // Import Prisma
import { BookCard } from "@/components/features/book-card";

// Revalidate data setiap 1 jam (ISR) agar tidak membebani database
export const revalidate = 3600; 

export default async function Home() {
  // 1. Ambil Buku Featured dari Database Lokal (Admin Choice)
  const featuredBooks = await prisma.book.findMany({
    where: { isFeatured: true },
    take: 1, // Kita ambil 1 buku utama untuk Banner Besar
    orderBy: { updatedAt: "desc" }, // Yang paling baru dijadikan featured
  });

  // Ambil sisa featured books untuk list kecil (opsional, tahap berikutnya)
  
  // 2. Ambil Buku Trending dari API (Sama seperti sebelumnya)
  const trendingBooks = await getTrendingBooks();

  // Buku Utama untuk Hero Section
  const heroBook = featuredBooks[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION (DINAMIS) */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          
          {/* Kolom Teks */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            {heroBook ? (
              // TAMPILAN JIKA ADA BUKU FEATURED DARI ADMIN
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  Pilihan Editor Hari Ini
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {heroBook.title}
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto md:mx-0">
                  {heroBook.description 
                    ? heroBook.description.slice(0, 150) + "..." 
                    : `Temukan wawasan baru dari karya ${heroBook.author}. Buku ini telah dikurasi khusus oleh tim MuzLib sebagai bacaan wajib minggu ini.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <Link href={`/book/${heroBook.openLibraryId}`}>
                    <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                      Baca Sekarang
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              // TAMPILAN DEFAULT (JIKA BELUM ADA YANG DI-FEATURED)
              <>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Jelajahi Ribuan <br />
                  <span className="text-blue-600">Koleksi Pengetahuan</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto md:mx-0">
                  MuzLib adalah platform perpustakaan digital modern. Temukan buku, simpan ke koleksi, dan bangun wawasan Anda sekarang.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <Link href="/search">
                    <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                      Mulai Menjelajah
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Kolom Gambar */}
          <div className="flex-1 relative w-full max-w-md mx-auto md:max-w-full">
            <div className="relative aspect-[3/4] md:aspect-square max-h-[500px] mx-auto">
              {/* Background Blob Decoration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-slate-100 rounded-full blur-3xl opacity-60 -z-10" />
              
              {heroBook ? (
                 <Image
                 src={heroBook.coverUrl || "/images/book-placeholder.png"}
                 alt="Featured Book"
                 fill
                 className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                 priority
                 unoptimized // PENTING: Agar tidak error 403 Forbidden
               />
              ) : (
                <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-medium">Ilustrasi Buku</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* TRENDING SECTION */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Sedang Trending</h2>
          <Link href="/search" className="text-blue-600 font-medium hover:underline">
            Lihat Semua &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trendingBooks.map((book) => (
            <BookCard key={book.openLibraryId} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}