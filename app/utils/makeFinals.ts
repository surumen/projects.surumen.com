import * as _ from 'underscore';
import { winningPathLength } from "@/utils/winningPathLength";
import { Game } from "@/types/Brackets";


export const makeFinals = (games: Game[]): Array<{ game: Game, height: number }> => {
    const isInGroup = (() => {
        const gameIdHash: { [id: string]: true } =
            _.reduce(
                games,
                (
                    memo: { [id: string]: true }, game: Game) => {
                    memo[game.id] = true;
                    return memo;
                },
                {} as { [id: string]: true }
            );

        return (id: string) => (gameIdHash[id]);
    })();

    const gamesFeedInto = _.map(
        games,
        game => ({
            ...game,
            feedsInto: _.filter(
                games,
                ({ id, sides }) => (
                    isInGroup(id) &&
                    _.any(
                        sides,
                        (sourceGame: any) => sourceGame && sourceGame.id === game.id
                    )
                )
            )
        })
    );

    return _.chain(gamesFeedInto)
        // get the games that don't feed into anything else in the group, i.e. finals for this game group
        .filter(({ feedsInto }) => feedsInto.length === 0)
        .map(
            // get their heights
            game => ({
                game,
                height: winningPathLength(game)
            })
        )
        // render the tallest bracket first
        .sortBy(({ height }) => height * -1)
        .value();
};
