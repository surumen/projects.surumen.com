// store/bracketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TournamentStructure, BracketRegion, GameData } from '@/types'
import { ncaaTournamentData } from '@/data/tournaments/marchMadness'
import { nbaTournamentData } from '@/data/tournaments/nbaPlayoffs'

type TournamentType = string

const TOURNAMENTS: Record<TournamentType, TournamentStructure> = {
    ncaa: ncaaTournamentData,
    nba:  nbaTournamentData,
}

interface BracketState {
    regions: Record<TournamentType, Record<string, BracketRegion>>
}

function createEmptyRegions(
    data: TournamentStructure
): Record<string, BracketRegion> {
    const regs: Record<string, BracketRegion> = {}

    for (const regionName in data.regions) {
        const gameData = data.regions[regionName].games as GameData[]

        // group by round
        const roundsMap = new Map<number, GameData[]>()
        for (const g of gameData) {
            const arr = roundsMap.get(g.roundNumber) || []
            arr.push(g)
            roundsMap.set(g.roundNumber, arr)
        }

        const roundsData = Array.from(roundsMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr)

        // empty picks/scores
        const matchups = roundsData.map(roundGames =>
            // for each game in this round, start with a [0,0] tuple
            roundGames.map(() => [0, 0] as [number,number])
        )
        const games    = roundsData.map(r => r.map(() => [0,0] as [number,number]))

        regs[regionName] = { matchups, games }
    }

    return regs
}

const initialState: BracketState = {
    regions: {
        ncaa: createEmptyRegions(TOURNAMENTS.ncaa),
        nba:  createEmptyRegions(TOURNAMENTS.nba),
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
                region:         string
                round:          number   // current round
                gameIdx:        number   // index within current round
                seed:           number   // the seed we picked
            }>
        ) => {
            const { tournamentType, region, round, gameIdx, seed } = action.payload
            const reg = state.regions[tournamentType][region]
            const next = round + 1
            if (!reg || next >= reg.matchups.length) return

            // which parent-game this feeds into...
            const parentGame = Math.floor(gameIdx / 2)
            // left child (even idx) → slot 0, right child (odd idx) → slot 1
            const slot = gameIdx % 2   // 0 or 1

            reg.matchups[next][parentGame][slot] = seed

            // clear any deeper rounds so nothing stale remains
            for (let r = next + 1; r < reg.matchups.length; r++) {
                // reset every game to [0,0]
                reg.matchups[r] = reg.matchups[r].map(() => [0, 0] as [number,number])
            }
        },

        resetBracket: (state, action: PayloadAction<TournamentType>) => {
            const t = action.payload
            state.regions[t] = createEmptyRegions(TOURNAMENTS[t])
        },
    },
})

export const { advanceTeam, resetBracket } = bracketSlice.actions
export default bracketSlice.reducer
