import * as _ from 'underscore';
import winningPathLength from './winningPathLength';

export const makeFinals = ({ games }) => {

    const isInGroup = (() => {
        const gameIdHash =
            _.reduce(games, (id: any, memo) => ({ ...memo, [id]: true }), {});

        return (id) => (gameIdHash[id] === true);
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
                        ({ seed }) => seed && seed.sourceGame && seed.rank === 1 && seed.sourceGame.id === game.id
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

}
