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
  id: doc.key.replace("/works/", ""), // <--- PERBAIKAN: Hapus prefix /works/
  openLibraryId: doc.key.replace("/works/", ""), // <--- PERBAIKAN: Hapus prefix /works/
  title: doc.title,
  author: doc.author_name?.[0] || "Unknown Author",
  coverUrl: doc.cover_i 
    ? `${COVER_URL}/${doc.cover_i}-L.jpg` 
    : "/images/book-placeholder.png",
  publishYear: doc.first_publish_year || 0,
  isFeatured: false,
});

// Mapping untuk hasil TRENDING (Subject)
const mapWorkToBook = (work: OpenLibWork): Book => ({
  id: work.key.replace("/works/", ""), // <--- PERBAIKAN: Hapus prefix /works/
  openLibraryId: work.key.replace("/works/", ""), // <--- PERBAIKAN: Hapus prefix /works/
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
 * 1. Mencari buku berdasarkan query
 */
export async function searchBooks(query: string, limit = 12): Promise<Book[]> {
  if (!query) return [];
  
  try {
    const url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url);
    
    if (!res.ok) throw new Error("Failed to fetch books");
    
    const data: OpenLibSearchResponse = await res.json();
    
    return data.docs
      .filter((doc) => doc.cover_i) 
      .map(mapSearchToBook);
      
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
}

/**
 * 2. Mengambil buku trending
 */
export async function getTrendingBooks(subject = "programming"): Promise<Book[]> {
  try {
    const url = `${BASE_URL}/subjects/${subject}.json?limit=6`;
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
 * 3. Mengambil detail satu buku (UPDATED)
 */
export async function getBookDetail(key: string): Promise<Book | null> {
  try {
    // Pastikan key bersih dari "/works/" (Double check)
    const cleanKey = key.replace("/works/", "");
    const url = `${BASE_URL}/works/${cleanKey}.json`;
    
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data = await res.json();

    // Fetch Author Name
    let authorName = "Unknown Author";
    if (data.authors && data.authors.length > 0) {
      try {
        const authorKey = data.authors[0].author.key.replace("/authors/", "");
        const authorRes = await fetch(`${BASE_URL}/authors/${authorKey}.json`);
        const authorData = await authorRes.json();
        authorName = authorData.name || "Unknown Author";
      } catch (err) {
        console.error("Failed to fetch author detail", err);
      }
    }

    return {
      id: cleanKey,
      openLibraryId: cleanKey,
      title: data.title,
      author: authorName,
      coverUrl: data.covers?.[0] 
        ? `${COVER_URL}/${data.covers[0]}-L.jpg` 
        : "/images/book-placeholder.png",
      publishYear: parseInt(data.created?.value?.substring(0, 4)) || 0,
      description: typeof data.description === 'string' 
        ? data.description 
        : data.description?.value || "Tidak ada deskripsi untuk buku ini.",
    };

  } catch (error) {
    console.error("Error fetching book detail:", error);
    return null;
  }
}