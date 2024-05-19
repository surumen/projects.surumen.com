// import node module libraries
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import * as _ from 'underscore';

import { Game, Side } from "@/types/Brackets";
import { Image } from "react-bootstrap";


export const BracketGame = (props) => {
    const {
        game,
        x,
        y,
        hoveredTeamId,
        onHoveredTeamIdChange,
        homeOnTop,
        topText,
        bottomText
    } = props;

    const { sides } = game;
    const top = sides[homeOnTop ? Side.HOME : Side.VISITOR];
    const bottom = sides[homeOnTop ? Side.VISITOR : Side.HOME];


    const gameSvgDimensions = {
        width: 160,
        height: 120
    }

    return (
        <foreignObject x={x} y={y} width={gameSvgDimensions.width} height={gameSvgDimensions.height}>
            <div className='gamebox offset'>
                {/* game time */}
                <div className='schedule'>{topText(game)}</div>

                <div className={`match border ${top.team.name !== 'TBC' || bottom.team.name !== 'TBC' ? 'border-primary-hover' : ''} rounded`}>
                    {/* home team or top seed */}
                    <div className={`competitor ${top.team.name !== 'TBC' ? 'competitor-hover' : ''}`}>
                        <div className='competitor-container w-100 h-100'>

                            <div className='d-flex'>
                                {top.team.name !== 'TBC' ? (<div className='flag'><Image src={top.team.logo} alt='' className='avatar avatar-xs me-1'/></div>) : (<span></span>)}
                                {top.team.name !== 'TBC' ? (<span className='seed'>{top.seed.rank}</span>) : (<span></span>)}
                                <span className={`team-name text-truncate ${top.team.name === 'TBC' ? 'ms-3' : ''}`}>{top.team ? top.team.name : (top.seed ? top.seed.displayName : null)}</span>
                            </div>
                        </div>
                        <div className='result'>
                            {top.team.name !== 'TBC' ? (<span className='badge bg-success bg-opacity-25 text-success'>{top.score ? top.score.score : null}%</span>) : (<span></span>)}
                        </div>
                    </div>

                    {/* visiting team or bottom seed */}
                    <div className={`competitor ${bottom.team.name !== 'TBC' ? 'competitor-hover' : ''}`}>
                        <div className='competitor-container w-100 h-100'>
                            <div className='d-flex'>
                                {bottom.team.name !== 'TBC' ? (<div className='flag'><Image src={bottom.team.logo} alt='' className='avatar avatar-xs me-1'/></div>) : (<span></span>)}
                                {bottom.team.name !== 'TBC' ? (<span className='seed'>{bottom.seed.rank}</span>) : (<span></span>)}
                                <span className={`team-name text-truncate ${bottom.team.name === 'TBC' ? 'ms-3' : ''}`}>{bottom.team ? bottom.team.name : (bottom.seed ? bottom.seed.displayName : null)}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </foreignObject>
    );
};

export const gameProps = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    bracketLabel: PropTypes.string,
    scheduled: PropTypes.number,
    court: PropTypes.shape({
        name: PropTypes.string,
        venue: PropTypes.shape({
            name: PropTypes.string
        })
    }),
    sides: PropTypes.shape({
        home: PropTypes.object,
        visitor: PropTypes.object
    }),
});


// Typechecking With PropTypes
BracketGame.propTypes = {
    game: gameProps,
    x: PropTypes.number,
    y: PropTypes.number,
    homeOnTop: PropTypes.bool,
    hoveredTeamId: PropTypes.string,
    topText: PropTypes.func,
    bottomText: PropTypes.func,
    onHoveredTeamIdChange: PropTypes.func,

}

// Specifies the default values for props
BracketGame.defaultProps = {
    topText: ({ scheduled }: Game) => new Date(scheduled).toLocaleDateString(),
    bottomText: ({ name, bracketLabel }: Game) => _.compact([ name, bracketLabel ]).join(' - ')
};

export default BracketGame;
