// helpers/bracketHelpers.ts
import type { FinalRegion, SeedMeta } from '@/types'

/**
 * Converts a seed-number → slug map into a slug → SeedMeta lookup.
 */
export function resolveSeeds(
    rawSeeds: Record<number, string>,
    teamsData: SeedMeta[]
): Record<number, SeedMeta> {
    return Object.entries(rawSeeds).reduce((acc, [seedStr, slug]) => {
        const team = teamsData.find(t => t.name === slug)
        if (team) acc[Number(seedStr)] = team
        return acc
    }, {} as Record<number, SeedMeta>)
}

/**
 * Given a FinalRegion (with optional semis + always finalGame)
 * and your teams map (slug → SeedMeta), returns the bracket for the Final Four:
 *   - seeds: slotNumber → SeedMeta
 *   - rounds: array of seed-number arrays per round
 *   - games:  array of score pairs per round
 */
export function computeFinalBracket(
    final: FinalRegion,
    teams: Record<string, SeedMeta>
): {
    seeds: Record<number, SeedMeta>
    rounds: number[][]
    games: number[][][]
} {
    const blank: SeedMeta = { name: '', abbreviation: '', shortName: '', logo: '', color: '' }
    const seeds: Record<number, SeedMeta> = {}

    const slotFor = (idx: number, slug: string): number => {
        if (!slug) return 0
        const meta = teams[slug] ?? blank
        seeds[idx] = meta
        return idx
    }

    let rounds: number[][]
    let games: number[][][]

    if (final.semiFinals) {
        // --- two rounds: semis & championship ---
        const semisFlat = final.semiFinals.flat()
        const firstRound = semisFlat.map((slug, i) => slotFor(i + 1, slug))
        const finalRound = final.finalGame.map((slug, i) => slotFor(i + 1, slug))

        rounds = [firstRound, finalRound]

        // semiScores is number[][], finalScore is [number,number]
        const semiScores: number[][] = final.games.semiScores ?? [[0, 0], [0, 0]]
        const finalScore: [number, number] = final.games.finalScore

        // build a 3-D array: [ [ [s1,s2], [s3,s4] ], [ [f1,f2] ] ]
        games = [
            semiScores,
            [finalScore],
        ]
    } else {
        // --- only one round (championship) ---
        const [a, b] = final.finalGame
        const firstRound = [slotFor(1, a), slotFor(2, b)]
        rounds = [firstRound]

        const finalScore: [number, number] = final.games.finalScore

        // 3-D with a single round containing one matchup
        games = [
            [finalScore],
        ]
    }

    return { seeds, rounds, games }
}


/**
 * Resolves raw seed-number matchups into pairs of SeedMeta.
 * @param seeds    – record of seedNumber → SeedMeta
 * @param matchups – flat arrays of seedNumbers or [region, seed] tuples
 */
export function resolveMatchups(
    seeds: Record<number, SeedMeta>,
    matchups: Array<Array<number | [string, number]>>
): [SeedMeta, SeedMeta][][] {
    return matchups.map(round => {
        const pairs: [SeedMeta, SeedMeta][] = []
        for (let i = 0; i < round.length; i += 2) {
            const rawA = round[i]
            const rawB = round[i + 1]
            const resolve = (input: number | [string, number]): SeedMeta => {
                if (Array.isArray(input)) {
                    // final region pairing (region slug + seed)
                    return { name: `${input[0]}-${input[1]}`, color: 'gray' }
                }
                return seeds[input] || { name: '', color: 'gray' }
            }
            pairs.push([resolve(rawA), resolve(rawB)])
        }
        return pairs
    })
}
