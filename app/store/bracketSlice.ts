import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TournamentStructure, BracketRegion, GameData } from '@/types';
import { getNcaaTournamentData } from '@/data/tournaments/marchMadness';
import { getNbaTournamentData }  from '@/data/tournaments/nbaPlayoffs';
import { getUclTournamentData }  from '@/data/tournaments/uefaChampionsLeague';
import { SeedMeta } from '@/types';

export type TournamentKey = string;

const years: number[] = [2022, 2023, 2024, 2025] as const;

export const TOURNAMENTS: Record<TournamentKey, TournamentStructure> = Object.fromEntries(
    years.flatMap((year) => ([
        [`ncaa-${year}`, getNcaaTournamentData(year)],
        [`nba-${year}`,  getNbaTournamentData(year)],
        [`ucl-${year}`, getUclTournamentData(year)]
    ]))
) as Record<TournamentKey, TournamentStructure>;

interface BracketState {
    currentLeague: string;
    currentYear:   number;
    regions:       Record<TournamentKey, Record<string, BracketRegion>>;
}

/** Build empty BracketRegion map from TournamentStructure */
function createEmptyRegions(
    data: TournamentStructure
): Record<string, BracketRegion> {
    const regs: Record<string, BracketRegion> = {};

    // 1) build each region’s rounds
    for (const regionName in data.regions) {
        const allGames = data.regions[regionName].games as GameData[];
        const byRound  = new Map<number, GameData[]>();
        allGames.forEach(g => {
            const arr = byRound.get(g.roundNumber) ?? [];
            arr.push(g);
            byRound.set(g.roundNumber, arr);
        });
        const rounds: GameData[][] = Array.from(byRound.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr);

        // 2a) matchups: tuple of exactly two entries per game
        const matchups: [SeedMeta|null, SeedMeta|null][][] = rounds.map(
            (gamesInRound, roundIndex): [SeedMeta|null, SeedMeta|null][] =>
                gamesInRound.map(game =>
                    roundIndex === 0
                        ? [
                            game.firstSeed  ?? null,
                            game.secondSeed ?? null
                        ] as [SeedMeta|null, SeedMeta|null]
                        : ([null, null] as [SeedMeta|null, SeedMeta|null])
                )
        );

        // 2b) scores: [number,number] matrix
        const scores: [number, number][][] = rounds.map(r =>
            r.map(() => [0, 0] as [number, number])
        );

        // 2c) games:
        const games: GameData[][] = rounds.map(r =>
            r.map(g => ({ ...g }))
        );

        regs[regionName] = { matchups, games, scores };
    }

    // 3) Final Four + Championship
    if (data.final?.games.length) {
        const allFinal = data.final.games as GameData[];
        const byFinal  = new Map<number, GameData[]>();
        allFinal.forEach(g => {
            const arr = byFinal.get(g.roundNumber) ?? [];
            arr.push(g);
            byFinal.set(g.roundNumber, arr);
        });
        const finalRounds: GameData[][] = Array.from(byFinal.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr);

        const matchups: [SeedMeta|null, SeedMeta|null][][] = finalRounds.map(
            roundGames =>
                roundGames.map(() =>
                    [null, null] as [SeedMeta|null, SeedMeta|null]
                )
        );

        const scores: [number, number][][] = finalRounds.map(r =>
            r.map(() => [0, 0] as [number, number])
        );

        const games: GameData[][] = finalRounds.map(r =>
            r.map(g => ({ ...g }))
        );

        regs['Final'] = { matchups, games, scores };
    }

    return regs;
}

/** Walk up the tree from (startRound, startGameIdx) → last round */
function getUpPath(
    totalRounds: number,
    startRound:  number,
    startGameIdx: number
): Array<{ round: number; gameIdx: number; slot: 0 | 1 }> {
    const path: Array<{ round: number; gameIdx: number; slot: 0 | 1 }> = [];
    let idx = startGameIdx;
    for (let r = startRound + 1; r < totalRounds; r++) {
        const parent = Math.floor(idx / 2);
        const slot   = (idx % 2) as 0 | 1;
        path.push({ round: r, gameIdx: parent, slot });
        idx = parent;
    }
    return path;
}

function isSameSeed(a?: SeedMeta|null, b?: SeedMeta|null): b is SeedMeta {
    return (
        a !== null &&
        b !== null &&
        !!a &&
        !!b &&
        a.seed       === b.seed &&
        a.name       === b.name &&
        a.conference === b.conference
    );
}


const initialState: BracketState = {
    currentLeague: 'ncaa',
    currentYear:   new Date().getFullYear(),
    regions: Object.fromEntries(
        Object.entries(TOURNAMENTS).map(([key, data]) => [
            key,
            createEmptyRegions(data),
        ])
    ) as Record<TournamentKey, Record<string, BracketRegion>>,
};

