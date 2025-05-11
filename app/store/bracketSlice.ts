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

/** Walks up the tree from (startRound, startGameIdx) to the last round. */
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

        // group into rounds
        const byRound = new Map<number, GameData[]>()
        allGames.forEach(g => {
            const arr = byRound.get(g.roundNumber) ?? []
            arr.push(g)
            byRound.set(g.roundNumber, arr)
        })

        // sorted array of rounds
        const rounds: GameData[][] = Array.from(byRound.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr)

        // now build both matchups *and* games to the correct shape:
        // one [0,0] tuple per game in each round
        const matchups: [number,number][][] = rounds.map(r =>
            r.map(() => [0, 0] as [number, number])
        )

        const games: [number,number][][] = rounds.map(r =>
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
            const reg = state.regions[tournamentType]?.[region]
            if (!reg) return

            const totalRounds = reg.matchups.length

            // 0) record your pick in the current round
            let thisSlot: 0 | 1
            if (round === 0) {
                // map slug→seed #
                const slugMap = Object.fromEntries(
                    Object.entries(
                        TOURNAMENTS[tournamentType].regions[region].seeds as Record<number,string>
                    ).map(([n,slug]) => [slug, Number(n)])
                ) as Record<string,number>

                const A = slugMap[game.firstSeed?.name ?? '']  || 0
                const B = slugMap[game.secondSeed?.name ?? ''] || 0
                thisSlot = seed === A ? 0 : 1

            } else {
                thisSlot = (gameIdx % 2) as 0 | 1
            }
            reg.matchups[round][gameIdx][thisSlot] = seed

            // build the up‐path from here to the last local round
            const path = getUpPath(totalRounds, round, gameIdx)

            if (path.length === 0) {
                // we’re past the last local round → feed into “Final”
                const finalReg = state.regions[tournamentType]['Final']
                if (!finalReg) return

                const finalGames = (TOURNAMENTS[tournamentType].final as any).games as GameData[]
                const fi = finalGames.findIndex(f =>
                    f.sourceGame1?.region === region && f.sourceGame1?.gameNumber === game.gameNumber
                    || f.sourceGame2?.region === region && f.sourceGame2?.gameNumber === game.gameNumber
                )
                if (fi < 0) return

                const isFirst = finalGames[fi].sourceGame1?.region === region
                    && finalGames[fi].sourceGame1?.gameNumber === game.gameNumber

                finalReg.matchups[0][fi][ isFirst ? 0 : 1 ] = seed
                return
            }

            // 1) write winner into the very next round
            const { round: nr, gameIdx: parent, slot } = path[0]
            reg.matchups[nr][parent][slot] = seed

            // 2) figure out who lost
            let loser: number
            if (round === 0) {
                const slugMap = Object.fromEntries(
                    Object.entries(
                        TOURNAMENTS[tournamentType].regions[region].seeds as Record<number,string>
                    ).map(([n,slug]) => [slug, Number(n)])
                ) as Record<string,number>
                const A = slugMap[game.firstSeed?.name ?? '']  || 0
                const B = slugMap[game.secondSeed?.name ?? ''] || 0
                loser = seed === A ? B : A

            } else {
                loser = reg.matchups[nr][parent][slot ^ 1]
            }

            // 3) clear only that loser‐lane for all further rounds
            for (let i = 1; i < path.length; i++) {
                const { round: rr, gameIdx: gi, slot: ss } = path[i]
                if (reg.matchups[rr][gi][ss] === loser) {
                    reg.matchups[rr][gi][ss] = 0
                } else {
                    break
                }
            }
        },

        resetBracket: (state, action: PayloadAction<TournamentType>) => {
            state.regions[action.payload] = createEmptyRegions(TOURNAMENTS[action.payload])
        },
    },
})

export const { advanceTeam, resetBracket } = bracketSlice.actions
export default bracketSlice.reducer
