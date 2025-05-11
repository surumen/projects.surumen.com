// utils/bracketBuilder.ts

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
 * Build a region’s bracket games array from Round-of-64 through Elite-8.
 *
 * @param region     name of the region (e.g. “West”)
 * @param seedsMap   map of seed number → team slug for that region
 * @param teams      array of SeedMeta entries (must include all slugs)
 *
 * @returns an object containing:
 *   - seeds: the same seedsMap (for reference)
 *   - games: full GameData[] listing every game with either
 *            firstSeed/secondSeed (round 0) or sourceGame refs (>0)
 */
export function buildRegion(
    region: string,
    seedsMap: Record<number, string>,
    teams: SeedMeta[]
): { seeds: Record<number, string>; games: GameData[] } {
    const games: GameData[] = [];

    // Round-of-64 fixed pairings
    const r64: [number, number][] = [
        [1, 16], [8, 9], [5, 12], [4, 13],
        [6, 11], [3, 14], [7, 10], [2, 15]
    ];

    // R64 games
    r64.forEach(([a, b], idx) => {
        games.push({
            roundNumber: 0,
            gameNumber: idx,
            region,
            firstSeed: getSeed(seedsMap, teams, a),
            secondSeed: getSeed(seedsMap, teams, b),
        });
    });

    // R32, S16, E8
    for (let round = 1, prevCount = r64.length; round <= 3; round++, prevCount /= 2) {
        for (let i = 0; i < prevCount; i += 2) {
            games.push({
                roundNumber: round,
                gameNumber: i / 2,
                region,
                sourceGame1: fromGame(region, round - 1, i),
                sourceGame2: fromGame(region, round - 1, i + 1),
            });
        }
    }

    return { seeds: { ...seedsMap }, games };
}
