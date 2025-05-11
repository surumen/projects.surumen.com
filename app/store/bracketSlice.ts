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

// helper as before
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

function createEmptyRegions(
    data: TournamentStructure
): Record<string, BracketRegion> {
    const regs: Record<string, BracketRegion> = {}
    for (const regionName in data.regions) {
        const gameData = data.regions[regionName].games as GameData[]
        const roundsMap = new Map<number, GameData[]>()
        gameData.forEach(g => {
            const arr = roundsMap.get(g.roundNumber) || []
            arr.push(g)
            roundsMap.set(g.roundNumber, arr)
        })
        const roundsData = Array.from(roundsMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr)
        const matchups = roundsData.map(roundGames =>
            roundGames.map(() => [0, 0] as [number, number])
        )
        const games = roundsData.map(() => [])
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
                game:           GameData
                round:          number
                gameIdx:        number
                seed:           number
            }>
        ) => {
            const { tournamentType, region, game, round, gameIdx, seed } = action.payload
            const reg = state.regions[tournamentType][region]
            if (!reg) return

            const totalRounds = reg.matchups.length
            const path = getUpPath(totalRounds, round, gameIdx)
            if (path.length === 0) return

            // first step in path is the very next round
            const { round: nxtR, gameIdx: parent, slot } = path[0]

            // write the winner into its slot
            reg.matchups[nxtR][parent][slot] = seed

            // determine defeated seed
            let defeated: number
            if (round === 0) {
                // map team‐slug back to seed#
                const slugMap = Object.fromEntries(
                    Object.entries(
                        TOURNAMENTS[tournamentType].regions[region].seeds as Record<number,string>
                    ).map(([num, slug]) => [slug, Number(num)])
                ) as Record<string,number>
                const a = game.firstSeed?.name ?? ''
                const b = game.secondSeed?.name ?? ''
                const A = slugMap[a] || 0
                const B = slugMap[b] || 0
                defeated = seed === A ? B : A
            } else {
                // sibling slot holds the loser
                defeated = reg.matchups[nxtR][parent][slot ^ 1]
            }

            // now clear only that defeated‐lane further down the path
            for (let i = 1; i < path.length; i++) {
                const { round: r, gameIdx: idx, slot: s } = path[i]
                if (reg.matchups[r][idx][s] === defeated) {
                    reg.matchups[r][idx][s] = 0
                } else {
                    // once we hit a slot that doesn't match defeated, stop clearing
                    break
                }
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
