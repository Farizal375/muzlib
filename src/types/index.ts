// src/types/index.ts

// --- 1. Tipe Data dari API Open Library (Raw Data) ---

// Struktur satu buku dari hasil Search
export interface OpenLibDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  isbn?: string[];
  language?: string[];
}

// Struktur response dari endpoint Search
export interface OpenLibSearchResponse {
  numFound: number;
  docs: OpenLibDoc[];
}

// Struktur satu buku dari hasil Subject/Trending (Beda struktur dengan search)
export interface OpenLibWork {
  key: string;
  title: string;
  authors: { name: string; key: string }[]; // Di sini author adalah array of object
  cover_id?: number;
  first_publish_year?: number;
}

// Struktur response dari endpoint Subject
export interface OpenLibSubjectResponse {
  key: string;
  name: string;
  work_count: number;
  works: OpenLibWork[];
}

// --- 2. Tipe Data Aplikasi Internal (Unified) ---
// Ini adalah bentuk data yang akan kita pakai di UI (Components)
export interface Book {
  id: string;             // Bisa ID dari DB lokal atau string random
  openLibraryId: string;  // Key dari API (misal: /works/OL12345W)
  title: string;
  author: string;         // Kita ambil penulis pertama saja agar simpel
  coverUrl: string;
  publishYear: number;
  description?: string;
  
  // Status untuk Admin/User (Nanti diisi dari DB)
  isFeatured?: boolean;
  isHidden?: boolean;
  isBookmarked?: boolean;
}