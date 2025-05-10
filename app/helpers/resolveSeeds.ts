import type { FinalRegion, SeedMeta } from '@/types';

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
 * Given a FinalRegion (with optional semis + always finalGame)
 * and your teams map (slug → SeedMeta), returns:
 *  - seeds: slot → SeedMeta
 *  - rounds: array of slot‐lists
 *  - games: array of score arrays
 */
export function computeFinalBracket(
    final: FinalRegion,
    teams: Record<string,SeedMeta>
): {
    seeds: Record<number,SeedMeta>,
    rounds: number[][],
    games: number[][][]
} {
    const blank: SeedMeta = { name:'', abbreviation:'', shortName:'', logo:'', color:'' }
    const seeds: Record<number,SeedMeta> = {}

    if (final.semiFinals) {
        final.semiFinals.forEach((pair, si) =>
            pair.forEach((slug, pi) => {
                const slot = si*2 + pi + 1
                seeds[slot] = slug ? (teams[slug] ?? blank) : blank
            })
        )

        const rounds = [
            // **4** slots for semis
            [1,2,3,4],
            // **2** slots for final
            [1,2]
        ]

        const games = [
            final.games.semiScores ?? [],       // two semis
            [ final.games.finalScore ]          // one final
        ]

        return { seeds, rounds, games }
    } else {
        // only one game
        const [a,b] = final.finalGame
        seeds[1] = a ? teams[a] ?? blank : blank
        seeds[2] = b ? teams[b] ?? blank : blank

        const rounds = [[1,2]]
        const games  = [[ final.games.finalScore ]]

        return { seeds, rounds, games }
    }
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
