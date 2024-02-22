// import node module libraries
import React, { Fragment, useState } from "react";

import { constructTournamentTree, DFS } from "@/brackets/utils/createFootballTournament";
import { Bracket, BracketGame } from '@/brackets';
import { Game } from '@/types';
import { TOURNAMENT_ROUNDS_MAP } from '@/data/champions-league/Rounds';
import { UCL_2023_TEAMS } from "@/data/champions-league/Teams";

const game = constructTournamentTree(TOURNAMENT_ROUNDS_MAP, UCL_2023_TEAMS) as Game;

const Tournament = () => {

    const [hoveredTeamId, setHoveredTeamId] = useState(null);
    const [tournament, setTournament] = useState(game);


    const onHoveredTeamChange = (hoveredTeamId) => {
        setHoveredTeamId(hoveredTeamId);
    };

    const handleClick = (teamId: string, gameId: string) => {
        const currentTeam = UCL_2023_TEAMS.filter(team => team.id === teamId)[0];
        const tree = DFS(tournament, gameId, currentTeam);
        setTournament(tree);
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
