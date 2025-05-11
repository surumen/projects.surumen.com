import type { TournamentStructure, GameData, SeedMeta } from '@/types';
import { buildCustomRegion, fromGame }      from '@/utils/bracketBuilder';
import { teamsData as nbaTeams }            from '@/data/tournaments/teams/nba';

/** Per‐conference seed‐to‐slug maps */
export const regionSeeds: Record<string, Record<number, string>> = {
    West: {
        1: 'phoenix',
        2: 'memphis',
        3: 'golden-state',
        4: 'denver',
        5: 'minnesota',
        6: 'new-orleans',
        7: 'los-angeles-lakers',
        8: 'los-angeles-clippers',
    },
    East: {
        1: 'miami',
        2: 'boston',
        3: 'milwaukee',
        4: 'cleveland',
        5: 'new-york-knicks',
        6: 'atlanta',
        7: 'philadelphia',
        8: 'brooklyn',
    },
};

/** Initial placeholders for the two conference champions */
const finalSeeds: Record<string, SeedMeta> = Object.fromEntries(
    Object.keys(regionSeeds).map(conf => [conf, { name: '' }])
) as Record<string, SeedMeta>;

/** Quarterfinal pairings for an 8‐team bracket */
const initialQuarters: [number, number][] = [
    [1, 8], [4, 5], [2, 7], [3, 6],
];

/** Build each conference bracket (Quarters → Semis → Final) */
const regions = Object.fromEntries(
    Object.entries(regionSeeds).map(([conf, seedsMap]) => [
        conf,
        buildCustomRegion(conf, seedsMap, nbaTeams, initialQuarters),
    ])
);

/** The NBA Finals: winner of the Conf Finals */
const finalGames: GameData[] = [
    {
        roundNumber: 0,
        gameNumber: 0,
        region: 'Final',
        sourceGame1: fromGame('West', 2, 0),
        sourceGame2: fromGame('East', 2, 0),
    },
];

export const nbaTournamentData: TournamentStructure = {
    regions,
    final: {
        seeds: finalSeeds,
        games: finalGames,
    },
};
