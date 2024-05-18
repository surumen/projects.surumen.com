// import node module libraries
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import * as _ from 'underscore';

import { Game, Side } from "@/types/Brackets";
import { RectClipped } from "@/widgets/brackets/Clipped";
import { Image } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";


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

                <div className='match border border-primary-hover rounded'>
                    {/* home team or top seed */}
                    <div className='competitor bg-light-hover'>
                        <div className='competitor-container w-100 h-100'>

                            <div className='d-flex'>
                                <div className='flag'>
                                    <Image src={'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21161.svg'} alt='' className='avatar avatar-xs me-1'/>
                                </div>
                                <span className='seed'>{Math.floor(Math.random() * (16 - 1 + 1) + 1)}</span>
                                <span className='team-name text-truncate'>{top.team ? top.team.name : (top.seed ? top.seed.displayName : null)}</span>
                            </div>
                        </div>
                        <div className='result'>
                            <span className='badge bg-success bg-opacity-25 text-success'>{top.score ? top.score.score : null}%</span>
                        </div>
                    </div>

                    {/* visiting team or bottom seed */}
                    <div className='competitor bg-light-hover'>
                        <div className='competitor-container w-100 h-100'>

                            <div className='d-flex'>
                                <div className='flag'>
                                    <Image src={'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21161.svg'} alt='' className='avatar avatar-xs me-1'/>
                                </div>
                                <span className='seed'>{Math.floor(Math.random() * (16 - 1 + 1) + 1)}</span>
                                <span className='team-name text-truncate'>{bottom.team ? bottom.team.name : (bottom.seed ? bottom.seed.displayName : null)}</span>
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
