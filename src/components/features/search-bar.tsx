"use client"; // Wajib karena pakai hooks (useState, useRouter)

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil nilai default dari URL jika ada (biar kalau refresh text gak hilang)
  const defaultQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(defaultQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman full
    if (!query.trim()) return;
    
    // Pindah ke halaman search dengan query param
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Cari judul, penulis, ISBN..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-white"
      />
      <Button type="submit">
        <Search className="h-4 w-4 mr-2" />
        Cari
      </Button>
    </form>
  );
}