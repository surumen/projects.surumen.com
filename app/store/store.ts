// app/store/store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

// ========================
// TYPE DEFINITIONS
// ========================

interface AppState {
  skin: 'light' | 'dark';
  acceptedCookies: boolean;
  changeSkin: (skin: 'light' | 'dark') => void;
  acceptCookies: () => void;
}

interface ProjectsState {
  activeFilters: string[];
  search: string;
  
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  setSearch: (search: string) => void;
}

// ========================
// STORE IMPLEMENTATIONS
// ========================

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      skin: 'light',
      acceptedCookies: false,
      
      changeSkin: (skin) => set((state) => {
        state.skin = skin;
      }),
      
      acceptCookies: () => set((state) => {
        state.acceptedCookies = true;
      })
    })),
    {
      name: 'app-storage'
    }
  )
);

export const useProjectsStore = create<ProjectsState>()(
  immer((set) => ({
    activeFilters: [],
    search: '',
    
    toggleFilter: (filter) => set((state) => {
      const index = state.activeFilters.indexOf(filter);
      if (index > -1) {
        state.activeFilters.splice(index, 1);
      } else {
        state.activeFilters.push(filter);
      }
    }),
    
    clearFilters: () => set((state) => {
      state.activeFilters = [];
    }),
    
    setSearch: (search) => set((state) => {
      state.search = search;
    })
  }))
);

// ========================
// STORE RE-EXPORTS
// ========================

export { useBracketStore } from './bracketStore';
export { useFPLStore } from './fplStore';
