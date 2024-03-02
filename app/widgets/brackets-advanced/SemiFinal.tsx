/***************************
 Component : Team
 ****************************

 Available Parameters

 */

// import node module libraries
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import React, { Fragment } from 'react';

// import widget/custom components


const SemiFinal = (props) => {
    let { type } = props;

    return (
        <Fragment>
            {type === 'left' ? (
                <ul className="bracket bracket-5">
                    <li className="match-container">
                        <div className="gamebox 0 final four-l  offset">
                            <div className="schedule "></div>
                            <div className="match ">
                                <div className="competitor ">
                                    <div className="competitor-container ">
                                        <div className="game-container  country-only vertical ">
                                            <div className="country-wrapper">
                                                <div className="game-container black ">
                                                    <div className="light country-text school-wrapper"><span className="seed">2</span><span className="school "> Duke</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="result ">77</div>
                                </div>
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
                                    <div className="result  strong">81</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            ) : (
                <ul className="bracket bracket-7">
                    <li className="match-container">
                        <div className="gamebox 0 final four-r  offset">
                            <div className="schedule "></div>
                            <div className="match ">
                                <div className="competitor ">
                                    <div className="competitor-container ">
                                        <div className="game-container  country-only vertical ">
                                            <div className="country-wrapper">
                                                <div className="game-container black ">
                                                    <div className="light country-text school-wrapper"><span className="seed">2</span><span className="school "> Villanova</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="result ">65</div>
                                </div>
                                <div className="competitor ">
                                    <div className="competitor-container ">
                                        <div className="game-container  country-only vertical ">
                                            <div className="country-wrapper">
                                                <div className="game-container black ">
                                                    <div className="strong country-text school-wrapper"><span className="seed">1</span><span className="school winner"> Kansas</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="result  strong">81</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            )}
        </Fragment>
    );
};



SemiFinal.propTypes = {
    type: PropTypes.string
};

export default SemiFinal;

