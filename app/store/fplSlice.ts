import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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


interface FPLState {
    league: any;
    standings: any[];
    entry: number | null;
    managerInfo: any;
    managerHistory: any;
    managerTransfers: any[];
    managerTeam: any;
    allManagerHistories: ManagerHistoryEntry[];
    allPlayers: PremierLeaguePlayer[];
    loading: boolean;
    error: string | null | undefined;
    // new strategy fields
    strategy?: ManagerStrategy;
    strategyLoading: 'idle' | 'pending' | 'succeeded' | 'failed';
    strategyError?: string;
}

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
    loading: false,
    error: null,
    strategyLoading: 'idle',
};

export const fetchLeagueData = createAsyncThunk(
    'fpl/fetchLeagueData',
    async (leagueId: number) => {
        const league = await getLeague(leagueId);
        const standings = await getLeagueStandings(leagueId);
        return { league, standings };
    }
);

export const fetchManagerData = createAsyncThunk(
    'fpl/fetchManagerData',
    async (managerId: number) => {
        const [managerInfo, managerHistory, managerTransfers] = await Promise.all([
            getManagerInfo(managerId),
            getManagerHistory(managerId),
            getManagerTransfers(managerId),
        ]);
        return { managerInfo, managerHistory, managerTransfers };
    }
);

export const fetchManagerTeam = createAsyncThunk(
    'fpl/fetchManagerTeam',
    async (
        { managerId, gameweek }: { managerId: number; gameweek: number },
        thunkAPI
    ) => {
        const team = await getManagerTeam(managerId, gameweek);
        const picks = team.picks;
        const uniquePlayerIds: number[] = [
            ...new Set<number>(picks.map((p) => p.element)),
        ];

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

        thunkAPI.dispatch(setAllPlayers(players));
        return team;
    }
);

export const fetchAllManagerHistories = createAsyncThunk(
    'fpl/fetchAllManagerHistories',
    async (standings: any[]) => {
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
        return results;
    }
);

// new thunk for the strategy tool
export const planManagerStrategy = createAsyncThunk<
    ManagerStrategy,
    number,
    { rejectValue: string }
>(
    'fpl/planManagerStrategy',
    async (managerId, thunkAPI) => {
        try {
            return await fetchManagerStrategy(managerId);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

const fplSlice = createSlice({
    name: 'fpl',
    initialState,
    reducers: {
        setAllPlayers: (state, action: PayloadAction<PremierLeaguePlayer[]>) => {
            state.allPlayers = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchLeagueData
            .addCase(fetchLeagueData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeagueData.fulfilled, (state, action) => {
                state.league = action.payload.league;
                state.standings = action.payload.standings.standings;
                state.loading = false;
            })
            .addCase(fetchLeagueData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // fetchManagerData
            .addCase(fetchManagerData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManagerData.fulfilled, (state, action) => {
                state.managerInfo = action.payload.managerInfo;
                state.managerHistory = action.payload.managerHistory;
                state.managerTransfers = action.payload.managerTransfers;
                state.loading = false;
            })
            .addCase(fetchManagerData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // fetchAllManagerHistories
            .addCase(fetchAllManagerHistories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllManagerHistories.fulfilled, (state, action) => {
                state.allManagerHistories = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllManagerHistories.rejected, (state) => {
                state.loading = false;
                state.error = 'Failed to fetch manager histories';
            })

            // fetchManagerTeam
            .addCase(fetchManagerTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManagerTeam.fulfilled, (state, action) => {
                state.managerTeam = action.payload;
                state.loading = false;
            })
            .addCase(fetchManagerTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // planManagerStrategy
            .addCase(planManagerStrategy.pending, (state) => {
                state.strategyLoading = 'pending';
                state.strategyError = undefined;
            })
            .addCase(
                planManagerStrategy.fulfilled,
                (state, action: PayloadAction<ManagerStrategy>) => {
                    state.strategyLoading = 'succeeded';
                    state.strategy = action.payload;
                }
            )
            .addCase(planManagerStrategy.rejected, (state, action) => {
                state.strategyLoading = 'failed';
                state.strategyError = action.payload;
            });
    },
});

export const { setAllPlayers } = fplSlice.actions;
export default fplSlice.reducer;
