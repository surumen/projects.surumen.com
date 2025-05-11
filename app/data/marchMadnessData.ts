// data/ncaaTournamentData.ts

import type { TournamentStructure, GameData, SeedMeta } from '@/types';
import { buildRegion, fromGame } from '@/utils/bracketBuilder';
import { teamsData } from '@/data/ncaaTeamsData';

/** Per-region seed-to-slug maps */
export const regionSeeds: Record<string, Record<number, string>> = {
    West: {
        1: 'unc',    2: 'arizona', 3: 'baylor',  4: 'alabama',
        5: 'saint-marys', 6: 'clemson', 7: 'dayton', 8: 'mississippi-state',
        9: 'michigan-state', 10: 'nevada', 11: 'new-mexico', 12: 'grand-canyon',
        13: 'college-of-charleston', 14: 'colgate', 15: 'long-beach-state', 16: 'wagner',
    },
    East: {
        1: 'uconn', 2: 'iowa-state', 3: 'illinois', 4: 'auburn',
        5: 'san-diego-state', 6: 'byu', 7: 'washington-state', 8: 'florida-atlantic',
        9: 'northwestern', 10: 'drake', 11: 'duquesne', 12: 'uab',
        13: 'yale', 14: 'morehead-state', 15: 'south-dakota-state', 16: 'stetson',
    },
    Midwest: {
        1: 'purdue', 2: 'tennessee', 3: 'creighton', 4: 'kansas',
        5: 'gonzaga', 6: 'south-carolina', 7: 'texas', 8: 'utah-state',
        9: 'tcu', 10: 'colorado-state', 11: 'oregon', 12: 'mcneese-state',
        13: 'samford', 14: 'akron', 15: 'st-peters', 16: 'grambling',
    },
    South: {
        1: 'houston', 2: 'marquette', 3: 'kentucky', 4: 'duke',
        5: 'wisconsin', 6: 'texas-tech', 7: 'florida', 8: 'nebraska',
        9: 'texas-a&m', 10: 'colorado', 11: 'nc-state', 12: 'james-madison',
        13: 'vermont', 14: 'oakland', 15: 'western-kentucky', 16: 'longwood',
    },
};

/**
 * Build an initial map of champions for the Final region.
 * Each entry starts as a placeholder SeedMeta.
 */
const finalSeeds: Record<string, SeedMeta> = Object.keys(regionSeeds).reduce(
    (acc, region) => {
        acc[region] = { name: '' };
        return acc;
    },
    {} as Record<string, SeedMeta>
);

// Build each region’s seeds + games
const regions = Object.fromEntries(
    Object.entries(regionSeeds).map(([regionName, seedsMap]) => [
        regionName,
        buildRegion(regionName, seedsMap, teamsData)
    ])
);

// Final Four + Championship games
const finalGames: GameData[] = [
    {
        roundNumber: 0,
        gameNumber: 0,
        region: 'Final',
        sourceGame1: fromGame(Object.keys(regionSeeds)[0], 3, 0),
        sourceGame2: fromGame(Object.keys(regionSeeds)[1], 3, 0),
    },
    {
        roundNumber: 0,
        gameNumber: 1,
        region: 'Final',
        sourceGame1: fromGame(Object.keys(regionSeeds)[2], 3, 0),
        sourceGame2: fromGame(Object.keys(regionSeeds)[3], 3, 0),
    },
    {
        roundNumber: 1,
        gameNumber: 0,
        region: 'Final',
        sourceGame1: fromGame('Final', 0, 0),
        sourceGame2: fromGame('Final', 0, 1),
    }
];

export const ncaaTournamentData: TournamentStructure = {
    regions,
    final: {
        seeds: finalSeeds,
        games: finalGames,
    }
};
