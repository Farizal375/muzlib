import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AdminBookActions } from "./admin-book-actions"; 

export const metadata = { title: "Kelola Buku | Admin" };

export default async function AdminBooksPage() {
  // Ambil semua buku dari DB lokal
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookmarks: true }, 
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Manajemen Buku</h1>
        <Badge variant="outline" className="text-base px-4 py-1">
          {books.length} Buku Lokal
        </Badge>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Cover</th>
              <th className="px-6 py-4">Judul & Penulis</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Popularitas</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 w-20">
                  <div className="relative h-16 w-12 bg-slate-200 rounded overflow-hidden">
                    <Image 
                      // PERBAIKAN DI SINI: Tambahkan fallback string kosong jika null
                      src={book.coverUrl || "/images/book-placeholder.png"} 
                      alt={book.title} 
                      fill 
                      className="object-cover"
                      unoptimized 
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900 line-clamp-1">{book.title}</p>
                  <p className="text-slate-500 text-xs">{book.author}</p>
                  <p className="text-slate-400 text-[10px] mt-1 font-mono">{book.openLibraryId}</p>
                </td>
                <td className="px-6 py-4 text-center space-y-2">
                  {book.isFeatured && (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
                      Featured
                    </Badge>
                  )}
                  {book.isHidden && (
                    <Badge variant="destructive">Hidden</Badge>
                  )}
                  {!book.isFeatured && !book.isHidden && (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge variant="secondary">
                    {book._count.bookmarks} User
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Panggil komponen tombol aksi */}
                  <AdminBookActions 
                    bookId={book.id} 
                    isFeatured={Boolean(book.isFeatured)} // Pastikan Boolean
                    isHidden={Boolean(book.isHidden)}     // Pastikan Boolean
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {books.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Belum ada buku di database lokal. User harus menyimpan buku terlebih dahulu.
          </div>
        )}
      </div>
    </div>
  );
}