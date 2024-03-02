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


const Bracket4 = (props) => {

    return (
        <ul className="bracket bracket-4">
            <li className="match-container">
                <div className="gamebox 0 finals-l  offset">
                    <div className="schedule "></div>
                    <div className="match ">
                        <div className="competitor ">
                            <div className="competitor-container ">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="light country-text school-wrapper"><span className="seed">4</span><span className="school "> Arkansas</span></div>
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
                                        <div className="game-container black ">
                                            <div className="strong country-text school-wrapper"><span className="seed">2</span><span className="school winner"> Duke</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result  strong">78</div>
                        </div>
                    </div>
                </div>
            </li>
            <li className="match-container">
                <div className="gamebox 1 finals-l  offset">
                    <div className="schedule "></div>
                    <div className="match ">
                        <div className="competitor ">
                            <div className="competitor-container ">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="strong country-text school-wrapper"><span className="seed">8</span><span className="school winner"> North Carolina</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result  strong">69</div>
                        </div>
                        <div className="competitor ">
                            <div className="competitor-container ">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="light country-text school-wrapper"><span className="seed">15</span><span className="school "> St. Peter’s</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result ">49</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    );
};



export default Bracket4;

