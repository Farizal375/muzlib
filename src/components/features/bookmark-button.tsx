"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner"; // Pakai library toast bawaan Shadcn
import { toggleBookmark } from "@/actions/bookmark-action";
import { Book } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  book: Book;
  initialState?: boolean; // Status awal (sudah dilike atau belum)
  size?: "sm" | "default" | "lg";
  variant?: "default" | "ghost" | "outline" | "secondary";
  showText?: boolean;
}

export function BookmarkButton({ 
  book, 
  initialState = false, 
  size = "default",
  variant = "default",
  showText = true
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialState);
  const [isPending, startTransition] = useTransition();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah link card terklik (jika tombol ada di dalam card)
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Silakan login terlebih dahulu!");
      router.push("/sign-in");
      return;
    }

    // Optimistic UI: Langsung ubah warna icon sebelum server merespon
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    startTransition(async () => {
      const result = await toggleBookmark(book);
      
      if (result.success) {
        toast.success(result.message);
        // Pastikan state sinkron dengan server
        if (result.isBookmarked !== undefined) {
          setIsBookmarked(result.isBookmarked);
        }
      } else {
        // Revert jika gagal
        setIsBookmarked(previousState);
        toast.error(result.message);
      }
    });
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleClick}
      disabled={isPending}
      className={isBookmarked ? "text-blue-600" : ""}
    >
      <Bookmark 
        className={`w-4 h-4 ${showText ? "mr-2" : ""} ${isBookmarked ? "fill-current" : ""}`} 
      />
      {showText && (isBookmarked ? "Disimpan" : "Simpan")}
    </Button>
  );
}