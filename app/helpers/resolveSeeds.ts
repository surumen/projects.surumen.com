import type { SeedMeta } from '@/types';

/**
 * Converts a seed slug map into full SeedMeta using known teams data.
 * @param rawSeeds - seed-to-slug mapping (e.g., { 1: 'golden-state' })
 * @param teamsData - array of SeedMeta with name, color, logo, etc.
 * @returns Record<number, SeedMeta>
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
 * Resolves raw seed references into SeedMeta matchups.
 * @param seeds - Record of seed numbers to SeedMeta
 * @param matchups - Array of rounds, each round is flat array of seed numbers or [region, seed]
 * @returns Nested array of [SeedMeta, SeedMeta] pairs per round
 */
export function resolveMatchups(
    seeds: Record<number, SeedMeta>,
    matchups: Array<Array<number | [string, number]>>
): [SeedMeta, SeedMeta][][] {
    return matchups.map(round => {
        const pairs: [SeedMeta, SeedMeta][] = [];
        for (let i = 0; i < round.length; i += 2) {
            const first = round[i];
            const second = round[i + 1];

            const resolve = (input: number | [string, number]): SeedMeta => {
                if (Array.isArray(input)) {
                    // For final: fallback gray if region lookup isn't handled
                    return { name: `${input[0]}-${input[1]}`, color: 'gray' };
                } else {
                    return seeds[input] || { name: '', color: 'gray' };
                }
            };

            pairs.push([resolve(first), resolve(second)]);
        }
        return pairs;
    });
}
