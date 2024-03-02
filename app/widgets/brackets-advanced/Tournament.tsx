/***************************
 Component : Round
 ****************************

 Available Parameters

 */

// import node module libraries
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

// import widget/custom components
import useMarchMadness from '@/hooks/useMarchMadness';
import Round from '@/widgets/brackets-advanced/Round';

// import bracket actions from Redux marchMadnessSlice
import { advanceTeam } from '@/store/marchMadnessBracketSlice'

// import data


const RegionalTournament = () => {

    const { regions, rounds } = useMarchMadness();
    const dispatch = useDispatch()

    const handleAdvanceTeam = (team: any, matchNumber: number, currentRound: number, isFinalRound: boolean) => {
        let payloadData = {team: team, matchNumber: matchNumber, currentRound: currentRound, isFinalRound: isFinalRound};
        dispatch(advanceTeam(payloadData));
    }

    return (
        <div className='full-bracket'>
            <div>
                {regions.length > 1 ? (
                    <h3 className='region-holder text-uppercase region-holder-top'>
                        <span>{regions[0]}</span>
                        <span className="region-right">{regions[1]}</span>
                    </h3>
                ) : (
                    <span></span>
                )}
                <div className='bracket-container full-screen'>
                    {rounds.map((round, i) => (
                        <Round
                            key={i}
                            matches={round.matches}
                            roundOrder={round.order}
                            isFinalRound={round.isFinal}
                            handleAdvanceTeam={(winner, matchNumber) => handleAdvanceTeam(winner, matchNumber, round.order, round.isFinal)}
                        />
                    ))}
                    <ul className='bracket bronze'></ul>
                </div>
                <h4 className='bottom-swipe-note d-sm-block d-lg-none'>Swipe for Other Regions →</h4>
                {regions.length > 3 ? (
                    <h3 className="region-holder text-uppercase region-holder-bottom">
                        <span>{regions[2]}</span>
                        <span className="region-right">{regions[3]}</span>
                    </h3>

                ) : (
                    <span></span>
                )}
            </div>
        </div>
    );
};



export default RegionalTournament;

