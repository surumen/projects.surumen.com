import type { TournamentStructure, GameData, SeedMeta } from '@/types';
import { buildCustomRegion, fromGame }                 from '@/utils/bracketBuilder';
import { teamsData as ncaaTeams }                      from '@/data/tournaments/teams/ncaaBasketball';

/**
 * For each year, a map: regionName → (seedNumber → teamName)
 * Copy your existing `regionSeeds` object under the year 2022.
 */
const seedsByYear: Record<
    number,
    Record<string, Record<number, string>>
> = {
    2022: {
        South: {
            1:  'houston',  2:  'marquette',3: 'kentucky',4: 'duke',
            5:  'wisconsin',6:'texas-tech',7:'florida',8: 'nebraska',
            9:  'texas-a&m',10:'colorado',11:'nc-state',12:'james-madison',
            13:'vermont',14:'oakland',15:'western-kentucky',16:'longwood',
        },
        East: {
            1:  'uconn',    2:  'iowa-state',3: 'illinois', 4: 'auburn',
            5:  'san-diego-state',6:'byu',   7:  'washington-state', 8: 'florida-atlantic',
            9:  'northwestern',10: 'drake',11: 'duquesne',12: 'uab',
            13: 'yale',14: 'morehead-state',15:'south-dakota-state',16:'stetson',
        },
        West: {
            1:  'unc',      2:  'arizona',  3:  'baylor',    4:  'alabama',
            5:  'saint-marys',6:'clemson',  7:  'dayton',    8:  'mississippi-state',
            9:  'michigan-state',10:'nevada',11:'new-mexico',12:'grand-canyon',
            13: 'college-of-charleston',14:'colgate',15:'long-beach-state',16:'wagner',
        },
        Midwest: {
            1:  'purdue',   2:  'tennessee',3: 'creighton',4: 'kansas',
            5:  'gonzaga',  6:  'south-carolina',7:'texas',8: 'utah-state',
            9:  'tcu',10:'colorado-state',11:'oregon',12:'mcneese-state',
            13:'samford',14:'akron',15:'st-peters',16:'grambling',
        },
    },
    2023: {
        South: {
            1:  'alabama',       2:  'arizona',       3:  'baylor',        4:  'virginia',
            5:  'san-diego-state',6: 'creighton',    7:  'missouri',      8:  'maryland',
            9:  'west-virginia',10: 'utah-state',   11: 'nc-state',     12: 'charleston',
            13: 'furman',       14: 'uc-santa-barbara',15: 'princeton',   16: 'texas-a&m-corpus-christi',
        },
        East: {
            1:  'purdue',        2:  'marquette',     3:  'kansas-state',  4:  'tennessee',
            5:  'duke',          6:  'kentucky',      7:  'michigan-state',8:  'memphis',
            9:  'florida-atlantic',10: 'usc',         11: 'providence',   12: 'oral-roberts',
            13: 'louisiana',     14: 'montana-state',15: 'vermont',       16: 'fairleigh-dickinson',
        },
        West: {
            1:  'kansas',        2:  'ucla',           3:  'gonzaga',       4:  'uconn',
            5:  'saint-marys',   6:  'tcu',            7:  'northwestern',  8:  'arkansas',
            9:  'illinois',     10:  'boise-state',   11:  'arizona-state',12:  'vcu',
            13: 'iona',         14:  'grand-canyon',  15:  'unc-asheville',16:  'howard',
        },
        Midwest: {
            1:  'houston',       2:  'texas',         3:  'xavier',        4:  'indiana',
            5:  'miami-fl',      6:  'iowa-state',    7:  'texas-a&m',     8:  'iowa',
            9:  'auburn',       10:  'penn-state',   11: 'mississippi-state',12: 'drake',
            13: 'kent-state',   14: 'kennesaw-state',15: 'colgate',      16: 'northern-kentucky',
        },
    },
    // — 2024 bracket seeds —
    2024: {
        South: {
            1: 'houston',   2: 'unc', 3: 'west-virginia', 4: 'penn-state',
            5: 'arkansas',  6: 'maryland',   7: 'texas-a&m', 8: 'florida',
            9: 'auburn',    10: 'kansas-state',11: 'baylor',    12: 'mississippi',
            13: 'creighton',14: 'belmont',   15: 'jacksonville-state',16: 'colgate',
        },
        East: {
            1: 'uconn',      2: 'iowa-state',  3: 'illinois',    4: 'auburn',
            5: 'san-diego-state', 6: 'byu',  7: 'washington-state', 8: 'florida-atlantic',
            9: 'northwestern',   10: 'drake', 11: 'duquesne',   12: 'uab',
            13: 'yale',     14: 'morehead-state', 15: 'south-dakota-state',16: 'longwood',
        },
        West: {
            1: 'ucla',      2: 'gonzaga',    3: 'memphis',     4: 'kansas-state',
            5: 'arizona',   6: 'michigan',   7: 'iowa',        8: 'marquette',
            9: 'boise-state',10: 'kentucky',11: 'usc',        12: 'xavier',
            13: 'vcu',     14: 'grand-canyon',15: 'montana',    16: 'fairleigh-dickinson',
        },
        Midwest: {
            1: 'purdue',    2: 'tennessee',  3: 'creighton',   4: 'kansas',
            5: 'gonzaga',   6: 'south-carolina', 7: 'texas', 8: 'utah-state',
            9: 'tcu',    10: 'virginia', 11: 'oregon',     12: 'mcneese-state',
            13: 'samford', 14: 'akron',    15: 'st-peters',  16: 'montana-state',
        },
    },
    2025: {
        South: {
            1:  'auburn',          2:  'michigan-state',3:  'iowa-state',  4:  'texas-a&m',
            5:  'michigan',        6:  'ole-miss',     7:  'marquette',    8:  'louisville',
            9:  'creighton',      10: 'new-mexico',  11:  'unc',12: 'uc-san-diego',
            13: 'yale',          14: 'lipscomb',    15: 'bryant',      16: 'alabama-state',
        },
        East: {
            1:  'duke',            2:  'alabama',      3:  'wisconsin',    4:  'arizona',
            5:  'oregon',          6:  'byu',          7:  'saint-marys',  8:  'mississippi-state',
            9:  'baylor',         10: 'vanderbilt',  11:  'vcu',         12:  'liberty',
            13:  'akron',         14:  'montana',     15:  'robert-morris',16:  'alabama-state',
        },
        West: {
            1:  'florida',         2:  'uconn',        3:  'memphis',      4:  'maryland',
            5:  'mississippi',     6:  'missouri',     7:  'kansas',       8:  'baylor',
            9:  'oklahoma',       10: 'georgia',     11:  'drake',       12:  'colorado-state',
            13: 'grand-canyon',   14: 'montana',     15: 'omaha',       16: 'norfolk-state',
        },
        Midwest: {
            1:  'houston',         2:  'tennessee',    3:  'kentucky',     4:  'purdue',
            5:  'clemson',         6:  'illinois',     7:  'ucla',         8:  'gonzaga',
            9:  'georgia',        10: 'utah-state',  11:  'texas',      12:  'mcneese-state',
            13:  'high-point',    14:  'troy',        15:  'wofford',    16:  'siu-edwardsville',
        },
    },
};

