import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TournamentStructure, BracketRegion, GameData } from '@/types'
import { ncaaTournamentData } from '@/data/tournaments/marchMadness'
import { nbaTournamentData } from '@/data/tournaments/nbaPlayoffs'

type TournamentType = string

interface BracketState {
    regions: Record<TournamentType, Record<string, BracketRegion>>
}

/**
 * Build empty BracketRegion for each region by grouping its flat GameData[] by roundNumber.
 */
function makeInitialRegions(
    data: TournamentStructure
): Record<string, BracketRegion> {
    const regs: Record<string, BracketRegion> = {}

    for (const regionName in data.regions) {
        const gameData = data.regions[regionName].games as GameData[]

        // Group games by roundNumber
        const roundsMap = new Map<number, GameData[]>()
        for (const g of gameData) {
            const arr = roundsMap.get(g.roundNumber) || []
            arr.push(g)
            roundsMap.set(g.roundNumber, arr)
        }

        // Turn that into a sorted array of rounds
        const roundsData = Array.from(roundsMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr)

        // Now build empty user state matching that shape:
        const matchups = roundsData.map(() => [] as number[])
        const games = roundsData.map(roundGames =>
            roundGames.map(() => [0, 0] as [number, number])
        )

        regs[regionName] = { matchups, games }
    }

    return regs
}

const initialState: BracketState = {
    regions: {
        ncaa: makeInitialRegions(ncaaTournamentData),
        nba: makeInitialRegions(nbaTournamentData),
    },
}

const bracketSlice = createSlice({
    name: 'bracket',
    initialState,
    reducers: {
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

            reg.matchups[next][gameIdx] = seed
            for (let r = next + 1; r < reg.matchups.length; r++) {
                reg.matchups[r] = []
            }
        },

        resetBracket: (state, action: PayloadAction<TournamentType>) => {
            const t = action.payload
            state.regions[t] = makeInitialRegions(
                t === 'ncaa' ? ncaaTournamentData : nbaTournamentData
            )
        },
    },
})

export const { advanceTeam, resetBracket } = bracketSlice.actions
export default bracketSlice.reducer
