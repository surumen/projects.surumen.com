import type { TournamentStructure, GameData, SeedMeta } from '@/types';
import { fromGame, buildCustomRegion }                  from '@/utils/bracketBuilder';
import { teamsData }                                    from '@/data/tournaments/teams/nba';

/** Raw playoff‐seed info */
const playoffs2022Seeds = [
    // West
    { abbreviation: 'PHX', seed: 1, conference: 'West' },
    { abbreviation: 'MEM', seed: 2, conference: 'West' },
    { abbreviation: 'GSW', seed: 3, conference: 'West' },
    { abbreviation: 'DEN', seed: 4, conference: 'West' },
    { abbreviation: 'MIN', seed: 5, conference: 'West' },
    { abbreviation: 'NOP', seed: 6, conference: 'West' },
    { abbreviation: 'LAL', seed: 7, conference: 'West' },
    { abbreviation: 'LAC', seed: 8, conference: 'West' },
    // East
    { abbreviation: 'BOS', seed: 1, conference: 'East' },
    { abbreviation: 'MIA', seed: 2, conference: 'East' },
    { abbreviation: 'MIL', seed: 3, conference: 'East' },
    { abbreviation: 'CLE', seed: 4, conference: 'East' },
    { abbreviation: 'NYK', seed: 5, conference: 'East' },
    { abbreviation: 'ATL', seed: 6, conference: 'East' },
    { abbreviation: 'PHI', seed: 7, conference: 'East' },
    { abbreviation: 'BKN', seed: 8, conference: 'East' },
] as const;

/** Build the 16‐team playoff list with full metadata in each entry */
const playoffs2022: SeedMeta[] = playoffs2022Seeds.map(ps => {
    const team = teamsData.find(t => t.abbreviation === ps.abbreviation);
    if (!team) throw new Error(`Team not found: ${ps.abbreviation}`);
    return { ...team, seed: ps.seed, conference: ps.conference };
});

/** Define how to seed each conference bracket */
const regionSeeds: Record<string, Record<number, string>> = {
    West: Object.fromEntries(
        playoffs2022
            .filter(t => t.conference === 'West')
            .map(t => [t.seed!, t.name])
    ),
    East: Object.fromEntries(
        playoffs2022
            .filter(t => t.conference === 'East')
            .map(t => [t.seed!, t.name])
    ),
};

/** Quarterfinal matchups */
const initialQuarters: [number, number][] = [
    [1, 8],
    [4, 5],
    [2, 7],
    [3, 6],
];

/** Build each conference bracket using your existing builder */
const regions = Object.fromEntries(
    Object.entries(regionSeeds).map(([conf, seedsMap]) => [
        conf,
        buildCustomRegion(conf, seedsMap, playoffs2022, initialQuarters),
    ])
) as Record<string, { seeds: Record<number, string>; games: GameData[] }>;

/** NBA Finals game */
const finalGames: GameData[] = [
    {
        roundNumber: 0,
        gameNumber: 0,
        region: 'Final',
        sourceGame1: fromGame('West', 2, 0),
        sourceGame2: fromGame('East', 2, 0),
    },
];

/** Placeholders for conf champions */
const finalSeeds: Record<string, SeedMeta> = {
    West: { name: '' },
    East: { name: '' },
};

/** One export—fully DRY, no resolveSeeds needed downstream */
export const nbaTournamentData: TournamentStructure = {
    regions,
    final: {
        seeds: finalSeeds,
        games: finalGames,
    },
};
