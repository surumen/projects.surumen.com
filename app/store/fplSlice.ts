import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    getLeague,
    getLeagueStandings,
    getManagerHistory,
    getManagerInfo,
    getManagerTeam,
    getManagerTransfers,
    getPlayerById
} from '@/data/fplApi';
import type { Player } from '@/types/Player';

interface ManagerHistoryEntry {
    managerName: string;
    entryId: number;
    history: {
        event: number;
        total_points: number;
        [key: string]: any;
    }[];
}

interface FPLState {
    league: any;
    standings: any[];
    entry: number | null;
    managerInfo: any;
    managerHistory: any;
    managerTransfers: any[];
    managerTeam: any;
    allManagerHistories: ManagerHistoryEntry[];
    allPlayers: Player[];
    loading: boolean;
    error: string | null | undefined;
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
};

export const fetchLeagueData = createAsyncThunk('fpl/fetchLeagueData', async (leagueId: number) => {
    const league = await getLeague(leagueId);
    const standings = await getLeagueStandings(leagueId);
    return { league, standings };
});

export const fetchManagerData = createAsyncThunk('fpl/fetchManagerData', async (managerId: number) => {
    const [managerInfo, managerHistory, managerTransfers] = await Promise.all([
        getManagerInfo(managerId),
        getManagerHistory(managerId),
        getManagerTransfers(managerId)
    ]);
    return { managerInfo, managerHistory, managerTransfers };
});

export const fetchManagerTeam = createAsyncThunk(
    'fpl/fetchManagerTeam',
    async ({ managerId, gameweek }: { managerId: number, gameweek: number }, thunkAPI) => {
        const team = await getManagerTeam(managerId, gameweek);
        const picks = team.picks;

        const uniquePlayerIds: number[] = [...new Set<number>(picks.map(p => p.element))];
        const players = await Promise.all(uniquePlayerIds.map((id) => getPlayerById(id)));

        // Add to state using a reducer
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
                    history: history.current
                };
            })
        );
        return results;
    }
);

const fplSlice = createSlice({
    name: 'fpl',
    initialState,
    reducers: {
        setAllPlayers: (state, action) => {
            state.allPlayers = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLeagueData.pending, state => {
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
            .addCase(fetchManagerData.pending, state => {
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
            .addCase(fetchAllManagerHistories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllManagerHistories.fulfilled, (state, action) => {
                state.allManagerHistories = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllManagerHistories.rejected, (state, action) => {
                state.loading = false;
                state.error = 'Failed to fetch manager histories';
            })
            .addCase(fetchManagerTeam.pending, state => {
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
            });
    },
});

export const { setAllPlayers } = fplSlice.actions;

export default fplSlice.reducer;
