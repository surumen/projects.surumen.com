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

/**
 * Starting from (round, gameIdx), returns an array of all the parent slots
 * you will fill in later rounds.  Each item tells you:
 *   - round:   the next round index
 *   - gameIdx: which game in that round
 *   - slot:    which side (0 = left, 1 = right) you will occupy
 */
function getUpPath(
    totalRounds: number,
    startRound: number,
    startGameIdx: number
): Array<{ round: number; gameIdx: number; slot: 0 | 1 }> {
    const path: Array<{ round: number; gameIdx: number; slot: 0 | 1 }> = []
    let prevIdx = startGameIdx

    for (let r = startRound + 1; r < totalRounds; r++) {
        const parentGame = Math.floor(prevIdx / 2)
        const slot       = (prevIdx % 2) as 0 | 1
        path.push({ round: r, gameIdx: parentGame, slot })
        prevIdx = parentGame
    }

    return path
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
                round:          number    // current round
                gameIdx:        number    // index within current round
                seed:           number    // the seed we picked
            }>
        ) => {
            const { tournamentType, region, round, gameIdx, seed } = action.payload
            const reg = state.regions[tournamentType][region]
            if (!reg) return

            const totalRounds = reg.matchups.length
            if (round + 1 >= totalRounds) return

            // figure out your defeated opponent
            const [a, b] = reg.matchups[round][gameIdx]
            const defeated = a === seed ? b : a

            // get the entire path, but we'll only use the very first step
            const path = getUpPath(totalRounds, round, gameIdx)
            if (path.length === 0) return

            const { round: nextR, gameIdx: nextG, slot } = path[0]
            const opp = 1 - slot

            // 1) place the winner one level up
            reg.matchups[nextR][nextG][slot] = seed

            // 2) clear only that defeated opponent in the sibling slot
            if (reg.matchups[nextR][nextG][opp] === defeated) {
                reg.matchups[nextR][nextG][opp] = 0
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
