import type { TournamentStructure, GameData, SeedMeta } from '@/types';
import { buildCustomRegion, fromGame, getSeed }        from '@/utils/bracketBuilder';
import { teamsData }                                  from '@/data/tournaments/teams/ucl';

// ———————————————————————————————————————————————————————————————
// 1) Raw match-by-match results for each season
// ———————————————————————————————————————————————————————————————
interface MatchResult {
    firstSeed:  { name: string; goals: number; penaltyGoals?: number; isWinner: boolean };
    secondSeed: { name: string; goals: number; penaltyGoals?: number; isWinner: boolean };
}

const uclR16Results: Record<number, MatchResult[]> = {
    2022: [
        { firstSeed:{name:'sporting-cp',         goals:0, isWinner:false}, secondSeed:{name:'manchester-city', goals:5, isWinner:true } },
        { firstSeed:{name:'benfica',             goals:3, isWinner:true }, secondSeed:{name:'ajax',            goals:2, isWinner:false} },
        { firstSeed:{name:'chelsea',             goals:4, isWinner:true }, secondSeed:{name:'lille',           goals:1, isWinner:false} },
        { firstSeed:{name:'atletico-madrid',     goals:2, isWinner:true }, secondSeed:{name:'manchester-united',goals:1, isWinner:false} },
        { firstSeed:{name:'villarreal',          goals:4, isWinner:true }, secondSeed:{name:'juventus',        goals:1, isWinner:false} },
        { firstSeed:{name:'inter-milan',         goals:1, isWinner:false}, secondSeed:{name:'liverpool',       goals:2, isWinner:true } },
        { firstSeed:{name:'paris-saint-germain', goals:2, isWinner:false}, secondSeed:{name:'real-madrid',     goals:3, isWinner:true } },
        { firstSeed:{name:'bayern-munich',       goals:8, isWinner:true }, secondSeed:{name:'rb-salzburg',     goals:2, isWinner:false} },
    ],
    2023: [
        { firstSeed:{name:'rb-leipzig',          goals:1, isWinner:false}, secondSeed:{name:'manchester-city', goals:8, isWinner:true } },
        { firstSeed:{name:'club-brugge',         goals:1, isWinner:false}, secondSeed:{name:'benfica',         goals:7, isWinner:true } },
        { firstSeed:{name:'liverpool',           goals:2, isWinner:false}, secondSeed:{name:'real-madrid',     goals:6, isWinner:true } },
        { firstSeed:{name:'milan',               goals:1, isWinner:true }, secondSeed:{name:'tottenham-hotspur',goals:0, isWinner:false} },
        { firstSeed:{name:'eintracht-frankfurt', goals:0, isWinner:false}, secondSeed:{name:'napoli',          goals:5, isWinner:true } },
        { firstSeed:{name:'borussia-dortmund',   goals:1, isWinner:false}, secondSeed:{name:'chelsea',         goals:2, isWinner:true } },
        { firstSeed:{name:'inter-milan',         goals:1, isWinner:true }, secondSeed:{name:'porto',           goals:0, isWinner:false} },
        { firstSeed:{name:'paris-saint-germain', goals:0, isWinner:false}, secondSeed:{name:'bayern-munich',    goals:3, isWinner:true } },
    ],
    2024: [
        { firstSeed:{name:'porto',               goals:1, penaltyGoals:0, isWinner:false}, secondSeed:{name:'arsenal',          goals:1, penaltyGoals:4, isWinner:true } },
        { firstSeed:{name:'napoli',              goals:2, isWinner:false},              secondSeed:{name:'barcelona',        goals:4, isWinner:true } },
        { firstSeed:{name:'paris-saint-germain', goals:4, isWinner:true },             secondSeed:{name:'real-sociedad',    goals:1, isWinner:false} },
        { firstSeed:{name:'inter-milan',         goals:2, isWinner:false},              secondSeed:{name:'atletico-madrid',  goals:2, penaltyGoals:3, isWinner:true } },
        { firstSeed:{name:'psv-eindhoven',       goals:1, isWinner:false},              secondSeed:{name:'borussia-dortmund',goals:3, isWinner:true } },
        { firstSeed:{name:'lazio',               goals:1, isWinner:false},              secondSeed:{name:'bayern-munich',    goals:3, isWinner:true } },
        { firstSeed:{name:'copenhagen',          goals:2, isWinner:false},              secondSeed:{name:'manchester-city',  goals:6, isWinner:true } },
        { firstSeed:{name:'rb-leipzig',          goals:1, isWinner:false},              secondSeed:{name:'real-madrid',      goals:2, isWinner:true } },
    ],
    2025: [
        { firstSeed:{name:'paris-saint-germain', goals:1, penaltyGoals:4, isWinner:true }, secondSeed:{name:'liverpool',       goals:1, penaltyGoals:1, isWinner:false} },
        { firstSeed:{name:'club-brugge',         goals:1, isWinner:false},               secondSeed:{name:'aston-villa',     goals:6, isWinner:true } },
        { firstSeed:{name:'real-madrid',         goals:2, penaltyGoals:4, isWinner:true}, secondSeed:{name:'atletico-madrid', goals:2, penaltyGoals:2, isWinner:false } },
        { firstSeed:{name:'psv-eindhoven',       goals:3, isWinner:false},               secondSeed:{name:'arsenal',         goals:9, isWinner:true } },
        { firstSeed:{name:'benfica',             goals:1, isWinner:false},               secondSeed:{name:'barcelona',       goals:4, isWinner:true } },
        { firstSeed:{name:'borussia-dortmund',   goals:3, isWinner:true },               secondSeed:{name:'lille',           goals:2, isWinner:false} },
        { firstSeed:{name:'bayern-munich',       goals:5, isWinner:true },               secondSeed:{name:'bayer-leverkusen',goals:0, isWinner:false} },
        { firstSeed:{name:'feyenoord',           goals:1, isWinner:false},               secondSeed:{name:'inter-milan',     goals:4, isWinner:true } },
    ],
};

