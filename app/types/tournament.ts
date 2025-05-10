// components/types.ts

// --- Tournament data interfaces ---

/** One region of the tournament (e.g. East, West, Midwest, South) */
export interface TournamentRegion {
    /** map seed number to team slug */
    seeds: Record<number, string>;
    /** rounds[i] = array of seed numbers for round i */
    rounds: number[][];
    /** games[i][j] = array of scores for matchup j in round i */
    games: number[][][];
}

/** Final stage combining regions */
export interface FinalRegion {
    /** map region name to that region's seed mapping */
    seeds: Record<string, Record<number, string>>;
    rounds: number[][];
    games: number[][][];
}

/** Full tournament structure with dynamic regions and final */
export interface TournamentStructure {
    /** dynamic regions keyed by name */
    regions: Record<string, TournamentRegion>;
    final: FinalRegion;
}

// --- Bracket result interfaces ---

/**
 * User selections/results for a non-final region:
 *   matchups[roundIndex] = flat array of seed numbers
 *   games[roundIndex]   = array of scores for each matchup
 */
export interface BracketRegion {
    matchups: number[][];
    games: number[][];
}

/**
 * User selections/results for the final region:
 *   matchups[roundIndex] = array of [regionName, seed] tuples
 *   games[roundIndex]    = array of scores for each matchup
 */
export interface BracketFinal {
    matchups: [string, number][][];
    games: number[][];
    winner: string;
}

/**
 * All users' bracket selections: dynamic userName keys
 */
export interface BracketData {
    [userName: string]: {
        regions: Record<string, BracketRegion>;
        final: BracketFinal;
    };
}

// --- Component prop interfaces ---

type Orientation = 'left' | 'right';

export interface TeamProps {
    name?: string;
    seed: number;
    displayName: string;
    namePredicted?: string;
    seedPredicted?: number;
    displayNamePredicted?: string;
    position: 'top' | 'middle' | 'bottom';
    type?: Orientation;
}

export interface GameSelectorProps {
    games?: number[];
    seeds?: Record<number, { name: string }>;
    gamesPredicted?: number;
    type?: Orientation;
}

export interface GameProps {
    seeds: Record<number, string>;
    firstSeed: number;
    secondSeed: number;
    games?: number[];
    gamesPredicted?: number;
    firstSeedPredicted?: number;
    secondSeedPredicted?: number;
    final?: boolean;
    type?: 'left' | 'right';
}

export interface RoundProps {
    /** seeds for this round (or final-seeds map for Final) */
    seeds: Record<number, string> | FinalRegion['seeds'];
    /** flat array mixing seed numbers and [region,seed] tuples */
    pairings: Array<number | [string, number]>;
    /** scores for this round */
    games: number[][];
    /** predicted scores per matchup */
    gamesPredicted: number[];
    /** optional predicted pairings, same structure as pairings */
    pairingsPredicted?: Array<number | [string, number]>;
    /** if true, renders in final style */
    final?: boolean;
    /** round index */
    number: number;
    /** total number of rounds in this region */
    maxRounds: number;
    /** region direction for justification */
    type?: 'left' | 'right';
    /** champion name, only for final round */
    champion?: string;

    baselineMatchCount?: any;

    gameRefs?: React.Ref<HTMLDivElement>[];
}

export interface RegionProps {
    name: string;
    type?: 'left' | 'right';
    seeds: Record<number, string> | FinalRegion['seeds'];
    rounds: number[][];
    games: number[][][];
    userData: {
        matchups: Array<number | [string, number]>[];
        games: number[][];
    };
    champion?: string;
}

export interface DynamicBracketProps {
    managerKey: string;
}
