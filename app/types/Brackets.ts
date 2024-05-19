
export enum Side {
    HOME = 'home',
    VISITOR = 'visitor'
}

export interface SideInfo {
    score?: {
        score: number | null;
        penalties?: number;
        winProbability?: number;
    };

    seed?: {
        displayName?: string;
        rank?: number;
        sourceGame?: Game;
        sourcePool?: any;
    };

    team?: {
        id: string;
        name: string;
        logo?: string;
    }
}

export interface Game {
    id: string;
    // the game name
    name: string;
    // optional: the label for the game within the bracket, e.g. Gold Finals, Silver Semi-Finals
    bracketLabel?: string;
    // the unix timestamp of the game-will be transformed to a human-readable time using momentjs
    scheduled: number;

    court?: {
        name: string;
        venue: {
            name: string
        }
    };

    sides: {
        [side in Side]: SideInfo
    };
}
