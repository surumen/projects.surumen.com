import { v4 as uuid } from 'uuid';
import { Game, Team } from "@/types";
import { UCL_STADIUMS } from "@/data/champions-league/Stadiums";


export const generateTournamentMap = (rounds: any) => {
    return rounds.reduce((map, round, index) => {
        map[round.name] = index;
        return map;
    }, {});
}

export const constructTournamentTree = (roundsMap, teamsData): Game => {
    let tournamentTree;
    const dataMap = generateTournamentMap(roundsMap);
    roundsMap.forEach(game => {
        if (game.sourceGame === null) {
            tournamentTree = game;
            return;
        }

        const parent: any = roundsMap[dataMap[game.sourceGame]];
        parent.children = [...(parent.children || []), game];
    });
    const teamsDraw = shuffleDraw(teamsData);
    traverseTournamentTree(tournamentTree, teamsDraw);
    return tournamentTree as Game;
}

export const traverseTournamentTree = (tree: Game, teamsDraw: Team[][]) => {
    if (!tree || !tree.children || tree.children.length !== 2) {
        populateInitialGameData(tree, null, null);

        const matchup = teamsDraw[0];
        tree.sides.home.team = matchup[0];
        tree.sides.visitor.team = matchup[1];
        teamsDraw.shift();
        return;
    }
    const left = tree.children[0];
    const right = tree.children[1];
    populateInitialGameData(tree, left, right);
    traverseTournamentTree(left, teamsDraw);
    traverseTournamentTree(right, teamsDraw);
}

export const DFS = (tree: Game, gameId: string, currentTeam: Team) => {
    if (!tree) {
      return tree;
    }
    if (gameId && currentTeam && tree.sides && tree.sides.home && tree.sides.home.seed && tree.sides.home.seed.sourceGame) {
        if (tree.sides.home.seed.sourceGame.id === gameId) {
              tree.sides.home.team = currentTeam;
        }
        DFS(tree.sides.home.seed.sourceGame, gameId, currentTeam);
    }
    if (gameId && currentTeam && tree.sides && tree.sides.visitor && tree.sides.visitor.seed && tree.sides.visitor.seed.sourceGame) {
        if (tree.sides.visitor.seed.sourceGame.id === gameId) {
            tree.sides.visitor.team = currentTeam;
        }
        DFS(tree.sides.visitor.seed.sourceGame, gameId, currentTeam);
    }
    return tree;
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


const shuffle = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
};

const shuffleDraw = (data: any[]) => {
    const combinations = pairwise(data);
    const draw: any[][] = [];

    const drawnTeams: any = [];
    combinations.forEach(combination => {
        const firstTeam = combination[0];
        const secondTeam = combination[1];

        if (!drawnTeams.includes(firstTeam) && !drawnTeams.includes(secondTeam)) {
            draw.push(combination)
            drawnTeams.push(firstTeam);
            drawnTeams.push(secondTeam);
        }
    });
    return draw;
}

const pairwise = (data: any[]): any[] => {
    return data.sort().reduce(
        (acc, item, i, arr) => acc.concat(
            arr.slice(i + 1).map(_item => [item, _item])
        ), [])
}