function buildYear(year: number): TournamentStructure {
    const regionSeeds = seedsByYear[year];
    if (!regionSeeds) throw new Error(`No NCAA data for ${year}`);

    // Round-of-64 bracket structure (same for all regions)
    const initialR64: [number, number][] = [
        [1, 16], [8, 9], [5, 12], [4, 13],
        [6, 11], [3, 14], [7, 10], [2, 15],
    ];

    // Build each region
    const regions = Object.fromEntries(
        Object.entries(regionSeeds).map(([regionName, seedsMap]) => [
            regionName,
            buildCustomRegion(regionName, seedsMap, ncaaTeams, initialR64),
        ])
    ) as Record<string, { seeds: Record<number,string>; games: GameData[] }>;

    // Final Four + Championship
    const finalGames: GameData[] = [
        {
            region: 'Final',
            roundNumber: 0,
            gameNumber: 0,
            sourceGame1: fromGame('West', 3, 0),
            sourceGame2: fromGame('East', 3, 0),
        },
        {
            region: 'Final',
            roundNumber: 0,
            gameNumber: 1,
            sourceGame1: fromGame('Midwest', 3, 0),
            sourceGame2: fromGame('South', 3, 0),
        },
        {
            region: 'Final',
            roundNumber: 1,
            gameNumber: 0,
            sourceGame1: fromGame('Final', 0, 0),
            sourceGame2: fromGame('Final', 0, 1),
        },
    ];

    // placeholders for Final-region seeds
    const finalSeeds: Record<string, SeedMeta> = Object.fromEntries(
        Object.keys(regionSeeds).map(r => [r, { name: '' }])
    ) as Record<string, SeedMeta>;

    return {
        regions,
        final: { seeds: finalSeeds, games: finalGames },
    };
}

// prebuilt 2022
export const ncaaTournamentData2022 = buildYear(2022);

/** Call this with any year you’ve defined above */
export function getNcaaTournamentData(year: number): TournamentStructure {
    return buildYear(year);
}
