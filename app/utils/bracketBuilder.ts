import type { GameData, SeedMeta } from '@/types';

/**
 * Reference to a previous game by region, round, and game number.
 */
export function fromGame(region: string, round: number, game: number) {
    return { region, roundNumber: round, gameNumber: game };
}

/**
 * Look up a SeedMeta by seed number.
 *
 * @param seedsMap   map of seed number → team slug
 * @param teams      array of SeedMeta entries
 * @param seedNum    the seed number to look up
 */
export function getSeed(
    seedsMap: Record<number, string>,
    teams: SeedMeta[],
    seedNum: number
): SeedMeta {
    const slug = seedsMap[seedNum];
    const meta = teams.find(t => t.name === slug);
    if (!meta) {
        throw new Error(`Unknown team slug for seed ${seedNum}: ${slug}`);
    }
    return meta;
}

/**
 * Build a k-team playoff bracket, given any initial pairing list.
 *
 * @param region           e.g. "West"
 * @param seedsMap         map seed → slug (only the seeds appearing in `initialPairings`)
 * @param teams            array of SeedMeta
 * @param initialPairings  array of [seedA, seedB] for the very first round
 *
 * @returns seeds (cloned seedsMap) and games[] with roundNumber starting at 0,
 *          then halving each round until a single champion.
 */
export function buildCustomRegion(
    region: string,
    seedsMap: Record<number,string>,
    teams: SeedMeta[],
    initialPairings: [number,number][]
): { seeds: Record<number,string>; games: GameData[] } {
    const games: GameData[] = [];

    // --- Round 0: your custom initial pairings ---
    initialPairings.forEach(([a, b], idx) => {
        games.push({
            roundNumber: 0,
            gameNumber: idx,
            region,
            firstSeed:  getSeed(seedsMap, teams, a),
            secondSeed: getSeed(seedsMap, teams, b),
        });
    });

    // --- Subsequent rounds: halve until 1 game left ---
    let prevCount = initialPairings.length;
    for (let round = 1; prevCount > 1; round++) {
        for (let i = 0; i < prevCount / 2; i++) {
            games.push({
                roundNumber: round,
                gameNumber: i,
                region,
                sourceGame1: fromGame(region, round - 1, i * 2),
                sourceGame2: fromGame(region, round - 1, i * 2 + 1),
            });
        }
        prevCount /= 2;
    }

    return { seeds: { ...seedsMap }, games };
}
