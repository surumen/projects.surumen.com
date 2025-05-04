import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getLeague,
    getLeagueStandings,
    getLeagueEntry,
    getManagerInfo,
    getManagerHistory,
    getManagerTransfers
} from '@/helpers/fplApi';

const initialState = {
    league: null,
    standings: [],
    entry: null,
    managerInfo: null,
    managerHistory: null,
    managerTransfers: [],
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
                // state.error = action.error.message;
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
                // state.error = action.error.message;
            });
    },
});

export default fplSlice.reducer;
