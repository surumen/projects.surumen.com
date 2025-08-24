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
  toggleSkin: () => void;
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
// THEME HELPER FUNCTION
// ========================
const applyTheme = (skin: 'light' | 'dark') => {
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-bs-theme', skin);
  }
};

// ========================
// STORE IMPLEMENTATIONS
// ========================

export const useAppStore = create<AppState>()(
  persist(
    immer((set, get) => ({
      skin: 'light',
      acceptedCookies: false,
      
      changeSkin: (skin: 'light' | 'dark') => {
        set((draft) => {
          draft.skin = skin;
        });
        applyTheme(skin);
      },
      
      toggleSkin: () => {
        const newSkin = get().skin === 'light' ? 'dark' : 'light';
        set((draft) => {
          draft.skin = newSkin;
        });
        applyTheme(newSkin);
      },
      
      acceptCookies: () => set((draft) => {
        draft.acceptedCookies = true;
      })
    })),
    {
      name: 'app-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme when store rehydrates
        if (state?.skin) {
          applyTheme(state.skin);
        }
      }
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