import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    getLeague,
    getLeagueStandings,
    getManagerHistory,
    getManagerInfo,
    getManagerTransfers
} from '@/helpers/fplApi';


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
    allManagerHistories: ManagerHistoryEntry[];
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
    allManagerHistories: [],
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

export const fetchAllManagerHistories = createAsyncThunk(
    'fpl/fetchAllManagerHistories',
    async (standings: any[]) => {
        const results = await Promise.all(
            standings.map(async (manager) => {
                const history = await getManagerHistory(manager.entry);
                return {
                    managerName: manager.entry_name,
                    entryId: manager.entry,
                    history: history.current // or reshape here if preferred
                };
            })
        );

        return results; // Array of { managerName, entryId, history }
    }
);


const fplSlice = createSlice({
    name: 'fpl',
    initialState,
    reducers: {},
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
            });
    },
});

export default fplSlice.reducer;
