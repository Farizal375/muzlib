// src/lib/openlibrary.ts

import { 
  Book, 
  OpenLibSearchResponse, 
  OpenLibSubjectResponse, 
  OpenLibDoc, 
  OpenLibWork 
} from "@/types";

const BASE_URL = "https://openlibrary.org";
const COVER_URL = "https://covers.openlibrary.org/b/id";

// --- Helpers: Mapping Data Mentah ke Tipe 'Book' ---

// Mapping untuk hasil SEARCH
const mapSearchToBook = (doc: OpenLibDoc): Book => ({
  id: doc.key, // Gunakan key sementara sebagai ID
  openLibraryId: doc.key,
  title: doc.title,
  author: doc.author_name?.[0] || "Unknown Author",
  coverUrl: doc.cover_i 
    ? `${COVER_URL}/${doc.cover_i}-L.jpg` 
    : "/images/book-placeholder.png", // Pastikan nanti Anda punya gambar ini atau ganti URL placeholder online
  publishYear: doc.first_publish_year || 0,
  isFeatured: false,
});

// Mapping untuk hasil TRENDING (Subject)
const mapWorkToBook = (work: OpenLibWork): Book => ({
  id: work.key,
  openLibraryId: work.key,
  title: work.title,
  author: work.authors?.[0]?.name || "Unknown Author",
  coverUrl: work.cover_id 
    ? `${COVER_URL}/${work.cover_id}-L.jpg` 
    : "/images/book-placeholder.png",
  publishYear: work.first_publish_year || 0,
  isFeatured: false,
});

// --- Main Functions ---

/**
 * 1. Mencari buku berdasarkan query (Judul/Penulis)
 * Digunakan di halaman Search (SSR)
 */
export async function searchBooks(query: string, limit = 12): Promise<Book[]> {
  if (!query) return [];
  
  try {
    const url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url);
    
    if (!res.ok) throw new Error("Failed to fetch books");
    
    const data: OpenLibSearchResponse = await res.json();
    
    // Filter hanya buku yang punya cover (opsional, biar UI bagus)
    return data.docs
      .filter((doc) => doc.cover_i) 
      .map(mapSearchToBook);
      
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
}

/**
 * 2. Mengambil buku trending berdasarkan topik
 * Digunakan di Homepage (SSG)
 */
export async function getTrendingBooks(subject = "programming"): Promise<Book[]> {
  try {
    const url = `${BASE_URL}/subjects/${subject}.json?limit=6`;
    // Revalidate tiap 1 jam (ISR)
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) return [];
    
    const data: OpenLibSubjectResponse = await res.json();
    return data.works.map(mapWorkToBook);
    
  } catch (error) {
    console.error("Error fetching trending books:", error);
    return [];
  }
}

/**
 * 3. Mengambil detail satu buku
 * Digunakan di halaman Detail Buku
 */
export async function getBookDetail(key: string): Promise<Book | null> {
  try {
    // Key biasanya format "/works/OL123W", API butuh "OL123W"
    const cleanKey = key.replace("/works/", "");
    const url = `${BASE_URL}/works/${cleanKey}.json`;
    
    const res = await fetch(url, { next: { revalidate: 86400 } }); // Cache 24 jam
    if (!res.ok) return null;

    const data = await res.json();

    // Perlu fetch author terpisah karena detail API return author key, bukan nama
    // Untuk simplifikasi phase ini, kita return data dasar dulu
    return {
      id: key,
      openLibraryId: key,
      title: data.title,
      author: "Loading...", // Nanti kita perbaiki di Phase UI Detail
      coverUrl: data.covers?.[0] 
        ? `${COVER_URL}/${data.covers[0]}-L.jpg` 
        : "/images/book-placeholder.png",
      publishYear: 0,
      description: typeof data.description === 'string' 
        ? data.description 
        : data.description?.value || "No description available.",
    };

  } catch (error) {
    console.error("Error fetching book detail:", error);
    return null;
  }
}