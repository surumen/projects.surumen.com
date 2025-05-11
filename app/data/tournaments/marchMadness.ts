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
        West: {
            1:  'unc',      2:  'arizona',  3:  'baylor',    4:  'alabama',
            5:  'saint-marys',6:'clemson',  7:  'dayton',    8:  'mississippi-state',
            9:  'michigan-state',10:'nevada',11:'new-mexico',12:'grand-canyon',
            13: 'college-of-charleston',14:'colgate',15:'long-beach-state',16:'wagner',
        },
        East: {
            1:  'uconn',    2:  'iowa-state',3: 'illinois', 4: 'auburn',
            5:  'san-diego-state',6:'byu',   7:  'washington-state', 8: 'florida-atlantic',
            9:  'northwestern',10: 'drake',11: 'duquesne',12: 'uab',
            13: 'yale',14: 'morehead-state',15:'south-dakota-state',16:'stetson',
        },
        Midwest: {
            1:  'purdue',   2:  'tennessee',3: 'creighton',4: 'kansas',
            5:  'gonzaga',  6:  'south-carolina',7:'texas',8: 'utah-state',
            9:  'tcu',10:'colorado-state',11:'oregon',12:'mcneese-state',
            13:'samford',14:'akron',15:'st-peters',16:'grambling',
        },
        South: {
            1:  'houston',  2:  'marquette',3: 'kentucky',4: 'duke',
            5:  'wisconsin',6:'texas-tech',7:'florida',8: 'nebraska',
            9:  'texas-a&m',10:'colorado',11:'nc-state',12:'james-madison',
            13:'vermont',14:'oakland',15:'western-kentucky',16:'longwood',
        },
    },
    // 2023, 2024, … go here
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
