"use client";

import { useReadingList } from "@/store/use-reading-list";
import { Button } from "@/components/ui/button";
import { X, Trash2, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ReadingListDrawer() {
  const { items, removeItem, isOpen, toggleOpen, clearList } = useReadingList();
  const [mounted, setMounted] = useState(false);

  // 1. Cek Environment (Local vs Production)
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-80 bg-white shadow-2xl border-l border-slate-200 p-6 flex flex-col transition-transform duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Reading List <span className="text-sm bg-blue-100 text-blue-700 px-2 rounded-full">{items.length}</span>
        </h3>
        <Button variant="ghost" size="icon" onClick={toggleOpen}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {items.length === 0 ? (
          <div className="text-center text-slate-400 mt-10">
            <p>Belum ada buku yang ditambahkan.</p>
          </div>
        ) : (
          items.map((book) => (
            <div key={book.id} className="flex gap-3 items-start border-b border-slate-100 pb-3">
              <div className="relative w-12 h-16 shrink-0 bg-slate-100 rounded overflow-hidden">
                {book.coverUrl ? (
                  <Image 
                    src={book.coverUrl} 
                    alt={book.title} 
                    fill 
                    className="object-cover"
                    unoptimized={isDev}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 line-clamp-2">{book.title}</p>
                <div className="flex gap-2 mt-2">
                    <Link href={`/book/${book.id}`} onClick={toggleOpen}>
                        <span className="text-xs text-blue-600 hover:underline cursor-pointer">Lihat</span>
                    </Link>
                    <button 
                        onClick={() => removeItem(book.id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center"
                    >
                        Hapus
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Button variant="destructive" className="w-full" onClick={clearList}>
            <Trash2 className="w-4 h-4 mr-2" />
            Bersihkan List
          </Button>
        </div>
      )}
    </div>
  );
}