/***************************
 Component : Round
 ****************************

 Available Parameters

 */

// import node module libraries
import PropTypes from 'prop-types';
import React from 'react';

// import widget/custom components
import Match from '@/widgets/brackets-advanced/Match';


const Round = (props) => {
    let { matches, roundOrder, isFinalRound, bracketPosition, handleAdvanceTeam } = props;

    return (
        <ul className={`bracket bracket-${roundOrder} ${isFinalRound ? 'justify-content-center' : ''}`}>
            {matches.map((match, i) => (
                <Match
                    key={i}
                    scheduled={match.scheduled}
                    isFinal={match.isFinal}
                    topSeed={match.topSeed}
                    bottomSeed={match.bottomSeed}
                    bracketPosition={bracketPosition}
                    matchNumber={i+1}
                    handleClickOnMatchFromParent={(winner) => handleAdvanceTeam(winner, i + 1)}
                />
            ))}
        </ul>
    );
};



Round.propTypes = {
    matches: PropTypes.arrayOf(
        PropTypes.shape({
            scheduled: PropTypes.string,
            isFinal: PropTypes.bool,
            topSeed: PropTypes.shape({
                name: PropTypes.string,
                logo: PropTypes.string,
                seed: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                ]),
                isWinner: PropTypes.bool,
                score: PropTypes.string
            }),
            bottomSeed: PropTypes.shape({
                name: PropTypes.string,
                logo: PropTypes.string,
                seed: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                ]),
                isWinner: PropTypes.bool,
                score: PropTypes.string
            }),
        })
    ),
    roundOrder: PropTypes.number,
    isFinalRound: PropTypes.bool,
    bracketPosition: PropTypes.string,
    handleAdvanceTeam: PropTypes.func
};

export default Round;

