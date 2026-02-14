import { searchBooks } from "@/lib/openlibrary";
import { BookCard } from "@/components/features/book-card";
import { SearchBar } from "@/components/features/search-bar";

// 1. Definisikan tipe props sebagai Promise
interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // 2. Lakukan 'await' untuk membuka bungkusan Promise-nya
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  
  // Fetch data jika ada query
  const books = query ? await searchBooks(query) : [];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Cari Buku</h1>
        <SearchBar />
      </div>

      {/* Bagian Hasil Pencarian */}
      <div className="mt-8">
        {!query ? (
          <div className="text-center text-slate-500 py-20">
            <p className="text-lg">Silakan ketik judul buku untuk mulai mencari.</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center text-slate-500 py-20">
            <p className="text-lg">Tidak ditemukan buku dengan kata kunci &quot;{query}&quot;.</p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 mb-6">
              Menampilkan hasil untuk &quot;<span className="font-semibold text-slate-900">{query}</span>&quot;
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {books.map((book) => (
                <BookCard key={book.openLibraryId} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}