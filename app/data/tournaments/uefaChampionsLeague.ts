// app/data/tournaments/uefaChampionsLeague.ts

import type { TournamentStructure, GameData, SeedMeta } from '@/types';
import { buildCustomRegion, fromGame, getSeed }        from '@/utils/bracketBuilder';
import { teamsData }                                  from '@/data/tournaments/teams/ucl';

// ———————————————————————————————————————————————————————————————
// Actual Round-of-16 draws for each season
// ———————————————————————————————————————————————————————————————
const uclR16Draws: Record<number, [string, string][]> = {
    2022: [
        ['sporting-cp',         'manchester-city'],
        ['benfica',             'ajax'],
        ['chelsea',             'lille'],
        ['atletico-madrid',     'manchester-united'],
        ['villarreal',          'juventus'],
        ['inter-milan',         'liverpool'],
        ['paris-saint-germain', 'real-madrid'],
        ['bayern-munich',       'rb-salzburg'],
    ],
    2023: [
        ['rb-leipzig',          'manchester-city'],
        ['club-brugge',         'benfica'],
        ['liverpool',           'real-madrid'],
        ['milan',               'tottenham-hotspur'],
        ['eintracht-frankfurt', 'napoli'],
        ['borussia-dortmund',   'chelsea'],
        ['inter-milan',         'porto'],
        ['paris-saint-germain', 'bayern-munich'],
    ],
    2024: [
        ['porto',               'arsenal'],
        ['napoli',              'barcelona'],
        ['paris-saint-germain', 'real-sociedad'],
        ['inter-milan',         'atletico-madrid'],
        ['psv-eindhoven',       'borussia-dortmund'],
        ['lazio',               'bayern-munich'],
        ['copenhagen',          'manchester-city'],
        ['rb-leipzig',          'real-madrid'],
    ],
    2025: [
        ['paris-saint-germain', 'liverpool'],
        ['club-brugge',         'aston-villa'],
        ['real-madrid',         'atletico-madrid'],
        ['psv-eindhoven',       'arsenal'],
        ['benfica',             'barcelona'],
        ['borussia-dortmund',   'lille'],
        ['bayern-munich',       'bayer-leverkusen'],
        ['feyenoord',           'inter-milan'],
    ],
};

// ———————————————————————————————————————————————————————————————
// Actual Quarter-final draws for each season
// ———————————————————————————————————————————————————————————————
const uclQFDraws: Record<number, [string, string][]> = {
    2022: [
        ['manchester-city', 'atletico-madrid'],
        ['chelsea',         'real-madrid'],
        ['villarreal',      'bayern-munich'],
        ['liverpool',       'benfica'],
    ],
    2023: [
        ['manchester-city', 'bayern-munich'],
        ['real-madrid',     'liverpool'],
        ['club-brugge',     'milan'],
        ['chelsea',         'inter-milan'],
    ],
    2024: [
        ['manchester-city',     'real-madrid'],
        ['paris-saint-germain', 'barcelona'],
        ['arsenal',             'bayern-munich'],
        ['atletico-madrid',     'borussia-dortmund'],
    ],
    2025: [
        ['paris-saint-germain', 'aston-villa'],
        ['arsenal',             'real-madrid'],
        ['barcelona',           'borussia-dortmund'],
        ['bayern-munich',       'inter-milan'],
    ],
};