const uclQFResults: Record<number, MatchResult[]> = {
    2022: [
        { firstSeed:{name:'manchester-city',goals:1, isWinner:true }, secondSeed:{name:'atletico-madrid',goals:0, isWinner:false} },
        { firstSeed:{name:'chelsea',        goals:4, isWinner:false}, secondSeed:{name:'real-madrid',     goals:5, isWinner:true } },
        { firstSeed:{name:'villarreal',     goals:2, isWinner:true }, secondSeed:{name:'bayern-munich',   goals:1, isWinner:false} },
        { firstSeed:{name:'liverpool',      goals:6, isWinner:true }, secondSeed:{name:'benfica',         goals:4, isWinner:false} },
    ],
    2023: [
        { firstSeed:{name:'manchester-city',goals:8, isWinner:true }, secondSeed:{name:'bayern-munich',   goals:1, isWinner:false} },
        { firstSeed:{name:'real-madrid',    goals:6, isWinner:true }, secondSeed:{name:'liverpool',       goals:2, isWinner:false} },
        { firstSeed:{name:'club-brugge',    goals:1, isWinner:false}, secondSeed:{name:'milan',           goals:2, isWinner:true } },
        { firstSeed:{name:'chelsea',        goals:1, isWinner:false}, secondSeed:{name:'inter-milan',     goals:2, isWinner:true } },
    ],
    2024: [
        { firstSeed:{name:'manchester-city',goals:3, penaltyGoals:3, isWinner:false}, secondSeed:{name:'real-madrid',  goals:4, penaltyGoals:3, isWinner:true } },
        { firstSeed:{name:'paris-saint-germain',goals:2, isWinner:false},             secondSeed:{name:'barcelona',    goals:6, isWinner:true } },
        { firstSeed:{name:'arsenal',         goals:2, isWinner:false},                 secondSeed:{name:'bayern-munich',goals:3, isWinner:true } },
        { firstSeed:{name:'atletico-madrid', goals:4, isWinner:false},                 secondSeed:{name:'borussia-dortmund',goals:5,isWinner:true} },
    ],
    2025: [
        { firstSeed:{name:'paris-saint-germain',goals:5,isWinner:true},   secondSeed:{name:'aston-villa',  goals:4,isWinner:false} },
        { firstSeed:{name:'arsenal',         goals:5,isWinner:true},      secondSeed:{name:'real-madrid',  goals:1,isWinner:false} },
        { firstSeed:{name:'barcelona',       goals:5,isWinner:true},      secondSeed:{name:'borussia-dortmund',goals:3,isWinner:false} },
        { firstSeed:{name:'bayern-munich',   goals:3,isWinner:false},     secondSeed:{name:'inter-milan',   goals:4,isWinner:true} },
    ],
};

const uclSFResults: Record<number, MatchResult[]> = {
    2022: [
        { firstSeed:{name:'manchester-city',goals:5, isWinner:false}, secondSeed:{name:'real-madrid',goals:6, isWinner:true } },
        { firstSeed:{name:'liverpool',      goals:5, isWinner:true }, secondSeed:{name:'bayern-munich',goals:2, isWinner:false} },
    ],
    2023: [
        { firstSeed:{name:'manchester-city',goals:4, isWinner:false}, secondSeed:{name:'real-madrid',goals:5, isWinner:true} },
        { firstSeed:{name:'milan',          goals:0, isWinner:false}, secondSeed:{name:'inter-milan',goals:3, isWinner:true} },
    ],
    2024: [
        { firstSeed:{name:'real-madrid',    goals:3, isWinner:true},  secondSeed:{name:'barcelona',   goals:4, isWinner:false} },
        { firstSeed:{name:'arsenal',        goals:1, isWinner:false}, secondSeed:{name:'borussia-dortmund',goals:3,isWinner:true} },
    ],
    2025: [
        { firstSeed:{name:'paris-saint-germain',goals:2, isWinner:false}, secondSeed:{name:'real-madrid',goals:3, isWinner:true} },
        { firstSeed:{name:'aston-villa',      goals:2, isWinner:false}, secondSeed:{name:'bayern-munich',goals:3, isWinner:true} },
    ],
};

