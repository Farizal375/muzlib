import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookDetail } from "@/lib/openlibrary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar, Share2, Bookmark } from "lucide-react";

// UPDATE 1: Interface Params harus berupa Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  // UPDATE 2: Lakukan await params terlebih dahulu
  const { id } = await params;

  // Cek safety jika ID kosong
  if (!id) {
    return notFound();
  }

  // Fetch data detail buku
  const book = await getBookDetail(id);

  // Jika buku tidak ditemukan di API, tampilkan halaman 404
  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Tombol Kembali */}
        <Link href="/search" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Pencarian
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8">
            
            {/* KOLOM KIRI: Gambar Cover Besar */}
            <div className="md:col-span-4 bg-slate-100 relative min-h-[400px] md:min-h-full">
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-contain p-8"
                priority
              />
            </div>

            {/* KOLOM KANAN: Informasi Buku */}
            <div className="md:col-span-8 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <Badge variant="secondary" className="mb-4 text-blue-700 bg-blue-50 hover:bg-blue-100">
                  {book.openLibraryId}
                </Badge>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
                  {book.title}
                </h1>
                
                <p className="text-xl text-slate-500 font-medium">
                  {book.author}
                </p>
              </div>

              {/* Meta Data */}
              <div className="flex flex-wrap gap-6 border-y border-slate-100 py-6 mb-8">
                <div className="flex items-center text-slate-600">
                  <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Tahun Terbit</p>
                    <p className="font-medium">{book.publishYear || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center text-slate-600">
                  <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Sumber Data</p>
                    <p className="font-medium">Open Library</p>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-900 mb-3">Sinopsis</h3>
                <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">
                  {book.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <Bookmark className="w-5 h-5 mr-2" />
                  Simpan ke Koleksi
                </Button>
                
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Share2 className="w-5 h-5 mr-2" />
                  Bagikan
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}