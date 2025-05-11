import type { TournamentStructure, GameData, SeedMeta } from '@/types';
import { buildCustomRegion, fromGame }                from '@/utils/bracketBuilder';
import { teamsData }                                  from '@/data/tournaments/teams/nba';

interface PlayoffSeed {
    abbreviation: string;
    seed:        number;
    conference:  string;
}

// Add more years here as needed
const playoffsSeedsByYear: Record<number, PlayoffSeed[]> = {
    2022: [
        // Western Conference
        { abbreviation: 'PHX', seed: 1, conference: 'West' },
        { abbreviation: 'MEM', seed: 2, conference: 'West' },
        { abbreviation: 'GSW', seed: 3, conference: 'West' },
        { abbreviation: 'DEN', seed: 4, conference: 'West' },
        { abbreviation: 'MIN', seed: 5, conference: 'West' },
        { abbreviation: 'NOP', seed: 6, conference: 'West' },
        { abbreviation: 'LAL', seed: 7, conference: 'West' },
        { abbreviation: 'LAC', seed: 8, conference: 'West' },

        // Eastern Conference
        { abbreviation: 'BOS', seed: 1, conference: 'East' },
        { abbreviation: 'MIA', seed: 2, conference: 'East' },
        { abbreviation: 'MIL', seed: 3, conference: 'East' },
        { abbreviation: 'CLE', seed: 4, conference: 'East' },
        { abbreviation: 'NYK', seed: 5, conference: 'East' },
        { abbreviation: 'ATL', seed: 6, conference: 'East' },
        { abbreviation: 'PHI', seed: 7, conference: 'East' },
        { abbreviation: 'BKN', seed: 8, conference: 'East' },
    ],
    2023: [
        // Western Conference
        { abbreviation: 'DEN', seed: 1, conference: 'West' },
        { abbreviation: 'MEM', seed: 2, conference: 'West' },
        { abbreviation: 'SAC', seed: 3, conference: 'West' },
        { abbreviation: 'PHX', seed: 4, conference: 'West' },
        { abbreviation: 'LAC', seed: 5, conference: 'West' },
        { abbreviation: 'GSW', seed: 6, conference: 'West' },
        { abbreviation: 'LAL', seed: 7, conference: 'West' },
        { abbreviation: 'MIN', seed: 8, conference: 'West' },

        // Eastern Conference
        { abbreviation: 'MIL', seed: 1, conference: 'East' },
        { abbreviation: 'BOS', seed: 2, conference: 'East' },
        { abbreviation: 'PHI', seed: 3, conference: 'East' },
        { abbreviation: 'CLE', seed: 4, conference: 'East' },
        { abbreviation: 'NYK', seed: 5, conference: 'East' },
        { abbreviation: 'BKN', seed: 6, conference: 'East' },
        { abbreviation: 'ATL', seed: 7, conference: 'East' },
        { abbreviation: 'MIA', seed: 8, conference: 'East' },
    ],

    2024: [
        // Western Conference
        { abbreviation: 'OKC', seed: 1, conference: 'West' },
        { abbreviation: 'DEN', seed: 2, conference: 'West' },
        { abbreviation: 'MIN', seed: 3, conference: 'West' },
        { abbreviation: 'LAC', seed: 4, conference: 'West' },
        { abbreviation: 'DAL', seed: 5, conference: 'West' },
        { abbreviation: 'PHX', seed: 6, conference: 'West' },
        { abbreviation: 'LAL', seed: 7, conference: 'West' },
        { abbreviation: 'NOP', seed: 8, conference: 'West' },

        // Eastern Conference
        { abbreviation: 'BOS', seed: 1, conference: 'East' },
        { abbreviation: 'NYK', seed: 2, conference: 'East' },
        { abbreviation: 'MIL', seed: 3, conference: 'East' },
        { abbreviation: 'CLE', seed: 4, conference: 'East' },
        { abbreviation: 'ORL', seed: 5, conference: 'East' },
        { abbreviation: 'IND', seed: 6, conference: 'East' },
        { abbreviation: 'PHI', seed: 7, conference: 'East' },
        { abbreviation: 'MIA', seed: 8, conference: 'East' },
    ],

    2025: [
        // Western Conference
        { abbreviation: 'OKC', seed: 1, conference: 'West' },
        { abbreviation: 'HOU', seed: 2, conference: 'West' },
        { abbreviation: 'LAL', seed: 3, conference: 'West' },
        { abbreviation: 'DEN', seed: 4, conference: 'West' },
        { abbreviation: 'LAC', seed: 5, conference: 'West' },
        { abbreviation: 'MIN', seed: 6, conference: 'West' },
        { abbreviation: 'GSW', seed: 7, conference: 'West' },
        { abbreviation: 'MEM', seed: 8, conference: 'West' },

        // Eastern Conference
        { abbreviation: 'CLE', seed: 1, conference: 'East' },
        { abbreviation: 'BOS', seed: 2, conference: 'East' },
        { abbreviation: 'NYK', seed: 3, conference: 'East' },
        { abbreviation: 'IND', seed: 4, conference: 'East' },
        { abbreviation: 'MIL', seed: 5, conference: 'East' },
        { abbreviation: 'DET', seed: 6, conference: 'East' },
        { abbreviation: 'ORL', seed: 7, conference: 'East' },
        { abbreviation: 'MIA', seed: 8, conference: 'East' },
    ],
};

function buildYear(year: number): TournamentStructure {
    const raw = playoffsSeedsByYear[year];
    if (!raw) throw new Error(`No NBA data for ${year}`);

    // 1) stitch
    const playoffs: SeedMeta[] = raw.map(ps => {
        const team = teamsData.find(t => t.abbreviation === ps.abbreviation);
        if (!team) throw new Error(`NBA team not found: ${ps.abbreviation}`);
        return { ...team, seed: ps.seed, conference: ps.conference };
    });

    // 2) regionSeeds
    const regionSeeds: Record<string, Record<number,string>> = {};
    for (const conf of ['West','East']) {
        regionSeeds[conf] = Object.fromEntries(
            playoffs.filter(t => t.conference === conf)
                .map(t => [t.seed!, t.name])
        );
    }

    // 3) build brackets
    const initialQuarters: [number,number][] = [[1,8],[4,5],[2,7],[3,6]];
    const regions = Object.fromEntries(
        Object.entries(regionSeeds).map(([conf, map]) => [
            conf,
            buildCustomRegion(conf, map, playoffs, initialQuarters),
        ])
    ) as Record<string,{ seeds: Record<number,string>; games: GameData[] }>;

    // 4) finals
    const finalGames: GameData[] = [{
        region: 'Final', roundNumber: 0, gameNumber: 0,
        sourceGame1: fromGame('West',2,0),
        sourceGame2: fromGame('East',2,0),
    }];
    const finalSeeds: Record<string,SeedMeta> = {
        West: { name: '' }, East: { name: '' }
    };

    return { regions, final: { seeds: finalSeeds, games: finalGames } };
}

export const nbaTournamentData2022 = buildYear(2022);
export function getNbaTournamentData(year: number): TournamentStructure {
    return buildYear(year);
}
