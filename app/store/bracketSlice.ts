// app/store/bracketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TournamentStructure, BracketRegion, GameData } from '@/types'
import { ncaaTournamentData } from '@/data/tournaments/marchMadness'
import { nbaTournamentData } from '@/data/tournaments/nbaPlayoffs'

type TournamentType = 'ncaa' | 'nba'

const TOURNAMENTS: Record<TournamentType, TournamentStructure> = {
    ncaa: ncaaTournamentData,
    nba:  nbaTournamentData,
}

interface BracketState {
    regions: Record<TournamentType, Record<string, BracketRegion>>
}

/** Walk up the tree from (startRound, startGameIdx) → last round */
function getUpPath(
    totalRounds: number,
    startRound: number,
    startGameIdx: number
): Array<{ round: number; gameIdx: number; slot: 0 | 1 }> {
    const path: Array<{ round: number; gameIdx: number; slot: 0 | 1 }> = []
    let idx = startGameIdx
    for (let r = startRound + 1; r < totalRounds; r++) {
        const parent = Math.floor(idx / 2)
        const slot   = (idx % 2) as 0 | 1
        path.push({ round: r, gameIdx: parent, slot })
        idx = parent
    }
    return path
}

function createEmptyRegions(
    data: TournamentStructure
): Record<string, BracketRegion> {
    const regs: Record<string, BracketRegion> = {}
    for (const regionName in data.regions) {
        const allGames = data.regions[regionName].games as GameData[]
        const byRound  = new Map<number, GameData[]>()
        allGames.forEach(g => {
            const arr = byRound.get(g.roundNumber) ?? []
            arr.push(g)
            byRound.set(g.roundNumber, arr)
        })

        const rounds = Array.from(byRound.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr)

        const matchups = rounds.map(r =>
            r.map(() => [0, 0] as [number, number])
        )
        const games = rounds.map(r =>
            r.map(() => [0, 0] as [number, number])
        )

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

export const bracketSlice = createSlice({
    name: 'bracket',
    initialState,
    reducers: {
        advanceTeam(
            state,
            action: PayloadAction<{
                tournamentType: TournamentType
                region:         string
                game:           GameData
                round:          number
                gameIdx:        number
                seed:           number
            }>
        ) {
            const { tournamentType, region, game, round, gameIdx, seed } = action.payload
            const reg = state.regions[tournamentType]?.[region]
            if (!reg) return

            const totalRounds = reg.matchups.length

            //–– 0) write your pick INTO THIS game ––
            let thisSlot: 0 | 1
            if (round === 0) {
                // round 0: pick slot by comparing slug→seed
                const slugMap = Object.fromEntries(
                    Object.entries(
                        TOURNAMENTS[tournamentType].regions[region].seeds as Record<number, string>
                    ).map(([n, slug]) => [slug, Number(n)])
                ) as Record<string, number>

                const A = slugMap[game.firstSeed?.name  ?? ''] || 0
                const B = slugMap[game.secondSeed?.name ?? ''] || 0
                thisSlot = seed === A ? 0 : 1

            } else {
                // later rounds: see which slot currently holds that seed
                const pair = reg.matchups[round][gameIdx]
                const idx = pair.findIndex(s => s === seed)
                thisSlot = (idx === 1 ? 1 : 0) as 0 | 1
            }
            reg.matchups[round][gameIdx][thisSlot] = seed

            //–– build the up‐path ––
            const path = getUpPath(totalRounds, round, gameIdx)

            //–– if no further rounds, we’re done here ––
            if (path.length === 0) return

            //–– 1) write winner into very next round ––
            const { round: nr, gameIdx: parent, slot } = path[0]
            reg.matchups[nr][parent][slot] = seed

            //–– 2) compute who lost ––
            const siblingSlot = (thisSlot ^ 1) as 0 | 1
            let loser: number

            if (round === 0) {
                // round 0: loser is the other seed by slug→seed
                const slugMap = Object.fromEntries(
                    Object.entries(
                        TOURNAMENTS[tournamentType].regions[region].seeds as Record<number, string>
                    ).map(([n, slug]) => [slug, Number(n)])
                ) as Record<string, number>

                const A = slugMap[game.firstSeed?.name  ?? ''] || 0
                const B = slugMap[game.secondSeed?.name ?? ''] || 0
                loser = seed === A ? B : A

            } else {
                // later rounds: loser is whoever occupied the other slot
                loser = reg.matchups[round][gameIdx][siblingSlot]
            }

            //–– 3) clear **only** that loser’s lane in deeper rounds ––
            for (let i = 1; i < path.length; i++) {
                const { round: rr, gameIdx: gi, slot: ss } = path[i]
                if (reg.matchups[rr][gi][ss] === loser) {
                    reg.matchups[rr][gi][ss] = 0
                } else {
                    break
                }
            }
        },

        resetBracket(state, action: PayloadAction<TournamentType>) {
            state.regions[action.payload] = createEmptyRegions(TOURNAMENTS[action.payload])
        },
    },
})

export const { advanceTeam, resetBracket } = bracketSlice.actions
export default bracketSlice.reducer
