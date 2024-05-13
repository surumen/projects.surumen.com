/***************************
 Component : Match
 ****************************

 Available Parameters

 */

// import node module libraries
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import React, { Fragment, useState } from "react";
import useMarchMadness from "@/hooks/useMarchMadness";

// import widget/custom components


const similarTeamName = (team1: string, team2: string): boolean => {
  const regex = new RegExp(/[\W_]/g);
  return team1.replace(regex, '').toLowerCase() === team2.replace(regex, '').toLowerCase();
}

const Match = (props) => {
    let { scheduled, isFinal, topSeed, bottomSeed, matchNumber, bracketPosition, handleClickOnMatchFromParent } = props;

    const { predictions } = useMarchMadness();
    let matchPrediction = null;

    if (predictions && predictions.length > 0) {
        const matchPredictions = predictions.filter(p => {
            return (similarTeamName(p['Favored'], topSeed.name) && similarTeamName(p['Underdog'], bottomSeed.name)) ||
                (similarTeamName(p['Favored'], bottomSeed.name) && similarTeamName(p['Underdog'], topSeed.name));
        });
        matchPrediction = matchPredictions.length > 0 ? matchPredictions[0] : null;
    }

    const champion = isFinal && topSeed.isChampion ? topSeed :
        isFinal && bottomSeed.isChampion ? bottomSeed : null;

    const ChampionBoxView = () => {
        return (
            <div className="gamebox d-flex  offset">
                <div className="match">
                    <div className="p-4 text-center justify-content-center">
                        <h6 className="text-limit text-center text-muted mb-3">Champion</h6>
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="avatar-group">
                                <Image src={champion?.logo} alt={champion?.name} className="avatar rounded-circle"/>
                            </div>
                        </div><span className="d-block h3 ls-tight fw-bold">{champion?.name}</span>
                        {matchPrediction ? (
                            <p className="mt-1"><span className="text-success-600 fw-bold text-xs"><i className="fas fa-arrow-up me-1"></i>{Math.round(matchPrediction['Probabilities'] * 100)}% </span><span className="text-muted text-xs text-opacity-75">probability</span></p>
                        ) : (
                            <span></span>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <Fragment>
            {isFinal ? (
                <li style={{visibility: !champion ? 'hidden' : 'inherit'}} className="match-container champion-box">
                    <ChampionBoxView />
                </li>
            ) : (
                <span></span>
            )}
            <li className={`match-container ${bracketPosition} ${isFinal ? 'final' :
                ( matchNumber & 1 ) ? 'odd' : 'even'}`}>
                <div className={`gamebox d-flex ${isFinal ? 'final' : ''} offset`}>
                    <div className='schedule'>{scheduled}</div>
                    <div className='match'>
                        <div onClick={() => handleClickOnMatchFromParent(topSeed)}
                             className={`competitor ${topSeed.name === 'TBC' ? 'pending' : ''}`}>
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
                            <div className={`result ${topSeed.isWinner ? 'strong' : ''}`}>
                                {topSeed.score ? (
                                    <span>{topSeed.score}</span>
                                ) : (
                                    <span>
                                        {matchPrediction && matchPrediction['Predicted Winner'] === topSeed.name ? (
                                            <span className={`text-success text-xs fw-bold`}>{Math.round(matchPrediction['Probabilities'] * 100)}%</span>
                                        ) : (
                                            <span className='d-none'></span>
                                        )}
                                    </span>
                                )}
                            </div>
                            {topSeed.isWinner || (matchPrediction && matchPrediction['Predicted Winner'] === topSeed.name) ? (
                                <div className='winner-border'></div>
                            ) : (
                                <span></span>
                            )}
                        </div>
                        <div onClick={() => handleClickOnMatchFromParent(bottomSeed)}
                             className={`competitor ${bottomSeed.name === 'TBC' ? 'pending' : ''}`}>
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
                            <div className={`result ${bottomSeed.isWinner ? 'strong' : ''}`}>
                                {bottomSeed.score ? (
                                    <span>{bottomSeed.score}</span>
                                ) : (
                                    <span>
                                        {matchPrediction && matchPrediction['Predicted Winner'] === bottomSeed.name ? (
                                            <span className={`text-success text-xs fw-bold`}>{Math.round(matchPrediction['Probabilities'] * 100)}%</span>
                                        ) : (
                                            <span className='d-none'></span>
                                        )}
                                    </span>
                                )}
                            </div>
                            {bottomSeed.isWinner || (matchPrediction && matchPrediction['Predicted Winner'] === bottomSeed.name) ? (
                                <div className='winner-border'></div>
                            ) : (
                                <span></span>
                            )}
                        </div>
                    </div>
                </div>
            </li>
            {isFinal ? (
                <li className="match-container" style={{visibility: 'hidden'}}>
                    <ChampionBoxView />
                </li>
            ) : (
                <span></span>
            )}
        </Fragment>
    );
};



Match.propTypes = {
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
    matchNumber: PropTypes.number,
    bracketPosition: PropTypes.string,
    handleClickOnMatchFromParent: PropTypes.func
};

export default Match;

