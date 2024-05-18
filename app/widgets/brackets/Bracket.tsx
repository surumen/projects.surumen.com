// import node module libraries
import PropTypes from "prop-types";
import * as _ from 'underscore';
import { BracketGame, gameProps } from "@/widgets/brackets/BracketGame";
import { winningPathLength } from "@/utils/winningPathLength";
import { Side } from "@/types/Brackets";
import { useMediaQuery } from "react-responsive";


const toBracketGames = (props) => {
    const { game, x, y, alignment, gameDimensions, roundSeparatorWidth, round, lineInfo, homeOnTop, isMobile } = props;
    const { width: gameWidth, height: gameHeight } = gameDimensions;
    const ySep = gameHeight * Math.pow(2, round - 2);

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

                    const pathInfo = [
                        `M${alignment === 'left' ? x - lineInfo.separation : x + gameWidth + roundSeparatorWidth - lineInfo.xOffset - lineInfo.separation} ${y + (gameHeight) / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
                        `H${alignment === 'left' ? x - lineInfo.xOffset : x + gameWidth + roundSeparatorWidth - lineInfo.xOffset / 2}`,
                        `V${y + (gameHeight) / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
                        `H${alignment === 'left' ? x - roundSeparatorWidth + lineInfo.separation : x + (gameWidth * 2) + roundSeparatorWidth + lineInfo.separation}`
                    ];

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
                                    x: alignment === 'left' ? x - gameWidth - roundSeparatorWidth :
                                        x + roundSeparatorWidth + gameWidth,
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


const Bracket = (props) => {
    let { game, alignment, homeOnTop, displayRounds, gameDimensions, bracketDimensions, svgPadding, roundSeparatorWidth, lineInfo } = props;
    const numRounds = winningPathLength(game);
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const roundsLabelsOffset = 60;

    const svgDimensions =  {
        height: (gameDimensions.height * Math.pow(2, numRounds - 1)) + roundsLabelsOffset,
        width: bracketDimensions?.width || !isMobile ? bracketDimensions.width : (numRounds * (gameDimensions.width + roundSeparatorWidth)) + svgPadding * 2
    };

    gameDimensions.width = (bracketDimensions?.width / numRounds) - roundSeparatorWidth;

    return (
        <svg {...svgDimensions} fill='var(--x-body-color)'>
            { displayRounds ? (
                <foreignObject x={0} y={0} width={svgDimensions.width} height={roundsLabelsOffset}>
                    <ul className={`nav nav-segment border bg-body p-0 nav-fill ${alignment === 'left' ? 'rounded-top-start rounded-bottom-start border-end-0' : 'rounded-top-end rounded-bottom-end'}`}>
                        {[...Array(numRounds + 1)].map((round, i) => (
                            <li key={i} className={`nav-link border-radius-0 justify-content-center align-items-center px-3 py-1 text-center ${alignment === 'left' ? '' : `order-${numRounds - i}`}`}>
                                <div className='surtitle fw-semibold text-info'>Round {i + 1}</div>
                                <div className='text-xxs fw-light text-opacity-75 text-muted'>March 16-20</div>
                            </li>
                        ))}
                    </ul>
                </foreignObject>
            ) : (<g></g>)}
            <g transform={`translate(0, ${roundsLabelsOffset / 2})`}>
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
    homeOnTop: PropTypes.bool,
    displayRounds: PropTypes.bool,
    gameDimensions: PropTypes.shape({
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
    displayRounds: false,
    gameDimensions: {
        height: 120,
        width: 160
    },
    svgPadding: 200,
    roundSeparatorWidth: 24,

    lineInfo: {
        yOffset: -6,
        xOffset: 6,
        separation: 0,
        homeVisitorSpread: 0
    }
};

export default Bracket;
