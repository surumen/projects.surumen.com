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
    const blank: SeedMeta = { name:'', abbreviation:'', shortName:'', logo:'', color:'' };
    const seeds: Record<number,SeedMeta> = {};

    // helper to get slot-number or zero
    const slotFor = (idx: number, slug: string) => {
        if (!slug) return 0;
        // fill the metadata
        const meta = teams[slug] ?? blank;
        seeds[idx] = meta;
        return idx;
    };

    if (final.semiFinals) {
        // flatten semis into 4 slots
        const semisFlat = final.semiFinals.flat();
        const firstRound = semisFlat.map((slug, i) =>
            // slots are 1..4
            slotFor(i + 1, slug)
        );

        // championship slots always positions 1 & 2
        const finalRound = final.finalGame.map((slug, i) =>
            slotFor(i + 1, slug)
        );

        const games = [
            final.games.semiScores ?? [[0,0],[0,0]],
            [final.games.finalScore]
        ];

        return {
            seeds,
            rounds: [ firstRound, finalRound ],
            games
        };
    } else {
        // just a single final
        const [a, b] = final.finalGame;
        const firstRound = [
            slotFor(1, a),
            slotFor(2, b)
        ];

        return {
            seeds,
            rounds: [ firstRound ],
            games: [[ final.games.finalScore ]]
        };
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
