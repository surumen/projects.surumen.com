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


const Bracket3 = (props) => {

    return (
        <ul className="bracket bracket-3">
            <li className="match-container">
                <div className="gamebox 0 third-l offset">
                    <div className="schedule"></div>
                    <div className="match">
                        <div className="competitor">
                            <div className="competitor-container">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="light country-text school-wrapper"><span className="seed">1</span><span className="school "> Gonzaga</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result">68</div>
                        </div>
                        <div className="competitor">
                            <div className="competitor-container">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="strong country-text school-wrapper"><span className="seed">4</span><span className="school winner"> Arkansas</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result strong">74</div>
                        </div>
                    </div>
                </div>
            </li>
            <li className="match-container">
                <div className="gamebox 1 third-l offset">
                    <div className="schedule"></div>
                    <div className="match">
                        <div className="competitor">
                            <div className="competitor-container">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="light country-text school-wrapper"><span className="seed">3</span><span className="school "> Texas Tech</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result">73</div>
                        </div>
                        <div className="competitor">
                            <div className="competitor-container">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="strong country-text school-wrapper"><span className="seed">2</span><span className="school winner"> Duke</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result strong">78</div>
                        </div>
                    </div>
                </div>
            </li>
            <li className="match-container">
                <div className="gamebox 2 third-l offset">
                    <div className="schedule"></div>
                    <div className="match">
                        <div className="competitor">
                            <div className="competitor-container">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="strong country-text school-wrapper"><span className="seed">8</span><span className="school winner"> North Carolina</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result strong">73</div>
                        </div>
                        <div className="competitor">
                            <div className="competitor-container">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="light country-text school-wrapper"><span className="seed">4</span><span className="school "> U.C.L.A.</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result">66</div>
                        </div>
                    </div>
                </div>
            </li>
            <li className="match-container">
                <div className="gamebox 3 third-l offset">
                    <div className="schedule"></div>
                    <div className="match">
                        <div className="competitor">
                            <div className="competitor-container">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="light country-text school-wrapper"><span className="seed">3</span><span className="school "> Purdue</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result">64</div>
                        </div>
                        <div className="competitor">
                            <div className="competitor-container">
                                <div className="game-container  country-only vertical ">
                                    <div className="country-wrapper">
                                        <div className="game-container black ">
                                            <div className="strong country-text school-wrapper"><span className="seed">15</span><span className="school winner"> St. Peter’s</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="result strong">67</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    );
};



export default Bracket3;

