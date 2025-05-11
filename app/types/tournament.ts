// components/types.ts

// --- Tournament data interfaces ---

export interface SeedMeta {
    name: string;
    abbreviation?: string;
    shortName?: string;
    logo?: string;
    color?: string;
}

export interface GameSource {
    region: string;
    roundNumber: number;
    gameNumber: number;
}

export interface GameData {
    roundNumber: number;
    gameNumber: number;
    region: string;
    firstSeed?: SeedMeta;
    secondSeed?: SeedMeta;
    sourceGame1?: GameSource;
    sourceGame2?: GameSource;
    winnerSeed?: SeedMeta;
    finalScore?: [number, number];
}

export interface TournamentRegion {
    seeds: Record<number, string>;
    games: GameData[];
}

export interface FinalRegion {
    /** champion metadata by region name — empty until filled */
    seeds: Record<string, SeedMeta>;

    /** all Final Four + Championship games */
    games: GameData[];
}

export interface TournamentStructure {
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
    matchups: [number, number][][];
    games: [number, number][][];
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
    /** Full slug name (for aria / keying) */
    name?: string;

    /** Seed number */
    seed: number;

    /** What to show as the main label */
    displayName: string;

    /** Optional override when you’re showing predictions */
    displayNamePredicted?: string;

    /** Current position in the game cell */
    position: 'top' | 'middle' | 'bottom';

    /** Layout direction */
    type?: Orientation;

    /** Optional Bootstrap color variant or CSS color */
    color?: string;

    /** Optional short abbreviation (e.g. “UO” for Oregon) */
    abbreviation?: string;

    /** Optional path or URL to a team logo image */
    logo?: string;

    /** Click handler */
    onClick?: () => void;
}

export interface GameSelectorProps {
    games?: number[];
    seeds?: Record<number, { name: string }>;
    gamesPredicted?: number;
    type?: Orientation;
}

export interface GameProps {
    /** Lookup map seed number → SeedMeta */
    seeds: Record<number, SeedMeta>;

    /** Full metadata for this game */
    game: GameData;

    /** Direction for rendering */
    type?: 'left' | 'right';

    /** explicit [teamA, teamB] from Redux picks */
    participants?: [SeedMeta?, SeedMeta?];

    /** Called when clicking a team */
    onSeedClick?: (seed: number) => void;
}

export interface RoundProps {
    /** seeds lookup (seed number → SeedMeta) */
    seeds: Record<number, SeedMeta>;

    /** full metadata for every game in this round, in order */
    gamesData: GameData[];

    /** if true, renders in final (championship) style */
    final?: boolean;

    /** this round’s index (0 = first round, etc) */
    number: number;

    /** total number of rounds in this region */
    maxRounds: number;

    /** “left” or “right” facing layout */
    type?: 'left' | 'right';

    picks?: any;

    /** refs for each rendered `<div>` around a game */
    gameRefs?: React.Ref<HTMLDivElement>[];

    /** click handler: (gameIndex, seed) */
    onSeedClick?: (gameIndex: number, seed: number) => void;
}

export interface RegionProps {
    /** Region display name (e.g. “West”, “Final”) */
    name: string;

    /** Layout direction */
    type?: 'left' | 'right';

    /** Map seed number → team slug for lookup */
    seeds: Record<number, SeedMeta>;

    /** Flat list of all games in this region (R64 → region final, or Final Four) */
    games: GameData[];

    /**
     * Picks & scores stored in Redux.
     * - For a non-final region, `matchups` is an array of seed-numbers per round.
     * - For the final region you’d use a different prop (`BracketFinal`) instead.
     */
    userData?: {
        /** now: for each round, an array of [seedA,seedB] picks (one tuple per game) */
        matchups: [number,number][][];
        /** unchanged: one [scoreA,scoreB] per game */
        games: [number,number][][];
    };

    /** When true, render in Final-region style */
    isFinal?: boolean;

    /** Called when the user clicks a seed button */
    onAdvanceTeam?: (round: number, gameIndex: number, seed: number) => void;
}

export interface DynamicBracketProps {
    tournamentType?: string;
    regionsPerRow?: number;
    managerKey?: string;
}
