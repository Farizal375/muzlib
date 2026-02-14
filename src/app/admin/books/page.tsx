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
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Manajemen Buku</h1>
        <Badge variant="outline" className="text-sm md:text-base px-3 py-1">
          {books.length} Buku Lokal
        </Badge>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* WRAPPER RESPONSIVE (PENTING!) */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-4">Cover</th>
                <th className="px-4 py-3 md:px-6 md:py-4">Judul & Penulis</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-center">Status</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-center">Popularitas</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 md:px-6 md:py-4 w-16 md:w-20">
                    <div className="relative h-12 w-9 md:h-16 md:w-12 bg-slate-200 rounded overflow-hidden">
                      <Image 
                        src={book.coverUrl || "/images/book-placeholder.png"} 
                        alt={book.title} 
                        fill 
                        className="object-cover"
                        unoptimized 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 max-w-[200px] truncate">
                    <p className="font-semibold text-slate-900 truncate" title={book.title}>{book.title}</p>
                    <p className="text-slate-500 text-xs truncate">{book.author}</p>
                    <p className="text-slate-400 text-[10px] mt-1 font-mono hidden md:block">{book.openLibraryId}</p>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 text-center space-y-1">
                    {book.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 text-[10px] md:text-xs">
                        Featured
                      </Badge>
                    )}
                    {book.isHidden && (
                      <Badge variant="destructive" className="text-[10px] md:text-xs">Hidden</Badge>
                    )}
                    {!book.isFeatured && !book.isHidden && (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                    <Badge variant="secondary" className="text-[10px] md:text-xs">
                      {book._count.bookmarks} User
                    </Badge>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                    <AdminBookActions 
                      bookId={book.id} 
                      isFeatured={Boolean(book.isFeatured)} 
                      isHidden={Boolean(book.isHidden)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {books.length === 0 && (
          <div className="p-8 md:p-12 text-center text-slate-500 text-sm">
            Belum ada buku di database lokal.
          </div>
        )}
      </div>
    </div>
  );
}