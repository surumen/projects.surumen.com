/***************************
 Component : Round
 ****************************

 Available Parameters

 */

// import node module libraries
import PropTypes from 'prop-types';
import React from 'react';

// import widget/custom components
import Round from '@/widgets/brackets-advanced/Round';

// import data
import { MARCH_MADNESS_2024 } from '@/data/MarchMadness2024';

const RegionalTournament = () => {

    console.log(MARCH_MADNESS_2024)
    const regionsOrdered = MARCH_MADNESS_2024.regions;
    const rounds = MARCH_MADNESS_2024.rounds;

    return (
        <div className='full-bracket'>
            <div>
                {regionsOrdered.length > 1 ? (
                    <h3 className='region-holder text-uppercase region-holder-top'>
                        <span>{regionsOrdered[0]}</span>
                        <span className="region-right">{regionsOrdered[1]}</span>
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
                        />
                    ))}
                    <ul className='bracket bronze'></ul>
                </div>
                <h4 className='bottom-swipe-note d-sm-block d-lg-none'>Swipe for Other Regions →</h4>
                {regionsOrdered.length > 3 ? (
                    <h3 className="region-holder text-uppercase region-holder-bottom">
                        <span>{regionsOrdered[2]}</span>
                        <span className="region-right">{regionsOrdered[3]}</span>
                    </h3>

                ) : (
                    <span></span>
                )}
            </div>
        </div>
    );
};



export default RegionalTournament;

