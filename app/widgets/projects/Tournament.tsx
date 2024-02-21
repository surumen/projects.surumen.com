// import node module libraries
import React, { Fragment, useState } from 'react';

import { constructTournamentTree } from '@/brackets/utils/createFootballTournament';
import { Bracket, BracketGame } from '@/brackets';
import { Game } from '@/types';


const Tournament = () => {

    const [hoveredTeamId, setHoveredTeamId] = useState(null);
    const tree = constructTournamentTree() as Game;

    const onHoveredTeamChange = (hoveredTeamId) => {
        setHoveredTeamId(hoveredTeamId);
    };

    const handleClick = (teamId, gameId) => {

    };

    const gameComponent = (props) => {
        return (
            <BracketGame
                {...props}
                onHoveredTeamIdChange={onHoveredTeamChange}
                onClickTeam={handleClick}
                hoveredTeamId={hoveredTeamId}
            />
        );
    }

    return (
        <Fragment>
            <Bracket
                game={tree}
                homeOnTop={true}
                GameComponent={gameComponent}
            />
        </Fragment>
    );

};


export default Tournament;
