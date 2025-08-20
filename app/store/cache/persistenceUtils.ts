// app/store/cache/persistenceUtils.ts
import type { PersistStorage, StorageValue } from 'zustand/middleware';

/**
 * Check if we're running in a browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Custom storage implementation for Zustand persistence
 * Handles JSON serialization/deserialization with error handling
 * Safe for SSR - returns null when localStorage is not available
 */
export const createPersistentStorage = <T>(storageKey: string): PersistStorage<T> => ({
  getItem: (name: string): StorageValue<T> | null => {
    // Return null during SSR
    if (!isBrowser) return null;
    
    try {
      const item = localStorage.getItem(name);
      if (!item) return null;
      return JSON.parse(item) as StorageValue<T>;
    } catch (error) {
      console.warn(`Failed to get item from localStorage for ${name}:`, error);
      return null;
    }
  },
  
  setItem: (name: string, value: StorageValue<T>): void => {
    // Do nothing during SSR
    if (!isBrowser) return;
    
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to set item in localStorage for ${name}:`, error);
    }
  },
  
  removeItem: (name: string): void => {
    // Do nothing during SSR
    if (!isBrowser) return;
    
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn(`Failed to remove item from localStorage for ${name}:`, error);
    }
  },
});

/**
 * Serialize state for persistence, excluding functions and sensitive data
 */
export const serializeState = (state: any) => {
  const serializable = { ...state };
  
  // Remove functions and non-serializable data
  delete serializable.fetchLeagueData;
  delete serializable.fetchManagerData;
  delete serializable.fetchManagerTeam;
  delete serializable.fetchAllManagerHistories;
  delete serializable.planManagerStrategy;
  delete serializable.setAllPlayers;
  delete serializable.reset;
  
  // Remove loading states (should start fresh)
  delete serializable.loading;
  delete serializable.strategyLoading;
  delete serializable.error;
  delete serializable.strategyError;
  
  return serializable;
};

/**
 * Deserialize state from persistence, adding back default values
 */
export const deserializeState = (persistedState: any) => {
  return {
    ...persistedState,
    // Reset loading states
    loading: false,
    error: null,
    strategyLoading: 'idle' as const,
    strategyError: undefined,
  };
};

/**
 * Check if persisted data is still valid based on timestamp
 */
export const isPersistenceValid = (
  persistedState: any,
  maxAge = 24 * 60 * 60 * 1000 // 24 hours default
): boolean => {
  if (!persistedState || !persistedState._timestamp) {
    return false;
  }
  
  return Date.now() - persistedState._timestamp < maxAge;
};

/**
 * Add timestamp to state for persistence validation
 */
export const addTimestamp = (state: any) => ({
  ...state,
  _timestamp: Date.now(),
});
