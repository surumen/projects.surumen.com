/***************************
 Component : Participant
 ****************************

 Available Parameters

 x              : Add docs
 y              : Add docs
 side           : Add docs
 onHover        : Add docs
 teamNameStyle  : Add docs
 teamScoreStyle : Add docs

 */

// import node module libraries
import PropTypes from 'prop-types';
import React from "react";
import Game from "@/widgets/brackets/components/Game";

// import widget/custom components


const convertToTuples = (pairings: any[]) => {
    const response: any[] = [];
    for (let i = 0; i < pairings.length; i += 2) {
        response.push([pairings[i], pairings[i+1]]);
    }
    return response;
}


const Round = (props) => {
    let { pairings, seeds, gamesPredicted, pairingsPredicted, games, final, roundNumber } = props;

    const roundGames = convertToTuples(pairings).map((element, index) => {
        return (
            <Game
                seeds={seeds}
                firstSeed={element[0]}
                secondSeed={element[1]}
                gamesPredicted={gamesPredicted[index]}
                firstSeedPredicted={element[0]}
                secondSeedPredicted={element[1]}
                games={games[index]}
                final={final}
                key={index} />
        );
    });


    return (
        <section className={'round ' + (final ? 'final' : '') + ' round-' + roundNumber}>
            {roundGames}
        </section>
    );
};



Round.propTypes = {
    pairings: PropTypes.array,
    seeds: PropTypes.object,
    gamesPredicted: PropTypes.array,
    pairingsPredicted: PropTypes.array,
    games: PropTypes.array,
    roundNumber: PropTypes.number,
    final: PropTypes.bool
};

export default Round;

