// import node module libraries
import PropTypes from "prop-types";
import * as _ from 'underscore';
import { BracketGame, gameProps } from "@/widgets/brackets/BracketGame";
import { Side } from "@/types/Brackets";



const toBracketGames = (props) => {
    let { game, x, y, alignment, gameDimensions, roundSeparatorWidth, round, lineInfo, homeOnTop, onAdvanceTeam, isMobile } = props;
    const { width: gameWidth, height: gameHeight } = gameDimensions;
    const ySep = gameHeight * Math.pow(2, round - 2);

    if (!game) return null;

    return [
        <g key={`${game.id}-${y}`}>
            <BracketGame
                {...gameDimensions}
                key={game.id} homeOnTop={homeOnTop} game={game} x={x} y={y} onAdvanceTeam={onAdvanceTeam} />
        </g>
    ].concat(
        _.chain(game.sides)
            .map((sideInfo, side: Side) => ({ ...sideInfo, side }))
            // filter to the teams that come from winning other games
            .filter(({ sourceGame }) => sourceGame !== null)
            .map(
                ({ sourceGame, side }) => {
                    // we put visitor teams on the bottom
                    const isTop = side === Side.HOME ? homeOnTop : !homeOnTop;
                    const multiplier = isTop ? -1 : 1;

                    // Left bracket: start line from left (start) of match box
                    // Right bracket: start line from right (end) of match box
                    const startPointX = alignment === 'left' ? x :  (x + gameWidth - lineInfo.separation);
                    const endPointX = alignment === 'left' ? (x - roundSeparatorWidth) : (x + gameWidth);


                    const startPointY = y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread;
                    const endPointY = y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier);

                    const connectorX = alignment === 'left' ?
                        (x - (roundSeparatorWidth * 2) - lineInfo.separation)
                        : (x + gameWidth + roundSeparatorWidth + lineInfo.separation)
                    ;


                    const pathInfo = [
                        `M${startPointX} ${startPointY}`,
                        `H${endPointX}`,
                        `V${endPointY}`,
                        `H${connectorX}`
                    ];


                    return [
                        sourceGame ? (
                            <path key={`${game.id}-${side}-${y}-path`} d={pathInfo.join(' ')} fill="transparent" stroke="var(--x-info)" opacity={.25}/>
                        ) : (<g></g>)
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
                                    onAdvanceTeam,
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


export const lineInfoProps = PropTypes.shape({
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
    isMobile: PropTypes.bool,
    onAdvanceTeam: PropTypes.func,
}

toBracketGames.defaultProps = {
    x: 0,
}

export default toBracketGames;