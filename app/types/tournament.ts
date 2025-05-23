// components/types.ts

// --- Tournament data interfaces ---

export interface SeedMeta {
    name: string;
    abbreviation?: string;
    shortName?: string;
    fullName?: string;
    logo?: string;
    color?: string;

    /** (only for playoff teams) */
    seed?: number;
    conference?: string;
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
    isSeries?: boolean;
    isFinal?: boolean;
    finalScore?: [number, number];
    penalties?: [number, number];
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
    matchups: [SeedMeta | null, SeedMeta | null][][];
    games:    GameData[][];
    scores:   [number, number][][];
}

/**
 * User selections/results for the final region:
 *   matchups[roundIndex] = array of [regionName, seed] tuples
 *   games[roundIndex]    = array of scores for each matchup
 */
export interface BracketFinal {
    matchups: [SeedMeta | null, SeedMeta | null][][];
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

type Orientation = 'left' | 'right' | 'center';

export interface TeamProps {

    team: SeedMeta;
    position: 'top' | 'middle' | 'bottom';
    displayNamePredicted?: string;
    type?: Orientation;
    score?: number;
    isWinner?: boolean;
    penaltyGoals?: number;
    isFinalGame?: boolean;

    onClick?: () => void;
}

export interface GameSelectorProps {
    game: GameData,
    type: string;
    className?: string;
}

export interface GameProps {

    /** Full metadata for this game */
    game: GameData;

    /** Direction for rendering */
    type?: 'left' | 'right' | 'center';

    /** [teamA, teamB] from Redux picks */
    participants: [SeedMeta, SeedMeta];

    renderGameHeader?: (game: GameData, type: string) => React.ReactNode;
    renderGameFooter?: (game: GameData, type: string) => React.ReactNode;

    /** Called when clicking a team */
    onSeedClick?: (pick: SeedMeta) => void;
}

export interface RoundProps {

    /** full metadata for every game in this round, in order */
    gamesData: GameData[];

    /** “left” or “right” facing layout */
    type?: 'left' | 'right' | 'center';

    pick?: [SeedMeta | null, SeedMeta | null]

    /** refs for each rendered `<div>` around a game */
    gameRefs?: React.Ref<HTMLDivElement>[];

    renderGameHeader?: (game: GameData, type: string) => React.ReactNode;
    renderGameFooter?: (game: GameData, type: string) => React.ReactNode;

    /** click handler: (gameIndex, seed) */
    onSeedClick?: (seed: SeedMeta) => void;
}

export interface RegionProps {
    /** Region display name (e.g. “West”, “Final”) */
    name: string;

    /** Layout direction */
    type?: 'left' | 'right';

    /** Flat list of all games in this region (R64 → region final, or Final Four) */
    games: GameData[];

    /**
     * Picks & scores stored in Redux.
     * - For a non-final region, `matchups` is an array of seed-numbers per round.
     * - For the final region you’d use a different prop (`BracketFinal`) instead.
     */
    userData?: {
        /** now: for each round, an array of [seedA,seedB] picks (one tuple per game) */
        matchups: [SeedMeta|null, SeedMeta|null][][];
        /** unchanged: one [scoreA,scoreB] per game */
        games: [number,number][][];
    };

    renderRegionHeader?: (name: string) => React.ReactNode
    renderGameHeader?: (game: GameData, type: string) => React.ReactNode;
    renderGameFooter?: (game: GameData, type: string) => React.ReactNode;

    /** When true, render in Final-region style */
    isFinal?: boolean;

    semiSeedsMaps?: any;

    /** Called when the user clicks a seed button */
    onAdvanceTeam?: (
        game:    GameData,
        round:   number,
        gameIdx: number,
        pick:    SeedMeta
    ) => void;
}

export interface DynamicBracketProps {
    tournamentType?: string;
    year?: number;
    regionsPerRow?: number;
    managerKey?: string;

    renderRegionHeader?: (name: string) => React.ReactNode;
    renderGameHeader?: (game: GameData, type: string) => React.ReactNode;
    renderGameFooter?: (game: GameData, type: string) => React.ReactNode;
}
