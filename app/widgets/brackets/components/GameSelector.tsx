/***************************
 Component : Participant
 ****************************

 Available Parameters

 x              : Add docs
 y              : Add docs
 side           : Add docs
 onHover        : Add docs
 teamNameStyle  : Add docs
 teamScoreStyle : Add docs

 */

// import node module libraries
import PropTypes from 'prop-types';
import React, { Fragment } from "react";
import { X } from "react-bootstrap-icons";

// import widget/custom components

const createOptions = (games, seeds, gamesPredicted) => {

    const response: any[] = [];
    for (let i = 1; i < 8; i++) {
        if(games && i-1 < games.length && seeds) {
            const seed = games[i-1];
            if(seed in seeds) {
                if(i === gamesPredicted) {
                    response.push(
                        [seed, "game-option predicted background-"+seeds[seed]["name"]]
                    );
                }
                else {
                    response.push(
                        [seed, "game-option background-"+seeds[seed]["name"]]
                    );
                }
            }
            else {
                if(i === gamesPredicted) {
                    response.push(
                        [seed, "game-option predicted unplayed"]
                    );
                }
                else {
                    response.push(
                        [i-1, "game-option"]
                    );
                }
            }
        }
        else {
            if(i === gamesPredicted) {
                response.push(
                    ['', "game-option predicted unplayed"]
                );
            }
            else {
                response.push(
                    [i-1, "game-option"]
                );
            }
        }
    }
    return response;

}


const GameSelector = (props) => {
    const { games, seeds, gamesPredicted } = props;


    const options = createOptions(games, seeds, gamesPredicted).map((element, index) => {
        return (
            <span className={element[1]} key={index}>
                {index + 1}
            </span>
        );
    });

    return (
        <div className="game-selector">
            {options}
        </div>
    );
};



GameSelector.propTypes = {
    games: PropTypes.array,
    seeds: PropTypes.object,
    gamesPredicted: PropTypes.number
};

export default GameSelector;

