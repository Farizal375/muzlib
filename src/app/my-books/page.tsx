import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/features/book-card";
import { Book } from "@/types";

// Metadata untuk SEO & Tab Browser
export const metadata = {
  title: "Koleksi Saya | MuzLib",
  description: "Daftar buku favorit yang telah Anda simpan.",
};

export default async function MyBooksPage() {
  // 1. Cek User Login (Proteksi Halaman)
  const { userId } = await auth();

  // Jika belum login, tendang ke halaman login
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Ambil data dari Database Lokal (Prisma)
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: userId,
    },
    include: {
      book: true, 
    },
    orderBy: {
      createdAt: "desc", 
    },
  });

  // 3. Mapping: Ubah format Database Prisma ke format 'Book' untuk UI
  const myBooks: Book[] = bookmarks.map((item) => ({
    id: item.book.id,               
    openLibraryId: item.book.openLibraryId,
    title: item.book.title,
    author: item.book.author || "Penulis Tidak Diketahui",
    coverUrl: item.book.coverUrl || "/images/book-placeholder.png",
    publishYear: 0,                 // Kita set 0 karena di DB lokal tidak ada tahun terbit
    isFeatured: item.book.isFeatured,
  }));

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-slate-50">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Koleksi Saya</h1>
        <p className="text-slate-500 mt-2">
          Anda memiliki <span className="font-bold text-blue-600">{myBooks.length}</span> buku tersimpan.
        </p>
      </div>

      {myBooks.length === 0 ? (
        // TAMPILAN JIKA KOSONG (Empty State)
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Belum ada koleksi</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            Anda belum menyimpan buku apapun. Cari buku menarik dan simpan di sini.
          </p>
          <a href="/search" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Mulai Cari Buku
          </a>
        </div>
      ) : (
        // GRID BUKU (Jika Ada Datanya)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {myBooks.map((book) => (
            <BookCard key={book.openLibraryId} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}