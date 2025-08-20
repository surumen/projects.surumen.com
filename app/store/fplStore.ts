// app/store/fplStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import {
    getLeague,
    getLeagueStandings,
    getManagerHistory,
    getManagerInfo,
    getManagerTeam,
    getManagerTransfers,
    getPlayerById
} from '@/data/apis/fplApi';
import { fetchManagerStrategy } from '@/data/apis/fplRecommender';
import type { PremierLeaguePlayer, ManagerStrategy, ManagerHistoryEntry } from '@/types';

// ========================
// TYPE DEFINITIONS
// ========================

interface FPLState {
    // Core data
    league: any;
    standings: any[];
    entry: number | null;
    managerInfo: any;
    managerHistory: any;
    managerTransfers: any[];
    managerTeam: any;
    allManagerHistories: ManagerHistoryEntry[];
    allPlayers: PremierLeaguePlayer[];
    
    // Strategy data
    strategy?: ManagerStrategy;
    
    // Loading states
    loading: boolean;
    error: string | null;
    strategyLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    strategyError?: string;
}

interface FPLActions {
    // Data setters
    setAllPlayers: (players: PremierLeaguePlayer[]) => void;
    reset: () => void;
    
    // API actions
    fetchLeagueData: (leagueId: number) => Promise<void>;
    fetchManagerData: (managerId: number) => Promise<void>;
    fetchManagerTeam: (managerId: number, gameweek: number) => Promise<void>;
    fetchAllManagerHistories: (standings: any[]) => Promise<void>;
    planManagerStrategy: (managerId: number) => Promise<void>;
}

type FPLStore = FPLState & FPLActions;

// ========================
// INITIAL STATE
// ========================

const initialState: FPLState = {
    league: null,
    standings: [],
    entry: null,
    managerInfo: null,
    managerHistory: null,
    managerTransfers: [],
    managerTeam: null,
    allManagerHistories: [],
    allPlayers: [],
    strategy: undefined,
    loading: false,
    error: null,
    strategyLoading: 'idle',
    strategyError: undefined,
};

// ========================
// STORE IMPLEMENTATION
// ========================

export const useFPLStore = create<FPLStore>()(
    devtools(
        immer((set, get) => ({
            ...initialState,

            // ========================
            // DATA SETTERS
            // ========================
            
            setAllPlayers: (players) => set((state) => {
                state.allPlayers = players;
            }),

            reset: () => set((state) => {
                Object.assign(state, initialState);
            }),

            // ========================
            // API ACTIONS
            // ========================

            fetchLeagueData: async (leagueId) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    const [league, standingsData] = await Promise.all([
                        getLeague(leagueId),
                        getLeagueStandings(leagueId)
                    ]);

                    set((state) => {
                        state.league = league;
                        state.standings = standingsData.standings;
                        state.loading = false;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.loading = false;
                        state.error = error.message || 'Failed to fetch league data';
                    });
                }
            },

            fetchManagerData: async (managerId) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    const [managerInfo, managerHistory, managerTransfers] = await Promise.all([
                        getManagerInfo(managerId),
                        getManagerHistory(managerId),
                        getManagerTransfers(managerId),
                    ]);

                    set((state) => {
                        state.managerInfo = managerInfo;
                        state.managerHistory = managerHistory;
                        state.managerTransfers = managerTransfers;
                        state.loading = false;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.loading = false;
                        state.error = error.message || 'Failed to fetch manager data';
                    });
                }
            },

            fetchManagerTeam: async (managerId, gameweek) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    const team = await getManagerTeam(managerId, gameweek);
                    const picks = team.picks;
                    const uniquePlayerIds: number[] = [
                        ...new Set<number>(picks.map((p) => p.element)),
                    ];

                    // Fetch player details for all picks
                    const players = await Promise.all(
                        uniquePlayerIds.map(async (id) => {
                            const player = await getPlayerById(id);
                            const pick = picks.find((p) => p.element === id)!;
                            return {
                                ...player,
                                is_captain: pick.is_captain,
                                is_vice_captain: pick.is_vice_captain,
                            };
                        })
                    );

                    set((state) => {
                        state.managerTeam = team;
                        state.allPlayers = players;
                        state.loading = false;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.loading = false;
                        state.error = error.message || 'Failed to fetch manager team';
                    });
                }
            },

            fetchAllManagerHistories: async (standings) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    const results = await Promise.all(
                        standings.map(async (manager) => {
                            const history = await getManagerHistory(manager.entry);
                            return {
                                managerName: manager.entry_name,
                                entryId: manager.entry,
                                history: history.current,
                            };
                        })
                    );

                    set((state) => {
                        state.allManagerHistories = results;
                        state.loading = false;
                    });
                } catch (error: any) {
                    set((state) => {
                        state.loading = false;
                        state.error = 'Failed to fetch manager histories';
                    });
                }
            },

            planManagerStrategy: async (managerId) => {
                set((state) => {
                    state.strategyLoading = 'pending';
                    state.strategyError = undefined;
                });

                try {
                    const strategy = await fetchManagerStrategy(managerId);
                    
                    set((state) => {
                        state.strategy = strategy;
                        state.strategyLoading = 'succeeded';
                    });
                } catch (error: any) {
                    set((state) => {
                        state.strategyLoading = 'failed';
                        state.strategyError = error.message || 'Failed to plan strategy';
                    });
                }
            },
        })),
        {
            name: 'fpl-store',
        }
    )
);

export default useFPLStore;
