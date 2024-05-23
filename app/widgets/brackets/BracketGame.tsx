// import node module libraries
import React from "react";
import PropTypes from "prop-types";
import * as _ from 'underscore';

import { Game, Side } from "@/types/Brackets";
import { Image } from "react-bootstrap";


export const BracketGame = (props) => {
    const {
        game,
        x,
        y,
        isFinal,
        homeOnTop,
        topText,
        bottomText,
        onAdvanceTeam,
        hoveredTeamId,
        onHoveredTeamIdChange
    } = props;

    const { sides } = game;
    const top = sides[homeOnTop ? Side.HOME : Side.VISITOR];
    const bottom = sides[homeOnTop ? Side.VISITOR : Side.HOME];


    const gameSvgDimensions = {
        width: isFinal ? 320: 160,
        height: isFinal ? 240: 120
    }

    return (
        <foreignObject x={x} y={y} width={gameSvgDimensions.width} height={gameSvgDimensions.height}>
            <div className='gamebox offset'>
                {/* game time */}
                <div className='schedule'>{bottomText(game)}</div>

                <div className={`match border ${top.name !== 'TBC' || bottom.name !== 'TBC' ? 'border-primary-hover' : ''} rounded`}>
                    {/* home team or top seed */}
                    <div className={`competitor ${top.name !== 'TBC' ? 'competitor-hover' : ''} ${top.score?.isWinner ? 'bg-light fw-bold' : ''}`}
                         onClick={() => onAdvanceTeam(top, bottom, game)}>
                        <div className={`competitor-container w-100 h-100 ${top.name === 'TBC' ? 'bg-body-tertiary' : ''}`}>

                            <div className='d-flex'>
                                {top.name !== 'TBC' ? (<div className='flag'><Image src={top.logo} alt='' className='avatar avatar-xs me-1'/></div>) : (<span></span>)}
                                {top.name !== 'TBC' ? (<span className='seed'>{top.seed}</span>) : (<span></span>)}
                                <span className={`team-name text-truncate ${top.name === 'TBC' ? 'ms-3 invisible' : 'me-1'}`}>{top.name}</span>
                            </div>
                        </div>
                        <div className='result'>
                            {top.name !== 'TBC' ? (<span className='badge bg-success bg-opacity-25 text-success'>{top.score ? top.score.score : null}%</span>) : (<span></span>)}
                        </div>
                    </div>

                    {/* visiting team or bottom seed */}
                    <div className={`competitor ${bottom.name !== 'TBC' ? 'competitor-hover' : ''} ${bottom.score?.isWinner ? 'bg-light fw-bold' : ''}`}
                         onClick={() => onAdvanceTeam(bottom, top, game)}>
                        <div className={`competitor-container w-100 h-100 ${bottom.name === 'TBC' ? 'bg-body-tertiary' : ''}`}>
                            <div className='d-flex'>
                                {bottom.name !== 'TBC' ? (<div className='flag'><Image src={bottom.logo} alt='' className='avatar avatar-xs me-1'/></div>) : (<span></span>)}
                                {bottom.name !== 'TBC' ? (<span className='seed'>{bottom.seed}</span>) : (<span></span>)}
                                <span className={`team-name text-truncate ${bottom.name === 'TBC' ? 'ms-3 invisible' : 'me-1'}`}>{bottom.name}</span>
                            </div>
                        </div>
                        <div className='result'></div>
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
    isFinal: PropTypes.bool,
    homeOnTop: PropTypes.bool,
    topText: PropTypes.func,
    bottomText: PropTypes.func,
    hoveredTeamId: PropTypes.string,
    onAdvanceTeam: PropTypes.func,
    onHoveredTeamIdChange: PropTypes.func,

}

// Specifies the default values for props
BracketGame.defaultProps = {
    isFinal: false,
    homeOnTop: true,
    topText: ({ scheduled }: Game) => new Date(scheduled).toLocaleDateString(),
    bottomText: ({ name, bracketLabel }: Game) => name ? name : bracketLabel
};

export default BracketGame;
