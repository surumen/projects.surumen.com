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


const Bracket8 = (props) => {

    return (
        <ul className="bracket bracket-8">
            <li className="match-container">
                <div className="gamebox 0 finals-r  offset">
                    <div className="schedule "></div>
                    <div className="match ">
                        <div className="competitor ">
                            <div className="competitor-container ">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black  ">
                                            <div className="light country-text school-wrapper "><span className="seed ">5</span><span className="school  "> Houston</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result ">44</div>
                        </div>
                        <div className="competitor ">
                            <div className="competitor-container ">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black  ">
                                            <div className="strong country-text school-wrapper "><span className="seed ">2</span><span className="school winner "> Villanova</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result  strong">50</div>
                        </div>
                    </div>
                </div>
            </li>
            <li className="match-container">
                <div className="gamebox 1 finals-r  offset">
                    <div className="schedule "></div>
                    <div className="match ">
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
                            <div className="result  strong">76</div>
                        </div>
                        <div className="competitor ">
                            <div className="competitor-container ">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black  ">
                                            <div className="light country-text school-wrapper "><span className="seed ">10</span><span className="school  "> Miami (Fla.)</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result ">50</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    );
};



export default Bracket8;

