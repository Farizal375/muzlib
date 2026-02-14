import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { BookCard } from "@/components/features/book-card";
import { getTrendingBooks } from "@/lib/openlibrary";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600; // Update data tiap 1 jam (ISR)

export default async function HomePage() {
  // 1. Fetch data langsung di Server Component (Cepat & SEO Friendly)
  const trendingBooks = await getTrendingBooks("programming");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="bg-white border-b py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Jelajahi Dunia Lewat <span className="text-blue-600">MuzLib</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Platform perpustakaan digital modern. Temukan jutaan buku, simpan koleksi favoritmu, dan akses pengetahuan tanpa batas secara gratis.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/search">
                <Button size="lg" className="h-12 px-8 text-base">
                  Mulai Mencari
                </Button>
              </Link>
              <Link href="/search?q=javascript">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Lihat Populer
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- TRENDING SECTION --- */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Sedang Trending</h2>
              <p className="text-slate-500 mt-1">Buku pemrograman populer minggu ini</p>
            </div>
            <Link href="/search?q=programming">
              <Button variant="ghost" className="text-blue-600">
                Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Grid Buku */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trendingBooks.length > 0 ? (
              trendingBooks.map((book) => (
                <BookCard key={book.openLibraryId} book={book} />
              ))
            ) : (
              <p className="col-span-full text-center py-10 text-slate-500">
                Gagal memuat data trending. Silakan coba refresh.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Footer Sederhana */}
      <footer className="bg-white border-t py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} MuzLib. Dibuat dengan Next.js 14 & Shadcn UI.</p>
      </footer>
    </div>
  );
}