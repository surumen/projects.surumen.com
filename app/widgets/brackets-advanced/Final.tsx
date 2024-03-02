/***************************
 Component : Team
 ****************************

 Available Parameters

 */

// import node module libraries
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import React from "react";

// import widget/custom components


const FinalRound = (props) => {
    let { name, logo, seed, score, className } = props;

    return (
        <ul className="bracket bracket-6">
            <li className="match-container">
                <div className="gamebox 0 final  offset">
                    <div className="schedule "></div>
                    <div className="match ">
                        <div className="competitor ">
                            <div className="competitor-container ">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black  ">
                                            <div className="light country-text school-wrapper "><span className="seed ">8</span><span className="school  "> North Carolina</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result ">69</div>
                        </div>
                        <div className="competitor ">
                            <div className="competitor-container ">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black  ">
                                            <div className="strong country-text school-wrapper "><span className="seed ">1</span><span className="school winner "> Kansas</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result  strong">72</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    );
};



FinalRound.propTypes = {
    name: PropTypes.string,
    logo: PropTypes.string,
    seed: PropTypes.number,
    score: PropTypes.string,
    className: PropTypes.string
};

export default FinalRound;

