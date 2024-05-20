import { v4 as uuid } from 'uuid';
import { Game, SideInfo, TBC } from "@/types/Brackets";


export const updateGameWinner = (winner: SideInfo, loser: SideInfo, game: Game, bracket: Game): Game => {
    const updateLoser: Game  = removeLoserFromAdvancedRounds(loser, game.round, bracket);
    return updateSourceGame(game, winner, loser, updateLoser);
}


const updateSourceGame = (game: Game, winner: SideInfo, loser: SideInfo, bracket: Game) => {
    // TODO: enhance

    const homeSourceGame = bracket.sides.home.sourceGame;
    const visitorSourceGame = bracket.sides.visitor.sourceGame;

    if (homeSourceGame?.id === game.id) {
        bracket.sides.home = {
            ...bracket.sides.home,
            id: winner.id,
            name: winner.name,
            logo: winner.logo,
            seed: winner.seed
        }
    }

    else if (visitorSourceGame?.id === game.id) {
        bracket.sides.visitor = {
            ...bracket.sides.visitor,
            id: winner.id,
            name: winner.name,
            logo: winner.logo,
            seed: winner.seed
        }
    }

    if (bracket.sides.home.sourceGame) {
        updateSourceGame(game, winner, loser, bracket.sides.home.sourceGame);
    }
    if (bracket.sides.visitor.sourceGame) {
        updateSourceGame(game, winner, loser, bracket.sides.visitor.sourceGame);
    }
    return bracket;
}



// All Good
const removeLoserFromAdvancedRounds = (loser: SideInfo, currentRound: number, bracket: Game): Game => {
    if (bracket.round === currentRound) {
        return bracket;
    }
    if (
        (bracket.sides.home.sourceGame?.round && bracket.sides.home.sourceGame.round > currentRound) ||
        (bracket.sides.visitor.sourceGame?.round && bracket.sides.visitor.sourceGame.round > currentRound)
    ) {
        if (bracket.sides.home.id === loser.id) {
            bracket.sides.home = {
                ...bracket.sides.home,
                id: uuid(), name: TBC, logo: '', seed: 1
            }
        } else if (bracket.sides.visitor.id === loser.id) {
            bracket.sides.visitor = {
                ...bracket.sides.visitor,
                id: uuid(), name: TBC, logo: '', seed: 1
            }
        }
    }
    if (bracket.sides.home.sourceGame) {
        removeLoserFromAdvancedRounds(loser, currentRound, bracket.sides.home.sourceGame);
    }
    if (bracket.sides.visitor.sourceGame) {
        removeLoserFromAdvancedRounds(loser, currentRound, bracket.sides.visitor.sourceGame);
    }
    return bracket;
}


