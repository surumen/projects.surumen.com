// import node module libraries
import { createSlice } from '@reduxjs/toolkit'

import { createBracket, createFinalFour } from "@/utils/makeBrackets";
import { winningPathLength } from "@/utils/winningPathLength";

// import data files
import { EAST_SEEDS, MIDWEST_SEEDS, SOUTH_SEEDS, WEST_SEEDS } from '@/data/march-madness/Seeds';
import { Game, SideInfo } from '@/types/Brackets';
import { advanceToFinalFour, updateGameWinner } from "@/utils/updateGameWinner";


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
                    state.regions.east = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.regions.east, 'east');
                    if (state.regions.east.id === action.payload.game.id) {
                        state.finalFour = advanceToFinalFour(action.payload.winner, action.payload.loser, action.payload.game, state.finalFour, 'east');
                    }
                    break
                case 'west':
                    state.regions.west = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.regions.west, 'west');
                    if (state.regions.west.id === action.payload.game.id) {
                        state.finalFour = advanceToFinalFour(action.payload.winner, action.payload.loser, action.payload.game, state.finalFour, 'west');
                    }
                    break
                case 'south':
                    state.regions.south = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.regions.south, 'south');
                    if (state.regions.south.id === action.payload.game.id) {
                        state.finalFour = advanceToFinalFour(action.payload.winner, action.payload.loser, action.payload.game, state.finalFour, 'south');
                    }
                    break
                case 'midwest':
                    state.regions.midWest = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.regions.midWest, 'midwest');
                    if (state.regions.midWest.id === action.payload.game.id) {
                        state.finalFour = advanceToFinalFour(action.payload.winner, action.payload.loser, action.payload.game, state.finalFour, 'midwest');
                    }
                    break
                default:
                    state.finalFour = updateGameWinner(action.payload.winner, action.payload.loser, action.payload.game, state.finalFour, 'final');
                    state.finalFour = {
                        ...state.finalFour,
                        winner: {
                            id: action.payload.winner.id,
                            name: action.payload.winner.name,
                            logo: action.payload.winner.logo,
                            seed: action.payload.winner.seed
                        }
                    }
            }
        },
        resetBracket: (state, action) => {
            // TODO: allow reset bracket
        }
    },
})

export const { advanceTeam } = marchMadnessSlice.actions

export default marchMadnessSlice.reducer
