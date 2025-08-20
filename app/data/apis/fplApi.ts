import axios from 'axios';
import { fplApiCache, CACHE_TTL, cacheKeys } from '@/store/cache/apiCache';

const credentials = {
    username: process.env.NEXT_PUBLIC_FPL_USERNAME,
    password: process.env.NEXT_PUBLIC_FPL_PASSWORD,
    base_url: process.env.NEXT_PUBLIC_FPL_API_URL
};

const API_BASE = `${credentials.base_url}/api`;
const TOKEN_ENDPOINT = `${credentials.base_url}/token`;

let authToken: string | null = null;
let tokenExpiry: number | null = null;

export const authenticate = async () => {
    // Check if token is still valid (with 5-minute buffer)
    if (authToken && tokenExpiry && Date.now() < tokenExpiry - 5 * 60 * 1000) {
        return authToken;
    }

    const formData = new URLSearchParams();
    formData.append('username', credentials.username!);
    formData.append('password', credentials.password!);
    formData.append('grant_type', 'password');

    const response = await axios.post(TOKEN_ENDPOINT, formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    authToken = response.data.access_token;
    // Assume token expires in 1 hour (adjust based on your API)
    tokenExpiry = Date.now() + 60 * 60 * 1000;
    
    return authToken;
};

const apiClient = axios.create({
    baseURL: API_BASE,
    withCredentials: false,
});

apiClient.interceptors.request.use(async (config) => {
    const token = await authenticate();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ========================
// CACHED API FUNCTIONS
// ========================

export const getAllPlayers = () =>
    fplApiCache.get(
        cacheKeys.allPlayers(),
        () => apiClient.get(`/players`).then(res => res.data),
        CACHE_TTL.ALL_PLAYERS
    );

export const getPlayerById = (playerId: number) =>
    fplApiCache.get(
        cacheKeys.player(playerId),
        () => apiClient.get(`/players/${playerId}`).then(res => res.data),
        CACHE_TTL.ALL_PLAYERS // Players rarely change
    );

export const getLeague = (leagueId: number) =>
    fplApiCache.get(
        cacheKeys.league(leagueId),
        () => apiClient.get(`/leagues/${leagueId}`).then(res => res.data),
        CACHE_TTL.LEAGUE_INFO
    );

export const getLeagueStandings = (leagueId: number, page = 1) =>
    fplApiCache.get(
        cacheKeys.leagueStandings(leagueId, page),
        () => apiClient.get(`/leagues/${leagueId}/standings?page=${page}`).then(res => res.data),
        CACHE_TTL.LEAGUE_STANDINGS
    );

export const getLeagueEntry = (leagueId: number, entryId: number) =>
    fplApiCache.get(
        cacheKeys.leagueEntry(leagueId, entryId),
        () => apiClient.get(`/leagues/${leagueId}/entry/${entryId}`).then(res => res.data),
        CACHE_TTL.LEAGUE_STANDINGS
    );

export const getManagerInfo = (managerId: number) =>
    fplApiCache.get(
        cacheKeys.manager(managerId),
        () => apiClient.get(`/managers/${managerId}`).then(res => res.data),
        CACHE_TTL.MANAGER_INFO
    );

export const getManagerTeam = (managerId: number, gameweek: number) =>
    fplApiCache.get(
        cacheKeys.managerTeam(managerId, gameweek),
        () => apiClient.get(`/managers/${managerId}/team?gameweek=${gameweek}`).then(res => res.data),
        CACHE_TTL.MANAGER_TEAM
    );

export const getManagerHistory = (managerId: number) =>
    fplApiCache.get(
        cacheKeys.managerHistory(managerId),
        () => apiClient.get(`/managers/${managerId}/history`).then(res => res.data),
        CACHE_TTL.MANAGER_HISTORY
    );

export const getManagerTransfers = (managerId: number) =>
    fplApiCache.get(
        cacheKeys.managerTransfers(managerId),
        () => apiClient.get(`/managers/${managerId}/transfers`).then(res => res.data),
        CACHE_TTL.MANAGER_TRANSFERS
    );

// ========================
// CACHE MANAGEMENT
// ========================

/**
 * Clear all API cache
 */
export const clearApiCache = () => {
    fplApiCache.clear();
};

/**
 * Invalidate cache for specific manager
 */
export const invalidateManagerCache = (managerId: number) => {
    fplApiCache.invalidatePattern(`manager:${managerId}`);
};

/**
 * Invalidate cache for specific league
 */
export const invalidateLeagueCache = (leagueId: number) => {
    fplApiCache.invalidatePattern(`league:${leagueId}`);
};

/**
 * Get cache statistics
 */
export const getApiCacheStats = () => {
    return fplApiCache.getStats();
};
