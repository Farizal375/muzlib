"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Check, BookOpen } from "lucide-react";
import { useReadingList } from "@/store/use-reading-list";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookCardProps {
  book: {
    openLibraryId: string;
    title: string;
    author: string;
    coverUrl: string | null;
    publishYear: number;
    description?: string;
  };
}

export function BookCard({ book }: BookCardProps) {
  const { addItem, items } = useReadingList();
  const isAdded = items.some((item) => item.id === book.openLibraryId);

  const isDev = process.env.NODE_ENV === "development";

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (isAdded) {
      toast.info("Buku sudah ada di Reading List Anda.");
      return;
    }

    addItem({
      id: book.openLibraryId,
      title: book.title,
      coverUrl: book.coverUrl,
    });

    toast.success("Berhasil ditambahkan ke Reading List!");
  };

  return (
    <Link 
      href={`/book/${book.openLibraryId}`} 
      className="group flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[2/3] w-full bg-slate-100 overflow-hidden">
        
        <button
          onClick={handleAddToList}
          disabled={isAdded}
          className={cn(
            "absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition-all duration-300",
            isAdded 
              ? "bg-green-500 text-white opacity-100 cursor-default" 
              : "bg-white/90 text-slate-700 hover:bg-blue-600 hover:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          )}
          title={isAdded ? "Sudah ditambahkan" : "Tambah ke Reading List"}
        >
          {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>

        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            unoptimized={isDev} 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <BookOpen className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs">No Cover</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-slate-500 mb-2">{book.author}</p>
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
            {book.publishYear || "N/A"}
          </span>
        </div>
      </div>
    </Link>
  );
}