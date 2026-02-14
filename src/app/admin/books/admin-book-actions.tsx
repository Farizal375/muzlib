"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Star, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";
import { toggleBookFeatured, toggleBookHidden } from "@/actions/admin-actions";

interface AdminActionsProps {
  bookId: string;
  isFeatured: boolean;
  isHidden: boolean;
}

export function AdminBookActions({ bookId, isFeatured, isHidden }: AdminActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleFeatured = () => {
    startTransition(async () => {
      const res = await toggleBookFeatured(bookId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleHidden = () => {
    startTransition(async () => {
      const res = await toggleBookHidden(bookId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        size="sm" 
        variant={isFeatured ? "default" : "outline"} 
        onClick={handleFeatured}
        disabled={isPending}
        className={isFeatured ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
        title="Jadikan Featured di Homepage"
      >
        <Star className={`w-4 h-4 ${isFeatured ? "fill-current" : ""}`} />
      </Button>

      <Button 
        size="sm" 
        variant={isHidden ? "destructive" : "outline"}
        onClick={handleHidden}
        disabled={isPending}
        title={isHidden ? "Tampilkan Kembali" : "Sembunyikan Buku (Blacklist)"}
      >
        {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>
    </div>
  );
}