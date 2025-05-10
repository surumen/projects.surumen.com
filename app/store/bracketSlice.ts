import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TournamentStructure, BracketRegion } from '@/types'
import { ncaaTournamentData } from '@/data/marchMadnessData'
import { nbaPlayoffsData } from '@/data/nbaPlayoffsData'

type TournamentType = string

interface BracketState {
    /** one entry per tournament type */
    regions: Record<TournamentType, Record<string, BracketRegion>>
}

/**
 * Build a fresh set of empty BracketRegion objects from
 * any TournamentStructure.
 */
function makeInitialRegions(
    data: TournamentStructure
): Record<string, BracketRegion> {
    const regs: Record<string, BracketRegion> = {}
    for (const regionName in data.regions) {
        const { rounds, games: staticGames } = data.regions[regionName]
        regs[regionName] = {
            // user matchups start off empty — only populated once clicked
            matchups: rounds.map(() => [] as number[]),
            // game scores, zeroed in [round][matchup][2] shape
            games: staticGames.map(roundMatches =>
                roundMatches.map(() => [0, 0] as [number, number])
            ),
        }
    }
    return regs
}

const initialState: BracketState = {
    regions: {
        ncaa: makeInitialRegions(ncaaTournamentData),
        nba: makeInitialRegions(nbaPlayoffsData),
    },
}

const bracketSlice = createSlice({
    name: 'bracket',
    initialState,
    reducers: {
        /**
         * Advance the clicked seed into the next round,
         * and clear out any picks in later rounds
         */
        advanceTeam: (
            state,
            action: PayloadAction<{
                tournamentType: TournamentType
                region: string
                round: number
                gameIdx: number
                seed: number
            }>
        ) => {
            const { tournamentType, region, round, gameIdx, seed } = action.payload
            const reg = state.regions[tournamentType][region]
            const next = round + 1
            if (!reg || next >= reg.matchups.length) return

            // 1) Place the new winner into the next round slot
            reg.matchups[next][gameIdx] = seed

            // 2) Clear all picks in rounds after `next`
            for (let r = next + 1; r < reg.matchups.length; r++) {
                reg.matchups[r] = []
            }
        },

        /**
         * Reset a given tournament bracket back to its initial state
         */
        resetBracket: (state, action: PayloadAction<TournamentType>) => {
            const t = action.payload
            state.regions[t] = makeInitialRegions(
                t === 'ncaa' ? ncaaTournamentData : nbaPlayoffsData
            )
        },
    },
})

export const { advanceTeam, resetBracket } = bracketSlice.actions
export default bracketSlice.reducer
