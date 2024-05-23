// import node module libraries
import { createSlice } from '@reduxjs/toolkit'

// import data files
import { MARCH_MADNESS_2024 } from '@/data/march-madness/MarchMadness2024';


const initialState = {
    regions: MARCH_MADNESS_2024.regions,
    rounds: MARCH_MADNESS_2024.rounds,
};


export const matchMadnessBracketSlice = createSlice({
    name: 'marchMadness2024',
    initialState,
    reducers: {
        advanceTeam: (state, action) => {

        },
        resetBracket: (state, action) => {
            // TODO: allow reset bracket
        }
    },
})

export const { advanceTeam } = matchMadnessBracketSlice.actions

export default matchMadnessBracketSlice.reducer
