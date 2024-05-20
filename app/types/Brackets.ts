
export enum Side {
    HOME = 'home',
    VISITOR = 'visitor'
}

export const TBC: string = 'TBC';

export interface SideInfo {
    id: string;
    name: string;
    logo?: string;
    seed?: number;
    sourceGame?: Game;
    score?: {
        score?: number;
        isWinner?: boolean;
        penalties?: number;
        winProbability?: number;
    };
}

export interface Game {
    id: string;
    // the game name
    name: string;
    // optional: the label for the game within the bracket, e.g. Gold Finals, Silver Semi-Finals
    bracketLabel?: string;
    // the unix timestamp of the game-will be transformed to a human-readable time using momentjs
    scheduled: number;
    round: number;
    sides: {
        [side in Side]: SideInfo
    };
}
