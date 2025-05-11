// src/utils/bracketBuilder.ts
import type { GameData, SeedMeta } from '@/types';

/**
 * Reference to a previous game by region, round, and game number.
 */
export function fromGame(region: string, round: number, game: number) {
    return { region, roundNumber: round, gameNumber: game };
}

/**
 * Look up a SeedMeta by seed number.
 * 1) Try slug lookup if available
 * 2) Then try matching on t.seed
 */
export function getSeed(
    seedsMap: Record<number, string>,
    teams: SeedMeta[],
    seedNum: number
): SeedMeta {
    // 1) slug-based lookup
    const slug = seedsMap[seedNum];
    if (typeof slug === 'string') {
        const byName = teams.find(t => t.name === slug);
        if (byName) return byName;
    }

    // 2) direct .seed lookup
    const bySeed = teams.find(t => t.seed === seedNum);
    if (bySeed) return bySeed;

    throw new Error(
        `Unknown team for seed ${seedNum}` +
        (slug ? ` (slug lookup: ${slug})` : '')
    );
}

// A blank placeholder for later rounds
const EMPTY_SEED: SeedMeta = { name: '', shortName: '' };

/**
 * Build a k-team playoff bracket, given any initial pairing list.
 */
export function buildCustomRegion(
    region: string,
    seedsMap: Record<number, string>,
    teams: SeedMeta[],
    initialPairings: [number, number][]
): { seeds: Record<number, string>; games: GameData[] } {
    const games: GameData[] = [];

    // Round 0
    initialPairings.forEach(([a, b], idx) => {
        games.push({
            roundNumber: 0,
            gameNumber: idx,
            region,
            firstSeed:  getSeed(seedsMap, teams, a),
            secondSeed: getSeed(seedsMap, teams, b),
        });
    });

    // Subsequent rounds
    let prevCount = initialPairings.length;
    for (let round = 1; prevCount > 1; round++) {
        for (let i = 0; i < prevCount / 2; i++) {
            games.push({
                roundNumber: round,
                gameNumber: i,
                region,
                sourceGame1: fromGame(region, round - 1, i * 2),
                sourceGame2: fromGame(region, round - 1, i * 2 + 1),
                firstSeed:  { ...EMPTY_SEED },
                secondSeed: { ...EMPTY_SEED },
            });
        }
        prevCount /= 2;
    }

    return { seeds: { ...seedsMap }, games };
}
