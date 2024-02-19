/***************************
 Component : BracketGame
 ****************************

 Available Parameters

 game                      : Add docs
 hoveredTeamId             : Add docs
 onHoveredTeamIdChange     : Add docs
 styles                    : Add docs
 homeOnTop                 : Add docs
 topText                   : Add docs
 bottomText                : Add docs

 */

// import node module libraries
import React from 'react';
import PropTypes from 'prop-types';
import * as controllable from 'react-controllables';
import * as _ from 'underscore';

// import widget/custom components
import Participant from './Participant';


const BracketGame = (props) => {

    //------initialize props----------
    const {
        game,
        hoveredTeamId,
        onHoveredTeamIdChange,
        styles,
        homeOnTop,
        topText,
        bottomText,
        ...rest
    } = props;

    const {
        backgroundColor,
        hoverBackgroundColor,
        scoreBackground,
        winningScoreBackground,
        teamNameStyle,
        teamScoreStyle,
        gameNameStyle,
        gameTimeStyle,
        teamSeparatorStyle
    } = styles;

    const { sides } = game;
    const top = sides[ homeOnTop ? 'home' : 'visitor' ];
    const bottom = sides[ homeOnTop ? 'visitor' : 'home' ];

    //------display ----------

    const winnerBackground = (top && bottom && top.score && bottom.score && top.score.score !== bottom.score.score) ?
        (
            top.score.score > bottom.score.score ?
                <rect x="170" y="12" width="30" height="22.5" style={{ fill: winningScoreBackground }} rx="3" ry="3"/> :
                <rect x="170" y="34.5" width="30" height="22.5" style={{ fill: winningScoreBackground }} rx="3" ry="3"/>
        ) :
        null;

    const topHovered = (top && top.team && top.team.id === hoveredTeamId),
        bottomHovered = (bottom && bottom.team && bottom.team.id === hoveredTeamId);


    return (
        <svg width="200" height="82" viewBox="0 0 200 82" {...rest}>
            {/* game time */}
            <text x="100" y="8" textAnchor="middle" style={gameTimeStyle}>
                {topText(game)}
            </text>

            {/* backgrounds */}

            {/* base background */}
            <rect x="0" y="12" width="200" height="45" fill={backgroundColor} rx="3" ry="3"/>

            {/* background for the top team */}
            <rect x="0" y="12" width="200" height="22.5" fill={topHovered ? hoverBackgroundColor : backgroundColor} rx="3"
                  ry="3"/>
            {/* background for the bottom team */}
            <rect x="0" y="34.5" width="200" height="22.5" fill={bottomHovered ? hoverBackgroundColor : backgroundColor}
                  rx="3" ry="3"/>

            {/* scores background */}
            <rect x="170" y="12" width="30" height="45" fill={scoreBackground} rx="3" ry="3"/>

            {/* winner background */}
            {winnerBackground}

            {/* the players */}
            {
                top ? (
                    <Participant
                        x={0} y={12}
                        side={top}
                        teamNameStyle={teamNameStyle}
                        teamScoreStyle={teamScoreStyle}
                        onHover={onHoveredTeamIdChange}
                    />
                ) : null
            }

            {
                bottom ? (
                    <Participant
                        x={0} y={34.5}
                        side={bottom}
                        teamNameStyle={teamNameStyle}
                        teamScoreStyle={teamScoreStyle}
                        onHover={onHoveredTeamIdChange}
                    />
                ) : null
            }

            <line x1="0" y1="34.5" x2="200" y2="34.5" style={teamSeparatorStyle}/>

            {/* game name */}
            <text x="100" y="68" textAnchor="middle" style={gameNameStyle}>
                {bottomText(game)}
            </text>
        </svg>
    );
};


// Specifies the default values for props
BracketGame.defaultProps = {
    homeOnTop: true,
    hoveredTeamId: null,

    styles: {
        backgroundColor: '#58595e',
        hoverBackgroundColor: '#222',

        scoreBackground: '#787a80',
        winningScoreBackground: '#ff7324',
        teamNameStyle: { fill: '#fff', fontSize: 12, textShadow: '1px 1px 1px #222' },
        teamScoreStyle: { fill: '#23252d', fontSize: 12 },
        gameNameStyle: { fill: '#999', fontSize: 10 },
        gameTimeStyle: { fill: '#999', fontSize: 10 },
        teamSeparatorStyle: { stroke: '#444549', strokeWidth: 1 }
    },

    topText: ({ scheduled }) => new Date(scheduled).toLocaleDateString(),
    bottomText: ({ name, bracketLabel }) => _.compact([ name, bracketLabel ]).join(' - ')
};

// Typechecking With PropTypes

const CourtProps = PropTypes.shape({
    name: PropTypes.string,
    venue: PropTypes.shape({
        name: PropTypes.string
    })
});

export const SideProps = PropTypes.shape({
    score: PropTypes.shape({
        score: PropTypes.number
    }),
    seed: PropTypes.shape({
        displayName: PropTypes.string,
        rank: PropTypes.number,
        sourceGame: PropTypes.object, // GameProps
        sourcePool: PropTypes.object
    }),
    team: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
    })
});

export const GameProps = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,

    // optional: the label for the game within the bracket, e.g. Gold Finals, Silver Semi-Finals
    bracketLabel: PropTypes.string,

    // the unix timestamp of the game-will be transformed to a human-readable time using momentjs
    scheduled: PropTypes.number,

    court: CourtProps,
    sides: PropTypes.shape({
        home: SideProps,
        visitor: SideProps
    })
});


BracketGame.propTypes = {
    game: GameProps,
    homeOnTop: PropTypes.bool,

    onHoveredTeamIdChange: PropTypes.func,

    styles: PropTypes.shape({
        backgroundColor: PropTypes.string,
        hoverBackgroundColor: PropTypes.string,
        scoreBackground: PropTypes.string,
        winningScoreBackground: PropTypes.string,
        teamNameStyle: PropTypes.object,
        teamScoreStyle: PropTypes.object,
        gameNameStyle: PropTypes.object,
        gameTimeStyle: PropTypes.object,
        teamSeparatorStyle: PropTypes.object,
    }),
    topText: PropTypes.func,
    bottomText: PropTypes.func
};

export default controllable(BracketGame, [ 'hoveredTeamId' ]);
