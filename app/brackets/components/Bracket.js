/***************************
 Component : Bracket
 ****************************

 Available Parameters

// To Add

 */

// import node module libraries
import PropTypes from 'prop-types';
import * as _ from 'underscore';

// import widget/custom components
import BracketGame, { GameProps } from './BracketGame';
import winningPathLength from '../utils/winningPathLength';



const Bracket = (props) => {
    const {
        GameComponent, game, gameDimensions, svgPadding, roundSeparatorWidth, homeOnTop, lineInfo, children, ...rest
    } = props;

    const numRounds = winningPathLength(game);

    const svgDimensions = {
        height: (gameDimensions.height * Math.pow(2, numRounds - 1)) + svgPadding * 2,
        width: (numRounds * (gameDimensions.width + roundSeparatorWidth)) + svgPadding * 2
    };

    const toBracketGames = (
        {
            GameComponent,
            game,
            homeOnTop,
            lineInfo,
            gameDimensions,
            roundSeparatorWidth,
            x,
            y,
            round,
            ...rest
        }) => {

        const { width: gameWidth, height: gameHeight } = gameDimensions;
        const ySep = gameHeight * Math.pow(2, round - 2);

        return [
            <g key={`${game.id}-${y}`}>
                <GameComponent
                    {...rest} {...gameDimensions}
                    key={game.id} homeOnTop={homeOnTop} game={game} x={x} y={y}/>
            </g>
        ].concat(
            _.chain(game.sides)
                .map((sideInfo, side) => ({ ...sideInfo, side }))
                // filter to the teams that come from winning other games
                .filter(({ seed }) => seed && seed.sourceGame !== null && seed.rank === 1)
                .map(
                    ({ seed: { sourceGame }, side }) => {
                        // we put visitor teams on the bottom
                        const isTop = side === 'home' ? homeOnTop : !homeOnTop;
                        const multiplier = isTop ? -1 : 1;

                        const pathInfo = [
                            `M${x - lineInfo.separation} ${y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
                            `H${x - (roundSeparatorWidth / 2)}`,
                            `V${y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
                            `H${x - roundSeparatorWidth + lineInfo.separation}`
                        ];

                        return [
                            <path key={`${game.id}-${side}-${y}-path`} d={pathInfo.join(' ')} fill="transparent" stroke="black"/>
                        ]
                            .concat(
                                toBracketGames(
                                    {
                                        GameComponent,
                                        game: sourceGame,
                                        homeOnTop,
                                        lineInfo,
                                        gameDimensions,
                                        roundSeparatorWidth,
                                        x: x - gameWidth - roundSeparatorWidth,
                                        y: y + ((ySep / 2) * multiplier),
                                        round: round - 1,
                                        ...rest
                                    }
                                )
                            );
                    }
                )
                .flatten(true)
                .value()
        );
    };

    return (
        <svg {...svgDimensions}>
            <g>
                {
                    toBracketGames({
                        GameComponent,
                        game,
                        homeOnTop,
                        lineInfo,
                        gameDimensions,
                        roundSeparatorWidth,
                        // svgPadding away from the right
                        x: svgDimensions.width - svgPadding - gameDimensions.width,
                        // vertically centered first game
                        y: (svgDimensions.height / 2) - gameDimensions.height / 2,
                        round: numRounds,
                        ...rest
                    })
                }
            </g>
        </svg>
    );
};


const LineInfoProps = PropTypes.shape({
    yOffset: PropTypes.number,
    separation: PropTypes.number,
    homeVisitorSpread: PropTypes.number
});

Bracket.defaultProps = {
    GameComponent: BracketGame,
    hoveredTeamId: null,
    homeOnTop: true,
    gameDimensions: {
        height: 80,
        width: 200
    },
    svgPadding: 20,
    roundSeparatorWidth: 24,
    lineInfo: {
        yOffset: -6,
        separation: 6,
        homeVisitorSpread: 11
    }
};

Bracket.propTypes = {
    GameComponent: PropTypes.object,
    game: GameProps,
    homeOnTop: PropTypes.bool,
    gameDimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }),
    svgPadding: PropTypes.number,
    roundSeparatorWidth: PropTypes.number,
    lineInfo: LineInfoProps
};

export default Bracket;

