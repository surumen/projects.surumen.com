/***************************
 Component : Match
 ****************************

 Available Parameters

 */

// import node module libraries
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import React from 'react';

// import widget/custom components


const Match = (props) => {
    let { scheduled, isFinal, topSeed, bottomSeed } = props;

    return (
        <li className='match-container'>
            <div className={`gamebox ${isFinal ? 'final' : ''} offset`}>
                <div className='schedule'>{scheduled}</div>
                <div className='match'>
                    <div className='competitor'>
                        <div className='competitor-container w-100 h-100'>
                            <div className='d-flex'>
                                {topSeed.logo ? (
                                    <div className='flag'>
                                        <Image src={topSeed.logo} alt={topSeed.name}/>
                                    </div>
                                ) : (
                                    <span></span>
                                )}
                                <span className='seed'>{topSeed.seed}</span>
                                <span className={`school ${topSeed.isWinner ? 'winner' : ''}`}>{topSeed.name}</span>
                            </div>
                        </div>
                        <div className={`result ${topSeed.isWinner ? 'strong' : ''}`}>{topSeed.score}</div>
                    </div>
                    <div className='competitor'>
                        <div className='competitor-container w-100 h-100'>
                            <div className='d-flex'>
                                {bottomSeed.logo ? (
                                    <div className='flag'>
                                        <Image src={bottomSeed.logo} alt={bottomSeed.name}/>
                                    </div>
                                ) : (
                                    <span></span>
                                )}
                                <span className='seed'>{bottomSeed.seed}</span>
                                <span className={`school ${bottomSeed.isWinner ? 'winner' : ''}`}>{bottomSeed.name}</span>
                            </div>
                        </div>
                        <div className={`result ${bottomSeed.isWinner ? 'strong' : ''}`}>{bottomSeed.score}</div>
                    </div>
                </div>
            </div>
        </li>
    );
};



Match.propTypes = {
    scheduled: PropTypes.string,
    isFinal: PropTypes.bool,
    topSeed: PropTypes.shape({
        name: PropTypes.string,
        logo: PropTypes.string,
        seed: PropTypes.string,
        isWinner: PropTypes.bool,
        score: PropTypes.string
    }),
    bottomSeed: PropTypes.shape({
        name: PropTypes.string,
        logo: PropTypes.string,
        seed: PropTypes.string,
        isWinner: PropTypes.bool,
        score: PropTypes.string
    }),
};

export default Match;

