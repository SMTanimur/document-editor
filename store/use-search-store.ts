import { create } from 'zustand';

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '', // Initial search query is empty
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useSearchStore; 