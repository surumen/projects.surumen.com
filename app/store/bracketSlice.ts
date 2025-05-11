import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TournamentStructure, BracketRegion, GameData } from '@/types';
import { getNcaaTournamentData } from '@/data/tournaments/marchMadness';
import { getNbaTournamentData }       from '@/data/tournaments/nbaPlayoffs';

export type TournamentKey = string;

const years = [2022, 2023, 2024, 2025] as const;

// build the record programmatically
export const TOURNAMENTS: Record<TournamentKey, TournamentStructure> = Object.fromEntries(
    years.flatMap((year) => ([
        [`ncaa-${year}`, getNcaaTournamentData(year)],
        [`nba-${year}`,  getNbaTournamentData(year)],
    ]))
) as Record<TournamentKey, TournamentStructure>;

interface BracketState {
    regions: Record<TournamentKey, Record<string, BracketRegion>>;
}

/** Build empty BracketRegion map from TournamentStructure */
function createEmptyRegions(
    data: TournamentStructure
): Record<string, BracketRegion> {
    const regs: Record<string, BracketRegion> = {};

    for (const regionName in data.regions) {
        const allGames = data.regions[regionName].games as GameData[];
        const byRound  = new Map<number, GameData[]>();
        allGames.forEach((g) => {
            const arr = byRound.get(g.roundNumber) ?? [];
            arr.push(g);
            byRound.set(g.roundNumber, arr);
        });
        const rounds = Array.from(byRound.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr);

        regs[regionName] = {
            matchups: rounds.map((r) => r.map(() => [0, 0] as [number, number])),
            games:    rounds.map((r) => r.map(() => [0, 0] as [number, number])),
        };
    }

    // Final Four + Championship
    if (data.final?.games.length) {
        const allFinal = data.final.games as GameData[];
        const byFinal  = new Map<number, GameData[]>();
        allFinal.forEach((g) => {
            const arr = byFinal.get(g.roundNumber) ?? [];
            arr.push(g);
            byFinal.set(g.roundNumber, arr);
        });
        const finalRounds = Array.from(byFinal.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr);

        regs['Final'] = {
            matchups: finalRounds.map((r) => r.map(() => [0, 0] as [number, number])),
            games:    finalRounds.map((r) => r.map(() => [0, 0] as [number, number])),
        };
    }

    return regs;
}

/** Walk up the tree from (startRound, startGameIdx) → last round */
function getUpPath(
    totalRounds: number,
    startRound:  number,
    startGameIdx:number
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

const initialState: BracketState = {
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
        advanceTeam(
            state,
            action: PayloadAction<{
                tournamentKey: TournamentKey;
                region:        string;
                game:          GameData;
                round:         number;
                gameIdx:       number;
                seed:          number;
            }>
        ) {
            const { tournamentKey, region, game, round, gameIdx, seed } = action.payload;
            const reg = state.regions[tournamentKey]?.[region];
            if (!reg) return;

            const totalRounds = reg.matchups.length;
            let thisSlot: 0 | 1;

            // 0) record this pick
            if (round === 0) {
                // same slug→seed logic for round 0
                const slugMap = Object.fromEntries(
                    Object.entries(
                        TOURNAMENTS[tournamentKey].regions[region].seeds as Record<number,string>
                    ).map(([n, slug]) => [slug, Number(n)])
                ) as Record<string,number>;

                const A = slugMap[game.firstSeed?.name  ?? ''] || 0;
                const B = slugMap[game.secondSeed?.name ?? ''] || 0;
                thisSlot = seed === A ? 0 : 1;
            } else {
                // detect which slot currently holds your seed
                const pair = reg.matchups[round][gameIdx];
                thisSlot = (pair.findIndex(s => s === seed) === 1 ? 1 : 0) as 0 | 1;
            }

            reg.matchups[round][gameIdx][thisSlot] = seed;

            // SPECIAL: if this *is* the final round of *this* region…
            if (round === totalRounds - 1) {
                const finalReg = state.regions[tournamentKey]?.['Final'];
                if (finalReg) {
                    const finalGames = TOURNAMENTS[tournamentKey].final.games;
                    const semi = finalGames.find(g =>
                        g.roundNumber === 0 &&
                        (g.sourceGame1?.region === region || g.sourceGame2?.region === region)
                    );
                    if (semi) {
                        const semiGameIdx = semi.gameNumber;
                        const semiSlot    = (semi.sourceGame1?.region === region ? 0 : 1) as 0 | 1;

                        // place your region champion into the semis
                        finalReg.matchups[0][semiGameIdx][semiSlot] = seed;

                        // then auto‐propagate winner into the championship
                        const finalPath = getUpPath(
                            finalReg.matchups.length,
                            0,
                            semiGameIdx
                        );
                        if (finalPath.length > 0) {
                            const { round: fR, gameIdx: fG, slot: fS } = finalPath[0];
                            finalReg.matchups[fR][fG][fS] = seed;
                        }
                    }
                }
                return;
            }

            // otherwise, fall back to your normal propagation…
            const path = getUpPath(totalRounds, round, gameIdx);
            if (!path.length) return;

            // 1) write winner up one round
            const { round: nr, gameIdx: parent, slot } = path[0];
            reg.matchups[nr][parent][slot] = seed;

            // 2) compute loser (opposite slot)
            const loserSlot = (thisSlot ^ 1) as 0 | 1;
            let loser: number;
            if (round === 0) {
                const slugMap = Object.fromEntries(
                    Object.entries(
                        TOURNAMENTS[tournamentKey].regions[region].seeds as Record<number,string>
                    ).map(([n, slug]) => [slug, Number(n)])
                ) as Record<string,number>;
                const A = slugMap[game.firstSeed?.name  ?? ''] || 0;
                const B = slugMap[game.secondSeed?.name ?? ''] || 0;
                loser = seed === A ? B : A;
            } else {
                loser = reg.matchups[round][gameIdx][loserSlot];
            }

            // 3) clear that loser’s lane in deeper rounds
            for (let i = 1; i < path.length; i++) {
                const { round: rr, gameIdx: gi, slot: ss } = path[i];
                if (reg.matchups[rr][gi][ss] === loser) {
                    reg.matchups[rr][gi][ss] = 0;
                } else {
                    break;
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

export const { advanceTeam, resetBracket } = bracketSlice.actions;
export default bracketSlice.reducer;
