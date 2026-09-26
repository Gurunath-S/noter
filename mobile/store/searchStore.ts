import { create } from 'zustand';
import { getItem, setItem } from '../services/storage/asyncStorage';
import { STORAGE_KEYS } from '../services/storage/keys';
import { IdeaType, SortOption, Status } from '../types/common';

interface SearchState {
  query: string;
  searchQuery: string;
  recentSearches: string[];
  activeCategory: 'all' | 'ideas' | 'projects' | 'notes';
  activeType: IdeaType | 'all';
  activeStatus: Status | 'all';
  sortBy: SortOption;
  isSemanticSearch: boolean;

  setQuery: (q: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveType: (t: IdeaType | 'all') => void;
  setActiveStatus: (s: Status | 'all') => void;
  setSortBy: (s: SortOption) => void;
  loadRecentSearches: () => Promise<void>;
  addRecentSearch: (term: string) => Promise<void>;
  removeRecentSearch: (term: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
  setActiveCategory: (cat: 'all' | 'ideas' | 'projects' | 'notes') => void;
  toggleSemanticSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  searchQuery: '',
  recentSearches: ['AI Resume', 'Finance', 'MERN', 'Trading', 'Tailwind'],
  activeCategory: 'all',
  activeType: 'all',
  activeStatus: 'all',
  sortBy: 'newest',
  isSemanticSearch: false,

  setQuery: (query) => set({ query, searchQuery: query }),
  setSearchQuery: (searchQuery) => set({ query: searchQuery, searchQuery }),
  setActiveType: (activeType) => set({ activeType }),
  setActiveStatus: (activeStatus) => set({ activeStatus }),
  setSortBy: (sortBy) => set({ sortBy }),

  loadRecentSearches: async () => {
    const history = await getItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES, get().recentSearches);
    set({ recentSearches: history });
  },

  addRecentSearch: async (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const current = get().recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...current].slice(0, 10);
    set({ recentSearches: updated });
    await setItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
  },

  removeRecentSearch: async (term) => {
    const updated = get().recentSearches.filter((item) => item !== term);
    set({ recentSearches: updated });
    await setItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
  },

  clearRecentSearches: async () => {
    set({ recentSearches: [] });
    await setItem(STORAGE_KEYS.RECENT_SEARCHES, []);
  },

  setActiveCategory: (activeCategory) => set({ activeCategory }),

  toggleSemanticSearch: () => set((state) => ({ isSemanticSearch: !state.isSemanticSearch })),
}));