export const bracketSlice = createSlice({
    name: 'bracket',
    initialState,
    reducers: {
        setLeague(state, action: PayloadAction<string>) {
            state.currentLeague = action.payload;
        },
        setYear(state, action: PayloadAction<number>) {
            state.currentYear = action.payload;
        },
        advanceTeam(
            state,
            action: PayloadAction<{
                tournamentKey: TournamentKey
                region:        string
                game:          GameData
                round:         number
                gameIdx:       number
                pick:          SeedMeta
            }>
        ) {
            const { tournamentKey, region, game, round, gameIdx, pick } = action.payload
            const reg = state.regions[tournamentKey]?.[region]
            if (!reg) return

            // set the game's winnerSeed
            reg.games[round][gameIdx].winnerSeed = pick;

            const totalRounds = reg.matchups.length
            const pair = reg.matchups[round][gameIdx]

            // 1) SLOT DETECTION: identity-first
            let thisSlot = pair.findIndex(m => m === pick) as 0 | 1

            // fallback to seed-compare only in Round 0 of non-Final regions
            if (thisSlot < 0 && region !== 'Final' && round === 0) {
                thisSlot = (game.firstSeed?.seed === pick.seed ? 0 : 1) as 0 | 1
            }

            const loserSlot = (thisSlot ^ 1) as 0 | 1
            const loserSeed = reg.matchups[round][gameIdx][loserSlot]?.seed

            const loserMeta = reg.matchups[round][gameIdx][loserSlot];
            if (loserMeta) {
                // 1) Clear in *this* region’s deeper rounds:
                const path = getUpPath(totalRounds, round, gameIdx);
                for (let i = 1; i < path.length; i++) {
                    const { round: rr, gameIdx: gi } = path[i];
                    const g = reg.games[rr][gi];
                    if (isSameSeed(g.winnerSeed, loserMeta)) {
                        g.winnerSeed = undefined;
                    } else {
                        break; // once you hit a non‐loser, upstream ones can stay
                    }
                }

                // 2) Clear in the Final region (any round/game):
                const finalReg = state.regions[tournamentKey]!['Final'];
                if (finalReg) {
                    finalReg.games.forEach(roundGames =>
                        roundGames.forEach(g => {
                            if (isSameSeed(g.winnerSeed, loserMeta)) {
                                g.winnerSeed = undefined;
                            }
                        })
                    );
                }
            }

            // 2) WRITE YOUR PICK (skip writing into the Final-region semis)
            if (!(region === 'Final' && round === 0)) {
                reg.matchups[round][gameIdx][thisSlot] = pick
            }

            // 3) If this was the region-final in a non-Final region → seed into Final Four
            if (region !== 'Final' && round === totalRounds - 1) {
                const finalReg = state.regions[tournamentKey]?.['Final']
                if (!finalReg) return

                const semi = TOURNAMENTS[tournamentKey].final.games.find(g =>
                    g.roundNumber === 0 &&
                    (g.sourceGame1?.region === region || g.sourceGame2?.region === region)
                )
                if (!semi) return

                const semiSlot = semi.sourceGame1!.region === region ? 0 : 1
                finalReg.matchups[0][semi.gameNumber][semiSlot] = pick

                // clear the loserSeed out of **any** Final-region slot
                if (loserSeed != null) {
                    for (let r = 0; r < finalReg.matchups.length; r++) {
                        for (let gi = 0; gi < finalReg.matchups[r].length; gi++) {
                            for (const s of [0, 1] as const) {
                                if (finalReg.matchups[r][gi][s]?.seed === loserSeed) {
                                    finalReg.matchups[r][gi][s] = null
                                }
                            }
                        }
                    }
                }

                return
            }

            // 4) Otherwise, propagate downstream (handles Final-region semis → championship)
            const path = getUpPath(totalRounds, round, gameIdx)
            if (path.length) {
                const { round: nr, gameIdx: parent, slot } = path[0]
                reg.matchups[nr][parent][slot] = pick
            }

            // 5) Clear the loser out of any deeper rounds
            if (loserSeed != null) {
                for (let i = 1; i < path.length; i++) {
                    const { round: rr, gameIdx: gi, slot: ss } = path[i]
                    if (reg.matchups[rr][gi][ss]?.seed === loserSeed) {
                        reg.matchups[rr][gi][ss] = null
                    } else {
                        break
                    }
                }
            }

            // 6) ALSO clear the loser from the Final region (in case they advanced there)
            const finalReg = state.regions[tournamentKey]?.['Final']
            if (finalReg && loserSeed != null) {
                for (let r = 0; r < finalReg.matchups.length; r++) {
                    for (let gi = 0; gi < finalReg.matchups[r].length; gi++) {
                        for (const s of [0, 1] as const) {
                            if (finalReg.matchups[r][gi][s]?.seed === loserSeed) {
                                finalReg.matchups[r][gi][s] = null
                            }
                        }
                    }
                }
            }
        },

        resetBracket(state, action: PayloadAction<TournamentKey>) {
            state.regions[action.payload] = createEmptyRegions(
                TOURNAMENTS[action.payload]
            );
        },
    },
});

export const { setLeague, setYear, advanceTeam, resetBracket } = bracketSlice.actions;
export default bracketSlice.reducer;