const uclFinalResults: Record<number, MatchResult> = {
    2022: { firstSeed:{name:'liverpool',goals:0, isWinner:false}, secondSeed:{name:'real-madrid',goals:1, isWinner:true } },
    2023: { firstSeed:{name:'manchester-city',goals:1, isWinner:true}, secondSeed:{name:'inter-milan',goals:0, isWinner:false} },
    2024: { firstSeed:{name:'borussia-dortmund',goals:0, isWinner:false}, secondSeed:{name:'real-madrid',goals:2, isWinner:true } },
    2025: { firstSeed:{name:'arsenal',goals:3, isWinner:true }, secondSeed:{name:'real-madrid',goals:2, isWinner:false} },
};

// ———————————————————————————————————————————————————————————————
// 2) Original draws (R16→QF→SF) and Final
// ———————————————————————————————————————————————————————————————
const uclR16Draws: Record<number, [string,string][]> = {
    2022: [
        ['sporting-cp','manchester-city'],
        ['benfica','ajax'],
        ['chelsea','lille'],
        ['atletico-madrid','manchester-united'],
        ['villarreal','juventus'],
        ['inter-milan','liverpool'],
        ['paris-saint-germain','real-madrid'],
        ['bayern-munich','rb-salzburg'],
    ],
    2023: [
        ['rb-leipzig','manchester-city'],
        ['club-brugge','benfica'],
        ['liverpool','real-madrid'],
        ['milan','tottenham-hotspur'],
        ['eintracht-frankfurt','napoli'],
        ['borussia-dortmund','chelsea'],
        ['inter-milan','porto'],
        ['paris-saint-germain','bayern-munich'],
    ],
    2024: [
        ['porto','arsenal'],
        ['napoli','barcelona'],
        ['paris-saint-germain','real-sociedad'],
        ['inter-milan','atletico-madrid'],
        ['psv-eindhoven','borussia-dortmund'],
        ['lazio','bayern-munich'],
        ['copenhagen','manchester-city'],
        ['rb-leipzig','real-madrid'],
    ],
    2025: [
        ['paris-saint-germain','liverpool'],
        ['club-brugge','aston-villa'],
        ['real-madrid','atletico-madrid'],
        ['psv-eindhoven','arsenal'],
        ['benfica','barcelona'],
        ['borussia-dortmund','lille'],
        ['bayern-munich','bayer-leverkusen'],
        ['feyenoord','inter-milan'],
    ],
};

const uclQFDraws: Record<number, [string,string][]> = {
    2022: [
        ['manchester-city','atletico-madrid'],
        ['chelsea','real-madrid'],
        ['villarreal','bayern-munich'],
        ['liverpool','benfica'],
    ],
    2023: [
        ['manchester-city','bayern-munich'],
        ['real-madrid','liverpool'],
        ['club-brugge','milan'],
        ['chelsea','inter-milan'],
    ],
    2024: [
        ['manchester-city','real-madrid'],
        ['paris-saint-germain','barcelona'],
        ['arsenal','bayern-munich'],
        ['atletico-madrid','borussia-dortmund'],
    ],
    2025: [
        ['paris-saint-germain','aston-villa'],
        ['arsenal','real-madrid'],
        ['barcelona','borussia-dortmund'],
        ['bayern-munich','inter-milan'],
    ],
};

