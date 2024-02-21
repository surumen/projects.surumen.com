import { v4 as uuid } from 'uuid';
import { Court, Game } from '@/types';
import { TOURNAMENT_ROUNDS_MAP } from "@/data/champions-league/Rounds";
import { UCL_STADIUMS } from "@/data/champions-league/Stadiums";



export const generateTournamentMap = (rounds: any) => {
    return rounds.reduce((map, round, index) => {
        map[round.name] = index;
        return map;
    }, {});
}

export const constructTournamentTree = (): Game => {
    let tournamentTree;
    const dataMap = generateTournamentMap(TOURNAMENT_ROUNDS_MAP);
    TOURNAMENT_ROUNDS_MAP.forEach(game => {
        if (game.sourceGame === null) {
            tournamentTree = game;
            return;
        }

        const parent: any = TOURNAMENT_ROUNDS_MAP[dataMap[game.sourceGame]];
        parent.children = [...(parent.children || []), game];
    });
    traverseTournamentTree(tournamentTree);
    return tournamentTree as Game;
}

export const traverseTournamentTree = (tree: Game) => {
    if (!tree || !tree.children || tree.children.length !== 2) {
        populateInitialGameData(tree, null, null);
        return;
    }
    const left = tree.children[0];
    const right = tree.children[1];
    populateInitialGameData(tree, left, right);
    traverseTournamentTree(left);
    traverseTournamentTree(right);
}


export const populateInitialGameData = (game: Game, home: Game | null, visitor: Game | null) => {
    game.id = uuid();
    game.scheduled = 1499551200000;
    game.court = UCL_STADIUMS[0];  // TODO: set individual stadiums
    game.sides = {
        home: {
            team: null, score: null,
            seed: {
                rank: 1, sourceGame: home, displayName: home ? `Winner of ${home.name}` : `${game.name}`
            }
        },
        visitor: {
            team: null, score: null,
            seed: {
                rank: 1, sourceGame: visitor, displayName: visitor ? `Winner of ${visitor.name}` : `${game.name}`
            }
        }
    }
}
