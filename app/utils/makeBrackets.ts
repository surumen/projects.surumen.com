import { v4 as uuid } from 'uuid';
import { Game, Side } from '@/types/Brackets';


const SEEDS_PAIRING_ORDER = [
    [1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]
];

const setSourceGame = (game: Game, sourceGame: Game) => {
    // home
    game.sides.home.seed = {
        ...game.sides.home.seed,
        sourceGame: sourceGame
    }

    // visitor
    game.sides.visitor.seed = {
        ...game.sides.visitor.seed,
        sourceGame: sourceGame
    }
}

const setHomeSourceGame = (game: Game, sourceGame: Game) => {
    game.sides.home.seed = {
        ...game.sides.home.seed,
        sourceGame: sourceGame
    }
}

const setVisitorSourceGame = (game: Game, sourceGame: Game) => {
    game.sides.visitor.seed = {
        ...game.sides.visitor.seed,
        sourceGame: sourceGame
    }
}

const setSourceGames = (games: Game[], sourceGame: Game) => {
  games.forEach(game => {
      setSourceGame(game, sourceGame);
  })
}


export const createBracket = (seeds: any[], numRounds: number = 3) => {
    const pairings: any[] = getPairings(seeds);

    const round4Game = createGame(
        {name: 'TBC', seed: 1},
        {name: 'TBC', seed: 1},
        `Elite 8`
    );

    // Sweet 16
    const round3Game1 = createGame(
        {name: 'TBC', seed: 1},
        {name: 'TBC', seed: 1},
        `Sweet 16`
    );
    const round3Game2 = createGame(
        {name: 'TBC', seed: 1},
        {name: 'TBC', seed: 1},
        `Sweet 16`
    );

    // Round 2
    const round2Game1 = createGame(
        {name: 'TBC', seed: 1},
        {name: 'TBC', seed: 1},
        `Round 2`
    );

    const round2Game2 = createGame(
        {name: 'TBC', seed: 1},
        {name: 'TBC', seed: 1},
        `Round 2`
    );

    const round2Game3 = createGame(
        {name: 'TBC', seed: 1},
        {name: 'TBC', seed: 1},
        `Round 2`
    );

    const round2Game4 = createGame(
        {name: 'TBC', seed: 1},
        {name: 'TBC', seed: 1},
        `Round 2`
    );
    const round2Games = [
        round2Game1, round2Game2, round2Game3, round2Game4
    ]


    let j = 0
    pairings.forEach((pair, i) => {
        const pairGame = createGame(pair.home, pair.visitor, 'Round 1');
        if (i % 2 === 0 || i === 0) {
            setHomeSourceGame(
                round2Games[j],
                pairGame
            )
        } else {
            setVisitorSourceGame(
                round2Games[j],
                pairGame
            )
        }
        j = i % 2 === 0 || i === 0 ? j : j + 1;
    })

    setHomeSourceGame(round3Game1, round2Game1)
    setVisitorSourceGame(round3Game1, round2Game2)

    setHomeSourceGame(round3Game2, round2Game3)
    setVisitorSourceGame(round3Game2, round2Game4)

    setHomeSourceGame(round4Game, round3Game1)
    setVisitorSourceGame(round4Game, round3Game2)

    return round4Game;
}

export const getPairings = (seeds: any[]) => {
    const pairings: any[] = [];
    SEEDS_PAIRING_ORDER.forEach(pair => {
        const topSeed = seeds[pair[0] - 1];
        const bottomSeed = seeds[pair[1] - 1];
        pairings.push({
            home: {
                name: topSeed.name,
                seed: topSeed.seed,
                logo: topSeed.logo,
            },
            visitor: {
                name: bottomSeed.name,
                seed: bottomSeed.seed,
                logo: bottomSeed.logo,
            },
        });
    })
    return pairings;
}


export const createGame = (
    home: {name: string, seed: number, displayName?: string, logo?: string},
    visitor: {name: string, seed: number, displayName?: string, logo?: string},
    name?: string,
    scheduled?: number
): Game => {
    return {
        id: uuid(),
        name: name ? name : 'Round 1',
        scheduled: scheduled ? scheduled : new Date().getTime(),
        sides: {
            [Side.HOME]: {
                team: {
                    id: uuid(),
                    name: home.name,
                    logo: home.logo
                },
                seed: {
                    rank: home.seed,
                    // sourceGame: null, // initial games will not have one,
                    displayName: home.displayName ? home.displayName : home.name
                }
            },
            [Side.VISITOR]: {
                team: {
                    id: uuid(),
                    name: visitor.name,
                    logo: visitor.logo
                },
                seed: {
                    rank: visitor.seed,
                    // sourceGame: null, // initial games will not have one,
                    displayName: visitor.displayName ? visitor.displayName : visitor.name
                }
            },
        }

    }
}


