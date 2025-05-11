import type { FinalRegion, SeedMeta, GameData, GameSource } from '@/types';
import { fromGame } from '@/utils/bracketBuilder';

/**
 * Converts a seed-number → slug map into a slug → SeedMeta lookup.
 */
export function resolveSeeds(
    rawSeeds: Record<number, string>,
    teamsData: SeedMeta[]
): Record<number, SeedMeta> {
    return Object.entries(rawSeeds).reduce((acc, [seedStr, slug]) => {
        const team = teamsData.find(t => t.name === slug);
        if (team) acc[Number(seedStr)] = team;
        return acc;
    }, {} as Record<number, SeedMeta>);
}

/**
 * Given a FinalRegion whose seeds map is Record<region,SeedMeta>,
 * return that same map plus the flat GameData[] for the semifinals + final.
 */
export function computeFinalBracket(
    final: FinalRegion
): {
    seeds: Record<string, SeedMeta>;
    games: GameData[];
} {
    // seedsMap is exactly the FinalRegion.seeds—you already have full SeedMeta
    const seedsMap: Record<string, SeedMeta> = { ...final.seeds };

    const regions = Object.keys(seedsMap);
    const games: GameData[] = [];

    // Semis
    games.push({
        roundNumber: 0,
        gameNumber: 0,
        region: 'Final',
        sourceGame1: { region: regions[0], roundNumber: 3, gameNumber: 0 },
        sourceGame2: { region: regions[1], roundNumber: 3, gameNumber: 0 },
    });
    games.push({
        roundNumber: 0,
        gameNumber: 1,
        region: 'Final',
        sourceGame1: { region: regions[2], roundNumber: 3, gameNumber: 0 },
        sourceGame2: { region: regions[3], roundNumber: 3, gameNumber: 0 },
    });

    // Championship
    games.push({
        roundNumber: 1,
        gameNumber: 0,
        region: 'Final',
        sourceGame1: { region: 'Final', roundNumber: 0, gameNumber: 0 },
        sourceGame2: { region: 'Final', roundNumber: 0, gameNumber: 1 },
    });

    return { seeds: seedsMap, games };
}

/**
 * Resolves raw seed-number matchups into pairs of SeedMeta.
 * (Used by older UI layers; you may phase this out once everything
 * uses GameData directly.)
 */
export function resolveMatchups(
    seeds: Record<number, SeedMeta>,
    matchups: Array<Array<number | [string, number]>>
): [SeedMeta, SeedMeta][][] {
    return matchups.map(round => {
        const pairs: [SeedMeta, SeedMeta][] = [];
        for (let i = 0; i < round.length; i += 2) {
            const rawA = round[i];
            const rawB = round[i + 1];
            const resolve = (input: number | [string, number]): SeedMeta => {
                if (Array.isArray(input)) {
                    // final region pairing (region + gameNumber)
                    // placeholder: you could look up the GameData and its winnerSeed
                    return { name: `${input[0]}-${input[1]}`, color: 'gray' };
                }
                return seeds[input] || { name: '', color: 'gray' };
            };
            pairs.push([resolve(rawA), resolve(rawB)]);
        }
        return pairs;
    });
}
