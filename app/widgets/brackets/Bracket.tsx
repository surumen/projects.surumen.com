// import node module libraries
import PropTypes from "prop-types";
import { BracketGame, gameProps } from "@/widgets/brackets/BracketGame";
import { useMediaQuery } from "react-responsive";
import { Fragment, useMemo } from "react";
import toBracketGames, { lineInfoProps } from "@/widgets/brackets/toBracketGames";



const finalFourBracket = (props) => {
    let { game, bracketDimensions, gameDimensions, roundSeparatorWidth, lineInfo, onAdvanceTeam, isMobile } = props;

    const finalFourGame1 = game.sides.home.sourceGame;
    const finalFourGame2 = game.sides.visitor.sourceGame;

    const y = (bracketDimensions.height / 2) - gameDimensions.height / 2;
    const y2 = (bracketDimensions.height / 2) - gameDimensions.height;
    const x1 = (bracketDimensions.width / 2) - (gameDimensions.width * 1.5) - roundSeparatorWidth;
    const x2 = ((bracketDimensions.width) / 2) - (gameDimensions.width);
    const x3 = (bracketDimensions.width / 2) + (gameDimensions.width * 0.5) + roundSeparatorWidth;


    const p1startPointX = x1 + gameDimensions.width;
    const p1endPointX = x2;

    const p2startPointX = x2 + (gameDimensions.width * 2);
    const p2endPointX = x3;

    const startPointY = bracketDimensions.height / 2 + lineInfo.yOffset;



    return (
        <g>
            <BracketGame
                {...gameDimensions}
                game={finalFourGame1}
                key={`${finalFourGame1.id}-${y}`}
                x={x1}
                y={y}
                onAdvanceTeam={onAdvanceTeam}
                isFinalFour={true}
            />
            <path
                d={`M ${p1startPointX} ${startPointY} L ${p1endPointX} ${startPointY}`}
                fill='transparent' stroke='var(--x-info)' opacity={.25}
            />
            <BracketGame
                {...gameDimensions}
                game={game}
                key={`${game.id}-${y}`}
                x={x2}
                y={y}
                onAdvanceTeam={onAdvanceTeam}
                isFinal={true}
            />
            <path
                d={`M ${p2startPointX} ${startPointY} L ${p2endPointX} ${startPointY}`}
                fill='transparent' stroke='var(--x-info)' opacity={.25}
            />
            <BracketGame
                {...gameDimensions}
                game={finalFourGame2}
                key={`${finalFourGame2.id}-${y}`}
                x={x3}
                y={y}
                onAdvanceTeam={onAdvanceTeam}
                isFinalFour={true}
            />
        </g>
    )

}

finalFourBracket.propTypes = {
    game: gameProps,
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
    onAdvanceTeam: PropTypes.func,
    isMobile: PropTypes.bool
}



const Bracket = (props) => {
    let { game, numRounds, alignment, isFinal, homeOnTop, defaultGameDimensions, bracketDimensions, svgPadding, roundSeparatorWidth, lineInfo, onAdvanceTeam } = props;
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const roundsLabelsOffset = 20;

    const gameDimensions= useMemo(() => {
        return {
            height: defaultGameDimensions.height,
            width: (bracketDimensions?.width / numRounds) - roundSeparatorWidth
        }
    }, [bracketDimensions, defaultGameDimensions, numRounds, roundSeparatorWidth]);

    const svgDimensions =  {
        height: isFinal && !isMobile ? 120 : (gameDimensions.height * Math.pow(2, numRounds - 1)) + roundsLabelsOffset,
        width: bracketDimensions?.width || !isMobile ? bracketDimensions.width : ((numRounds * (gameDimensions.width + roundSeparatorWidth)) + svgPadding * 2)
    };


    return (
        <svg {...svgDimensions} fill='var(--x-body-color)' className={isFinal ? 'overflow-visible' : ''}>
            <g>
                { isFinal ? (
                    finalFourBracket({
                        game,
                        bracketDimensions: svgDimensions,
                        gameDimensions: {width: 160, height: gameDimensions.height},
                        roundSeparatorWidth: 160,
                        lineInfo,
                        onAdvanceTeam,
                        isMobile
                    })
                ) : (
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
                        onAdvanceTeam,
                        isMobile
                    })
                    )
                }
            </g>
        </svg>
    )
};



// Typechecking With PropTypes
Bracket.propTypes = {
    game: gameProps,
    numRounds: PropTypes.number,
    isFinal: PropTypes.bool,
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
    onAdvanceTeam: PropTypes.func
}

// Specifies the default values for props
Bracket.defaultProps = {
    isFinal: false,
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
