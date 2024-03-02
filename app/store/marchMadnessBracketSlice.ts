// import node module libraries
import { createSlice } from '@reduxjs/toolkit'

// import data files
import { MARCH_MADNESS_2024 } from '@/data/MarchMadness2024';
import { advanceToNextRound } from "@/widgets/brackets-advanced/utils";

const initialState = {
    regions: MARCH_MADNESS_2024.regions,
    rounds: MARCH_MADNESS_2024.rounds,
};

export const matchMadnessBracketSlice = createSlice({
    name: 'marchMadness2024',
    initialState,
    reducers: {
        advanceTeam: (state, action) => {
            state.rounds = advanceToNextRound(
                action.payload.team,
                action.payload.matchNumber,
                action.payload.currentRound,
                action.payload.isFinalRound,
                state.rounds
            )
        },
        resetBracket: (state, action) => {
            // TODO: allow reset bracket
        }
    },
})

export const { advanceTeam } = matchMadnessBracketSlice.actions

export default matchMadnessBracketSlice.reducer
