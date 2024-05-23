import { v4 as uuid } from 'uuid';
import { Game, SideInfo, TBC } from "@/types/Brackets";


export const updateGameWinner = (winner: SideInfo, loser: SideInfo, game: Game, bracket: Game, label: 'east' | 'west' | 'south' | 'midwest' | 'final'): Game => {
    const updatedGame: Game  = removeLoserFromAdvancedRounds(loser, game.round, bracket);
    return updateSourceGame(game, winner, updatedGame);
}

export const advanceToFinalFour = (winner: SideInfo, loser: SideInfo, game: Game, bracket: Game, label: 'east' | 'west' | 'south' | 'midwest' | 'final') => {
    const updatedGame: Game  = removeLoserFromAdvancedRounds(loser, game.round, bracket);
    switch (label) {
        case "east":
            if (updatedGame.sides.home.sourceGame) {
                updatedGame.sides.home.sourceGame.sides.home = {
                    ...updatedGame.sides.home.sourceGame?.sides.home,
                    id: winner.id,
                    name: winner.name,
                    logo: winner.logo,
                    seed: winner.seed
                }
            }
            break
        case "west":
            if (updatedGame.sides.home.sourceGame) {
                updatedGame.sides.home.sourceGame.sides.visitor = {
                    ...updatedGame.sides.home.sourceGame?.sides.visitor,
                    id: winner.id,
                    name: winner.name,
                    logo: winner.logo,
                    seed: winner.seed
                }
            }
            break
        case "south":
            if (updatedGame.sides.visitor.sourceGame) {
                updatedGame.sides.visitor.sourceGame.sides.home = {
                    ...game.sides.visitor.sourceGame?.sides.home,
                    id: winner.id,
                    name: winner.name,
                    logo: winner.logo,
                    seed: winner.seed
                }
            }
            break
        case "midwest":
            if (updatedGame.sides.visitor.sourceGame) {
                updatedGame.sides.visitor.sourceGame.sides.visitor = {
                    ...game.sides.visitor.sourceGame?.sides.visitor,
                    id: winner.id,
                    name: winner.name,
                    logo: winner.logo,
                    seed: winner.seed
                }
            }
            break
        case "final":
            updatedGame.winner = {
                ...updatedGame.winner,
                id: winner.id,
                name: winner.name,
                logo: winner.logo,
                seed: winner.seed
            }
            break
        default:
            break
    }
    return updatedGame;
}

export const advanceToFinal = (winner: SideInfo, bracket: Game, label: 'east' | 'west' | 'south' | 'midwest') => {
  switch (label) {
      case "east" || "west":
          bracket.sides.home = {
              ...bracket.sides.home,
              id: winner.id,
              name: winner.name,
              logo: winner.logo,
              seed: winner.seed
          }
          break
      case "south" || "midwest":
          bracket.sides.visitor = {
              ...bracket.sides.visitor,
              id: winner.id,
              name: winner.name,
              logo: winner.logo,
              seed: winner.seed
          }
          break
      default:
          break
  }
}


const updateSourceGame = (game: Game, winner: SideInfo, bracket: Game) => {
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
        updateSourceGame(game, winner, bracket.sides.home.sourceGame);
    }
    if (bracket.sides.visitor.sourceGame) {
        updateSourceGame(game, winner, bracket.sides.visitor.sourceGame);
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


