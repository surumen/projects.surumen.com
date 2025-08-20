// app/store/cache/apiCache.ts
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheConfig {
  defaultTTL: number;
  maxEntries: number;
}

export class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes default
      maxEntries: 100,
      ...config,
    };
  }

  /**
   * Get cached data if valid, otherwise execute fetcher and cache result
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = this.config.defaultTTL
  ): Promise<T> {
    // Check if data is cached and still valid
    const cached = this.cache.get(key);
    if (cached && this.isValid(cached)) {
      return cached.data;
    }

    // Check if request is already pending (deduplication)
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending;
    }

    // Execute fetcher and cache result
    const fetchPromise = this.executeFetcher(key, fetcher, ttl);
    this.pendingRequests.set(key, fetchPromise);

    try {
      const data = await fetchPromise;
      return data;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Execute fetcher and handle caching
   */
  private async executeFetcher<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    try {
      const data = await fetcher();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      // If fetch fails, return stale data if available
      const cached = this.cache.get(key);
      if (cached) {
        console.warn(`Using stale cache for ${key} due to fetch error:`, error);
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Manually set cache entry
   */
  set<T>(key: string, data: T, ttl = this.config.defaultTTL): void {
    // Cleanup if cache is getting too large
    if (this.cache.size >= this.config.maxEntries) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Check if cache entry is still valid
   */
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    this.pendingRequests.delete(key);
  }

  /**
   * Invalidate entries matching pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
    for (const key of this.pendingRequests.keys()) {
      if (regex.test(key)) {
        this.pendingRequests.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    pendingRequests: number;
  } {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp < entry.ttl) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      pendingRequests: this.pendingRequests.size,
    };
  }
}

// ========================
// CACHE INSTANCES
// ========================

// Main FPL API cache with different TTLs for different data types
export const fplApiCache = new ApiCache({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxEntries: 200,
});

// ========================
// CACHE TTL CONSTANTS
// ========================

export const CACHE_TTL = {
  // Static data - cache for hours
  LEAGUE_INFO: 60 * 60 * 1000, // 1 hour
  MANAGER_INFO: 60 * 60 * 1000, // 1 hour
  ALL_PLAYERS: 60 * 60 * 1000, // 1 hour

  // Semi-static data - cache for longer periods
  MANAGER_HISTORY: 30 * 60 * 1000, // 30 minutes
  LEAGUE_STANDINGS: 15 * 60 * 1000, // 15 minutes

  // Dynamic data - shorter cache times
  MANAGER_TEAM: 10 * 60 * 1000, // 10 minutes
  MANAGER_TRANSFERS: 10 * 60 * 1000, // 10 minutes

  // Real-time data - very short cache
  STRATEGY: 2 * 60 * 1000, // 2 minutes
} as const;

// ========================
// CACHE KEY GENERATORS
// ========================

export const cacheKeys = {
  league: (leagueId: number) => `league:${leagueId}`,
  leagueStandings: (leagueId: number, page = 1) => `league:${leagueId}:standings:${page}`,
  leagueEntry: (leagueId: number, entryId: number) => `league:${leagueId}:entry:${entryId}`,
  manager: (managerId: number) => `manager:${managerId}`,
  managerTeam: (managerId: number, gameweek: number) => `manager:${managerId}:team:${gameweek}`,
  managerHistory: (managerId: number) => `manager:${managerId}:history`,
  managerTransfers: (managerId: number) => `manager:${managerId}:transfers`,
  allPlayers: () => 'players:all',
  player: (playerId: number) => `player:${playerId}`,
  strategy: (managerId: number) => `strategy:${managerId}`,
} as const;
