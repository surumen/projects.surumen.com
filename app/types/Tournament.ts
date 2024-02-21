
export interface TournamentRound {
    name: string;
    prefix: string | null;
    numOfGames: number;
}

export interface Game {
    id: string;
    name: string;
    scheduled: number;
    court: Court;
    sides: {
        home: GameParticipant;
        visitor: GameParticipant;
    };
}

export interface GameParticipant {
    team: Team | null;
    score: Score | null;
    seed: TeamSeeding | null;
}

export interface TeamSeeding {
    rank: number;
    displayName: string;
    sourceGame?: Game;
}

export interface Team {
    id: string;
    name: string;
    logo?: string;
}

export interface Score {
    fullTime: string;
    penalties?: string;
}

export interface Court {
    id: string;
    name: string;
    homeTeamId?: string;
}

