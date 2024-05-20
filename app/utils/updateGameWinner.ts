import { Game, SideInfo } from '@/types/Brackets';


export const updateGameWinner = (team: SideInfo, game: Game, bracket: Game): Game => {
    return updateSourceGame(game, team, bracket);
}

const updateSourceGame = (game: Game, team: SideInfo, bracket: Game) => {
    if (bracket.sides.home.sourceGame?.id === game.id || bracket.sides.visitor.sourceGame?.id === game.id) {
        if (bracket.sides.home.name === 'TBC') {
            bracket.sides.home.id = team.id;
            bracket.sides.home.name = team.name;
            bracket.sides.home.logo = team.logo;
            bracket.sides.home.seed = team.seed;
        } else {
            bracket.sides.visitor.id = team.id;
            bracket.sides.visitor.name = team.name;
            bracket.sides.visitor.logo = team.logo;
            bracket.sides.visitor.seed = team.seed;
        }
        return bracket;
    }
    if (bracket.sides.home.sourceGame) {
        updateSourceGame(game, team, bracket.sides.home.sourceGame);
    }
    if (bracket.sides.visitor.sourceGame) {
        updateSourceGame(game, team, bracket.sides.visitor.sourceGame);
    }
    return bracket;
}


