// import node module libraries
import React, { Fragment, useState } from 'react';


import { createFootballTournament } from '@/brackets/utils/createFootballTournament';
import { Bracket, BracketGame } from '@/brackets';

import { UCL_2023_TEAMS } from '@/data/champions-league/Teams';
import { UCL_STADIUMS } from '@/data/champions-league/Stadiums';
import { CLUB_FOOTBALL_ROUNDS } from '@/data/champions-league/Rounds';


const Tournament = () => {

    const [hoveredTeamId, setHoveredTeamId] = useState(null);

    const tournament = createFootballTournament(CLUB_FOOTBALL_ROUNDS, UCL_STADIUMS);

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
                game={tournament}
                homeOnTop={true}
                GameComponent={gameComponent}
            />
        </Fragment>
    );

};


export default Tournament;
