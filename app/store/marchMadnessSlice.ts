// import node module libraries
import { createSlice } from '@reduxjs/toolkit'

import { createBracket, createFinalFour } from "@/utils/makeBrackets";
import { winningPathLength } from "@/utils/winningPathLength";

// import data files
import { EAST_SEEDS, MIDWEST_SEEDS, SOUTH_SEEDS, WEST_SEEDS } from '@/data/march-madness/Seeds';
import { Game, SideInfo } from '@/types/Brackets';
import { updateGameWinner } from "@/utils/updateGameWinner";


export interface AdvanceTeamProps {
    team: SideInfo,
    game: Game,
    bracket: Game,
    label: 'east' | 'west' | 'south' | 'midwest' | 'final'
}

const initialState: any = {
    regions: {
        east: createBracket(EAST_SEEDS),
        west: createBracket(WEST_SEEDS),
        midWest: createBracket(MIDWEST_SEEDS),
        south: createBracket(SOUTH_SEEDS)
    },
    rounds: {
        numRounds: winningPathLength(createBracket(EAST_SEEDS)),
        labels: ['Round 1', 'Round 2', 'Sweet 16', 'Elite 8']
    },
    finalFour: createFinalFour()
};

export const marchMadnessSlice = createSlice({
    name: 'marchMadness',
    initialState,
    reducers: {
        advanceTeam: (state, action) => {
            switch (action.payload.label) {
                case 'east':
                    state.regions.east = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.regions.east);
                    break
                case 'west':
                    state.regions.west = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.regions.west);
                    break
                case 'south':
                    state.regions.south = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.regions.south);
                    break
                default:
                    state.regions.midWest = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.regions.midWest);
            }
        },
        resetBracket: (state, action) => {
            // TODO: allow reset bracket
        }
    },
})

export const { advanceTeam } = marchMadnessSlice.actions

export default marchMadnessSlice.reducer
