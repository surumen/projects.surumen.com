// import node module libraries
import PropTypes from "prop-types";
import * as _ from 'underscore';
import { BracketGame, gameProps } from "@/widgets/brackets/BracketGame";
import { winningPathLength } from "@/utils/winningPathLength";
import { Side } from "@/types/Brackets";
import { useMediaQuery } from "react-responsive";
import { useMemo } from "react";


const toBracketGames = (props) => {
    let { game, x, y, alignment, gameDimensions, roundSeparatorWidth, round, lineInfo, homeOnTop, isMobile } = props;
    const { width: gameWidth, height: gameHeight } = gameDimensions;
    const ySep = gameHeight * Math.pow(2, round - 2);

    if (!game) return null;

    return [
        <g key={`${game.id}-${y}`}>
            <BracketGame
                {...gameDimensions}
                key={game.id} homeOnTop={homeOnTop} game={game} x={x} y={y}/>
        </g>
    ].concat(
        _.chain(game.sides)
            .map((sideInfo, side: Side) => ({ ...sideInfo, side }))
            // filter to the teams that come from winning other games
            .filter(({ seed }) => seed && seed.sourceGame !== null && seed.rank === 1)
            .map(
                ({ seed: { sourceGame }, side }) => {
                    // we put visitor teams on the bottom
                    const isTop = side === Side.HOME ? homeOnTop : !homeOnTop;
                    const multiplier = isTop ? -1 : 1;

                    const pathInfoLeft = [
                        `M${x - lineInfo.separation} ${y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
                        `H${x - (roundSeparatorWidth)}`,
                        `V${y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
                        `H${x - (roundSeparatorWidth * 2) - lineInfo.separation}`
                    ];

                    const pathInfoRight = [
                        // To the right of match container
                        `M${x + gameWidth - roundSeparatorWidth} ${y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
                        `H${x + gameWidth}`,
                        `V${y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
                        `H${x + gameWidth + roundSeparatorWidth - lineInfo.separation}`
                    ];

                    const pathInfo = alignment === 'left' ? pathInfoLeft : pathInfoRight;

                    return [
                        <path key={`${game.id}-${side}-${y}-path`} d={pathInfo.join(' ')} fill="transparent" stroke="var(--x-info)" opacity={.25}/>
                    ]
                        .concat(
                            toBracketGames(
                                {
                                    game: sourceGame,
                                    alignment,
                                    homeOnTop,
                                    lineInfo,
                                    gameDimensions,
                                    roundSeparatorWidth,
                                    x: alignment === 'left' ? Math.abs(x - gameWidth - roundSeparatorWidth) :
                                        Math.abs(x + roundSeparatorWidth + gameWidth),
                                    y: y + ((ySep / 2) * multiplier),
                                    round: round - 1,
                                    isMobile
                                }
                            )
                        );
                }
            )
            .flatten(true)
            .value()
    );
}


const lineInfoProps = PropTypes.shape({
    yOffset: PropTypes.number,
    xOffset: PropTypes.number,
    separation: PropTypes.number,
    homeVisitorSpread: PropTypes.number
});

toBracketGames.propTypes = {
    game: gameProps,
    x: PropTypes.number,
    y: PropTypes.number,
    gameDimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number
    }),
    roundSeparatorWidth: PropTypes.number,
    round: PropTypes.number,
    homeOnTop: PropTypes.bool,
    lineInfo: lineInfoProps,
    alignment: PropTypes.oneOf(['left', 'right']),
    isMobile: PropTypes.bool
}

toBracketGames.defaultProps = {
    x: 0,
}


const Bracket = (props) => {
    let { game, numRounds, alignment, homeOnTop, defaultGameDimensions, bracketDimensions, svgPadding, roundSeparatorWidth, lineInfo } = props;
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const roundsLabelsOffset = 20;

    const gameDimensions= useMemo(() => {
        return {
            height: defaultGameDimensions.height,
            width: (bracketDimensions?.width / numRounds) - roundSeparatorWidth
        }
    }, [bracketDimensions, defaultGameDimensions, numRounds, roundSeparatorWidth]);

    const svgDimensions =  {
        height: (gameDimensions.height * Math.pow(2, numRounds - 1)) + roundsLabelsOffset,
        width: bracketDimensions?.width || !isMobile ? bracketDimensions.width : ((numRounds * (gameDimensions.width + roundSeparatorWidth)) + svgPadding * 2)
    };


    return (
        <svg {...svgDimensions} fill='var(--x-body-color)'>
            <g>
                {
                    toBracketGames({
                        game,
                        alignment,
                        gameDimensions,
                        roundSeparatorWidth,
                        round: numRounds,
                        homeOnTop,
                        lineInfo,
                        // svgPadding away from the right
                        x: alignment === 'left' ? svgDimensions.width  - roundSeparatorWidth - gameDimensions.width : 0,
                        // vertically centered first game
                        y: (svgDimensions.height / 2) - gameDimensions.height / 2,
                        isMobile
                    })
                }
            </g>
        </svg>
    )
};



// Typechecking With PropTypes
Bracket.propTypes = {
    game: gameProps,
    numRounds: PropTypes.number,
    homeOnTop: PropTypes.bool,
    displayRounds: PropTypes.bool,
    defaultGameDimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number
    }),
    bracketDimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number
    }),
    svgPadding: PropTypes.number,
    roundSeparatorWidth: PropTypes.number,
    lineInfo: lineInfoProps,
    alignment: PropTypes.oneOf(['left', 'right']),
}

// Specifies the default values for props
Bracket.defaultProps = {
    homeOnTop: true,
    defaultGameDimensions: {
        height: 120,
        width: 160
    },
    svgPadding: 200,
    roundSeparatorWidth: 24,

    lineInfo: {
        yOffset: -6,
        xOffset: 6,
        separation: 6,
        homeVisitorSpread: 0
    }
};

export default Bracket;
