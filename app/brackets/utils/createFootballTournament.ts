import * as _ from 'underscore';
import { v4 as uuid } from 'uuid';
import { Court, Game, TournamentRound } from '@/types';


export const createFootballTournament = (rounds: TournamentRound[], courts: Court[]): Game => {
    const tournamentGames: Game[][] = getTournamentGames(rounds, courts);

    let tournament: Game = tournamentGames[0][0];

    tournamentGames.forEach((roundGames, level) => {
        if (level === 0 || roundGames.length === 1) {
            tournament = roundGames[0];
        } else if (level === 1 && roundGames.length === 2) {
            // SF1
            tournament.sides.home.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[0].name}`,
                sourceGame: roundGames[0]
            };
            // SF2
            tournament.sides.visitor.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[1].name}`,
                sourceGame: roundGames[1]
            };
        } else if (
            level === 2 && roundGames.length === 4
            && tournament.sides.home.seed
            && tournament.sides.home.seed.sourceGame
            && tournament.sides.visitor.seed
            && tournament.sides.visitor.seed.sourceGame
        ) {
            // QF1
            tournament.sides.home.seed.sourceGame.sides.home.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[0].name}`,
                sourceGame: roundGames[0]
            };
            // QF2
            tournament.sides.home.seed.sourceGame.sides.visitor.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[1].name}`,
                sourceGame: roundGames[1]
            };
            // QF3
            tournament.sides.visitor.seed.sourceGame.sides.home.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[2].name}`,
                sourceGame: roundGames[2]
            };
            // QF4
            tournament.sides.visitor.seed.sourceGame.sides.visitor.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[3].name}`,
                sourceGame: roundGames[3]
            };
        } else if (
            level === 3 && roundGames.length === 8

            && tournament.sides.home.seed
            && tournament.sides.home.seed.sourceGame
            && tournament.sides.visitor.seed
            && tournament.sides.visitor.seed.sourceGame

            && tournament.sides.home.seed.sourceGame.sides.home.seed
            && tournament.sides.home.seed.sourceGame.sides.home.seed.sourceGame
            && tournament.sides.home.seed.sourceGame.sides.visitor.seed
            && tournament.sides.home.seed.sourceGame.sides.visitor.seed.sourceGame
            && tournament.sides.visitor.seed.sourceGame.sides.home.seed
            && tournament.sides.visitor.seed.sourceGame.sides.home.seed.sourceGame
            && tournament.sides.visitor.seed.sourceGame.sides.visitor.seed
            && tournament.sides.visitor.seed.sourceGame.sides.visitor.seed.sourceGame
        ) {
            // Round of 16 - M1
            tournament.sides.home.seed.sourceGame.sides.home.seed.sourceGame.sides.home.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[0].name}`,
                sourceGame: roundGames[0]
            };
            // Round of 16 - M2
            tournament.sides.home.seed.sourceGame.sides.home.seed.sourceGame.sides.visitor.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[1].name}`,
                sourceGame: roundGames[1]
            };
            // Round of 16 - M3
            tournament.sides.home.seed.sourceGame.sides.visitor.seed.sourceGame.sides.home.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[2].name}`,
                sourceGame: roundGames[2]
            };
            // Round of 16 - M4
            tournament.sides.home.seed.sourceGame.sides.visitor.seed.sourceGame.sides.visitor.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[3].name}`,
                sourceGame: roundGames[3]
            };

            // Round of 16 - M5
            tournament.sides.visitor.seed.sourceGame.sides.home.seed.sourceGame.sides.home.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[0].name}`,
                sourceGame: roundGames[0]
            };
            // Round of 16 - M6
            tournament.sides.visitor.seed.sourceGame.sides.home.seed.sourceGame.sides.visitor.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[1].name}`,
                sourceGame: roundGames[1]
            };
            // Round of 16 - M7
            tournament.sides.visitor.seed.sourceGame.sides.visitor.seed.sourceGame.sides.home.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[2].name}`,
                sourceGame: roundGames[2]
            };
            // Round of 16 - M8
            tournament.sides.visitor.seed.sourceGame.sides.visitor.seed.sourceGame.sides.visitor.seed = {
                rank: 1,
                displayName: `Winner of ${roundGames[3].name}`,
                sourceGame: roundGames[3]
            };
        }
    });
    return tournament;
}

export const getTournamentGames = (rounds: TournamentRound[], courts: Court[]): Game[][] => {
    const tournamentGames: Game[][] = [];

    _.each(rounds, (round) => {

        const roundGames: Game[] = [];
        let count = 1;
        _.times(round.numOfGames, () => {
            const game: Game = {
                id: uuid(),
                name: round.prefix ? `${round.prefix}${count}` : round.name,
                scheduled: 1499551200000,
                court: courts[0], // TODO: change
                sides: {
                    home: {
                        team: null,
                        score: null,
                        seed: null
                    },
                    visitor: {
                        team: null,
                        score: null,
                        seed: null
                    }
                }
            };
            count = count + 1;
            roundGames.push(game);
        });
        tournamentGames.push(roundGames);
    });
    return tournamentGames;
}