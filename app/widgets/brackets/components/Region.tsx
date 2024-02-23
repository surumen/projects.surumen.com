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
import React, { Fragment } from "react";
import Game from "@/widgets/brackets/components/Game";
import Round from "@/widgets/brackets/components/Round";

// import widget/custom components



const Region = (props) => {
    const { name, seeds, rounds, games, type, userData } = props;

    const regionRounds = (rounds || []).map((element, index) => {
        return (
            <Round
                seeds={seeds}
                pairings={element}
                games={games[index]}
                gamesPredicted={userData["games"][index]}
                pairingsPredicted={userData["matchups"][index]}
                final={false}
                roundNumber={index}
                key={index} />
        );
    });


    return (

        <Fragment>
            {name === 'Final' ? (
                <Round
                    seeds={seeds}
                    pairings={rounds[0]}
                    games={games[0]}
                    gamesPredicted={userData["games"][0]}
                    pairingsPredicted={userData["matchups"][0]}
                    final={true}
                    roundNumber={0}
                    key={0} />
            ) : (
                <div className={type === 'right' ? 'region region-right' : 'region'}>
                    <h2 className='region-name'>{name}</h2>
                    {regionRounds}
                </div>
            )}
        </Fragment>
    );
};



Region.propTypes = {
    seeds: PropTypes.object,
    name: PropTypes.string,
    rounds: PropTypes.array,
    games: PropTypes.array,
    userData: PropTypes.object,
    type: PropTypes.string
};

export default Region;