export function getUclTournamentData(year: number): TournamentStructure {
    const r16 = uclR16Draws[year];
    const qf  = uclQFDraws[year];
    if (!r16 || !qf) throw new Error(`Missing UCL data for ${year}`);

    // map slug → its R16 index
    const slugToR16Idx: Record<string,number> = {};
    r16.forEach(([a,b],i)=>{ slugToR16Idx[a]=i; slugToR16Idx[b]=i });

    // split QFs into SideA / SideB
    const sideAQF = qf.slice(0,2);
    const sideBQF = qf.slice(2,4);

    // determine which R16 slots feed SideB
    const sideBR16IdxSet = new Set<number>();
    sideBQF.forEach(([a,b])=>{
        sideBR16IdxSet.add(slugToR16Idx[a]);
        sideBR16IdxSet.add(slugToR16Idx[b]);
    });

    // build arrays of R16 indices
    const allIdx        = r16.map((_,i)=>i);
    const sideAR16Idx   = allIdx.filter(i=>!sideBR16IdxSet.has(i));
    const sideBR16IdxArr = Array.from(sideBR16IdxSet).sort((a,b)=>a-b);

    // extract the actual slug-pairs
    const sideAR16 = sideAR16Idx.map(i=>r16[i]);
    const sideBR16 = sideBR16IdxArr.map(i=>r16[i]);

    function buildSide(
        sideLabel:'SideA'|'SideB',
        r16Pairs:[string,string][],
        qfPairs:[string,string][]
    ): { seeds: Record<number,string>; games: GameData[] } {
        // a) assign seeds & build map
        const teams:SeedMeta[] = r16Pairs.flat().map((slug,i)=>{
            const m = teamsData.find(t=>t.name===slug)!;
            return { ...m, seed: i+1 };
        });
        const seedMap = Object.fromEntries(teams.map(t=>[t.seed!,t.name]));
        const slugToSeed = (s:string) => teams.find(t=>t.name===s)!.seed!;

        // b) Round-of-16
        const r16Games = r16Pairs.map(([a,b],i) => ({
            region: sideLabel, roundNumber:0, gameNumber:i,
            firstSeed: getSeed(seedMap, teams, slugToSeed(a)),
            secondSeed:getSeed(seedMap, teams, slugToSeed(b)),
        })).map(g => {
            const m = uclR16Results[year][g.gameNumber];
            return {
                ...g,
                finalScore:[m.firstSeed.goals, m.secondSeed.goals] as [number,number],
                penalties: m.firstSeed.penaltyGoals != null
                    ? [m.firstSeed.penaltyGoals!, m.secondSeed.penaltyGoals!] as [number,number]
                    : undefined,
                winnerSeed: m.firstSeed.isWinner ? g.firstSeed! : g.secondSeed!,
            };
        });

        // c) Quarter-finals + Semi-finals
        const region = buildCustomRegion(
            sideLabel,
            seedMap,
            teams,
            qfPairs.map(([a,b])=>[slugToSeed(a), slugToSeed(b)] as [number,number])
        );

        const qfGames = region.games.filter(g=>g.roundNumber===0)
            .map((g,i) => {
                const m = uclQFResults[year][i];
                return {
                    ...g, roundNumber:1,
                    finalScore:[m.firstSeed.goals, m.secondSeed.goals] as [number,number],
                    penalties: m.firstSeed.penaltyGoals != null
                        ? [m.firstSeed.penaltyGoals!, m.secondSeed.penaltyGoals!] as [number,number]
                        : undefined,
                    winnerSeed: m.firstSeed.isWinner ? g.firstSeed! : g.secondSeed!,
                };
            }) as GameData[];

        const sfGames = region.games.filter(g=>g.roundNumber===1)
            .map((g,i) => {
                const m = uclSFResults[year][i];
                return {
                    ...g, roundNumber:2,
                    finalScore:[m.firstSeed.goals, m.secondSeed.goals] as [number,number],
                    penalties: m.firstSeed.penaltyGoals != null
                        ? [m.firstSeed.penaltyGoals!, m.secondSeed.penaltyGoals!] as [number,number]
                        : undefined,
                    winnerSeed: m.firstSeed.isWinner ? g.firstSeed! : g.secondSeed!,
                };
            }) as GameData[];

        return { seeds: seedMap, games: [...r16Games, ...qfGames, ...sfGames] };
    }

    const regionA = buildSide('SideA', sideAR16, sideAQF);
    const regionB = buildSide('SideB', sideBR16, sideBQF);

    // Final
    const rawFinal:GameData = {
        region:'Final', roundNumber:0, gameNumber:0,
        sourceGame1: fromGame('SideA', 2, 0),
        sourceGame2: fromGame('SideB', 2, 0),
        isFinal: true
    };
    const fm = uclFinalResults[year];
    const finalGame:GameData = {
        ...rawFinal,
        finalScore:[fm.firstSeed.goals, fm.secondSeed.goals] as [number,number],
        penalties: fm.firstSeed.penaltyGoals != null
            ? [fm.firstSeed.penaltyGoals!, fm.secondSeed.penaltyGoals!] as [number,number]
            : undefined,
        winnerSeed: fm.firstSeed.isWinner
            ? { name: fm.firstSeed.name }
            : { name: fm.secondSeed.name },
    };

    return {
        regions: { SideA: regionA, SideB: regionB },
        final: {
            seeds: { SideA:{name:''}, SideB:{name:''} },
            games: [finalGame],
        },
    };
}

// Convenience exports
export const uclTournamentData2022 = getUclTournamentData(2022);
export const uclTournamentData2023 = getUclTournamentData(2023);
export const uclTournamentData2024 = getUclTournamentData(2024);
export const uclTournamentData2025 = getUclTournamentData(2025);
