import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tipe data buku sederhana untuk list
interface BookItem {
  id: string;
  title: string;
  coverUrl: string | null;
}

interface ReadingListState {
  items: BookItem[];
  addItem: (book: BookItem) => void;
  removeItem: (id: string) => void;
  clearList: () => void;
  isOpen: boolean; // Untuk mengontrol buka/tutup drawer list
  toggleOpen: () => void;
}

export const useReadingList = create<ReadingListState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      
      addItem: (book) => set((state) => {
        // Cek duplikasi
        if (state.items.find((i) => i.id === book.id)) return state;
        return { items: [...state.items, book] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

      clearList: () => set({ items: [] }),
      
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'muzlib-reading-list', // Nama key di LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);