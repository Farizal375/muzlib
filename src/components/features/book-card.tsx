import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "./bookmark-button"; // Import tombol pintar kita

interface BookCardProps {
  book: Book;
  isBookmarked?: boolean; // Tambahan prop opsional
}

export function BookCard({ book, isBookmarked = false }: BookCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-slate-200 h-full flex flex-col">
      <div className="relative aspect-[2/3] w-full bg-slate-100">
        <Image
          src={book.coverUrl}
          alt={book.title}
          fill
          unoptimized={true}
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay saat hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link href={`/book/${book.openLibraryId}`}>
            <Button variant="secondary" size="sm">
              Lihat Detail
            </Button>
          </Link>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1">
        <h3 className="font-bold text-lg leading-tight line-clamp-2" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{book.author}</p>
        <p className="text-xs text-slate-400 mt-2">
          Terbit: {book.publishYear > 0 ? book.publishYear : "-"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* TOMBOL DIGANTI DI SINI */}
        <div className="w-full">
          <BookmarkButton 
            book={book} 
            initialState={isBookmarked}
            variant="ghost"
            size="sm"
            // Kita atur style agar mirip tombol sebelumnya (lebar penuh)
            className="w-full justify-start text-slate-500 hover:text-blue-600" 
          />
        </div>
      </CardFooter>
    </Card>
  );
}