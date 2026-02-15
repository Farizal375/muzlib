"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTrendingLimit } from "@/actions/admin-settings-actions";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface TrendingFormProps {
  initialLimit: number;
}

export function TrendingForm({ initialLimit }: TrendingFormProps) {
  const [limit, setLimit] = useState(initialLimit);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateTrendingLimit(limit);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 max-w-md">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-slate-900">Trending Homepage</h3>
        <p className="text-sm text-slate-500">
          Tentukan berapa banyak buku trending yang muncul di halaman depan.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="limit">Jumlah Buku</Label>
        <div className="flex items-center gap-4">
          <Input
            id="limit"
            type="number"
            min={4}
            max={100}
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
            className="w-24"
            disabled={isPending}
          />
          <span className="text-sm text-slate-500">Item</span>
        </div>
        <p className="text-xs text-slate-400">
          Disarankan antara 10 - 40 agar loading tidak terlalu berat.
        </p>
      </div>

      <div className="pt-2">
        <Button 
          onClick={handleSave} 
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}