export function getUclTournamentData(year: number): TournamentStructure {
    const r16 = uclR16Draws[year];
    const qf  = uclQFDraws[year];
    if (!r16 || !qf) throw new Error(`Missing UCL data for ${year}`);

    // map slug → its R16 index
    const slugToR16Idx: Record<string, number> = {};
    r16.forEach((pair, idx) => {
        slugToR16Idx[pair[0]] = idx;
        slugToR16Idx[pair[1]] = idx;
    });

    // split QFs into two sides
    const sideAQFPairs = qf.slice(0, 2);
    const sideBQFPairs = qf.slice(2, 4);

    // determine which R16 matches feed SideB (from QF #3 & #4)
    const sideBR16Idx = new Set<number>();
    sideBQFPairs.forEach(([a, b]) => {
        const ia = slugToR16Idx[a], ib = slugToR16Idx[b];
        if (ia == null || ib == null) {
            throw new Error(`QF slug not found in R16: ${a} or ${b}`);
        }
        sideBR16Idx.add(ia);
        sideBR16Idx.add(ib);
    });

    // SideA = complement of SideB
    const allIdx = Array.from(r16.keys());
    const sideAR16Idx = allIdx.filter(i => !sideBR16Idx.has(i));
    const sideBR16IdxArr = Array.from(sideBR16Idx).sort((a, b) => a - b);

    // extract the slug-pairs for each side in bracket order
    const sideAPairs = sideAR16Idx.map(i => r16[i]);
    const sideBPairs = sideBR16IdxArr.map(i => r16[i]);

    function buildSide(
        sideLabel: 'SideA' | 'SideB',
        r16Pairs: [string, string][],
        qfPairs:  [string, string][],
    ) {
        // a) assign seeds 1–8 from R16 slugs
        const teams: SeedMeta[] = r16Pairs.flat().map((slug, i) => {
            const meta = teamsData.find(t => t.name === slug);
            if (!meta) throw new Error(`Missing team metadata for "${slug}"`);
            return { ...meta, seed: i + 1 };
        });
        const seedMap: Record<number, string> = Object.fromEntries(
            teams.map(t => [t.seed!, t.name])
        );

        // helper: slug → seed number
        const slugToSeed = (slug: string) => {
            const m = teams.find(t => t.name === slug);
            if (!m) throw new Error(`Slug "${slug}" not in ${sideLabel}`);
            return m.seed!;
        };

        // b) Round-of-16 games (round = 0), manually only these 4
        const r16SeedPairs: [number, number][] = r16Pairs.map(
            ([a, b]) => [slugToSeed(a), slugToSeed(b)]
        );
        const r16Games: GameData[] = r16SeedPairs.map(([sa, sb], idx) => ({
            region:      sideLabel,
            roundNumber: 0,
            gameNumber:  idx,
            firstSeed:   getSeed(seedMap, teams, sa),
            secondSeed:  getSeed(seedMap, teams, sb),
        }));

        // c) Quarter-finals + Semi-finals via buildCustomRegion on just 2 ties
        const qfSeedPairs: [number, number][] = qfPairs.map(
            ([a, b]) => [slugToSeed(a), slugToSeed(b)]
        );
        const qfRegion = buildCustomRegion(sideLabel, seedMap, teams, qfSeedPairs);

        // extract qf games (orig round 0) → make them round 1
        const qfGames = qfRegion.games
            .filter(g => g.roundNumber === 0)
            .map(g => ({ ...g, roundNumber: 1 } as GameData));

        // extract semi game (orig round 1) → make it round 2
        const sfGames = qfRegion.games
            .filter(g => g.roundNumber === 1)
            .map(g => ({ ...g, roundNumber: 2 } as GameData));

        return {
            seeds: seedMap,
            games: [...r16Games, ...qfGames, ...sfGames],
        };
    }

    const regionA = buildSide('SideA', sideAPairs, sideAQFPairs);
    const regionB = buildSide('SideB', sideBPairs, sideBQFPairs);

    // Final between the two semi winners (round = 3)
    const finalGame: GameData = {
        region:      'Final',
        roundNumber: 0,
        gameNumber:  0,
        sourceGame1: fromGame('SideA', 2, 0),
        sourceGame2: fromGame('SideB', 2, 0),
    };

    return {
        regions: { SideA: regionA, SideB: regionB },
        final:   {
            seeds: { SideA: { name: '' }, SideB: { name: '' } },
            games: [finalGame],
        },
    };
}

// Convenience exports
export const uclTournamentData2022 = getUclTournamentData(2022);
export const uclTournamentData2023 = getUclTournamentData(2023);
export const uclTournamentData2024 = getUclTournamentData(2024);
export const uclTournamentData2025 = getUclTournamentData(2025);
