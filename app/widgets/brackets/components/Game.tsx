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
import Team from "@/widgets/brackets/components/Team";
import GameSelector from "@/widgets/brackets/components/GameSelector";

// import widget/custom components


const adjustName = (name) => {
    name = name.replace("-", " ");
    return name.replace(/\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

const getNames = (firstSeed, secondSeed, seeds) => {
    let firstName, firstNameAdjusted, secondName, secondNameAdjusted;
    if (firstSeed !== 0) {
        firstName = seeds[firstSeed];
        firstNameAdjusted = adjustName(firstName);
    }
    if (secondSeed !== 0) {
        secondName = seeds[secondSeed];
        secondNameAdjusted = adjustName(secondName);
    }
    return {firstName, firstNameAdjusted, secondName, secondNameAdjusted};
}

const getNamesPredicted = (final, firstSeedPredicted, secondSeedPredicted, seeds) => {
    let ogFirstNamePredicted, firstNamePredicted, ogSecondNamePredicted, secondNamePredicted;

    if (final) {
        ogFirstNamePredicted = seeds[firstSeedPredicted[0]][firstSeedPredicted[1]];
        firstNamePredicted = adjustName(ogFirstNamePredicted);

        ogSecondNamePredicted = seeds[secondSeedPredicted[0]][secondSeedPredicted[1]];
        secondNamePredicted = adjustName(ogSecondNamePredicted);
    } else {
        ogFirstNamePredicted = seeds[firstSeedPredicted];
        firstNamePredicted = adjustName(ogFirstNamePredicted);

        ogSecondNamePredicted = seeds[secondSeedPredicted];
        secondNamePredicted = adjustName(ogSecondNamePredicted);
    }
    return {ogFirstNamePredicted, firstNamePredicted, ogSecondNamePredicted, secondNamePredicted}
}

const summarize = (firstSeed, ogFirstName, secondSeed, ogSecondName) => {
    const response: any = {};

    response[firstSeed] = {
        name: ogFirstName
    };
    response[secondSeed] = {
        name: ogSecondName
    };
    return response;
}


const Game = (props) => {
    const {
        firstSeed, secondSeed, firstSeedPredicted, secondSeedPredicted, final, seeds, games, gamesPredicted
    } = props;

    let firstName, firstNameAdjusted, secondName, secondNameAdjusted = '';
    let ogFirstNamePredicted, firstNamePredicted, ogSecondNamePredicted, secondNamePredicted = '';

    const allNames = getNames(
        firstSeed, secondSeed, seeds
    );
    firstName = allNames.firstName;
    firstNameAdjusted = allNames.firstNameAdjusted;
    secondName = allNames.secondName;
    secondNameAdjusted = allNames.secondNameAdjusted;


    if (firstSeedPredicted) {
        const namesPredicted = getNamesPredicted(
            final, firstSeedPredicted, secondSeedPredicted, seeds
        );
        ogFirstNamePredicted = namesPredicted.ogFirstNamePredicted;
        firstNamePredicted = namesPredicted.firstNamePredicted;
        ogSecondNamePredicted = namesPredicted.ogSecondNamePredicted;
        secondNamePredicted = namesPredicted.secondNamePredicted;
    }


    return (
        <article className="game">
            <Team
                name={firstName}
                namePredicted={ogFirstNamePredicted}
                displayName={firstNameAdjusted}
                displayNamePredicted={firstNamePredicted}
                seed = {firstSeed}
                seedPredicted = {final ? firstSeedPredicted[1] : firstSeedPredicted} />

            <Team
                name={secondName}
                namePredicted={ogSecondNamePredicted}
                displayName={secondNameAdjusted}
                displayNamePredicted={secondNamePredicted}
                seed={secondSeed}
                seedPredicted={final ? secondSeedPredicted[1] : secondSeedPredicted} />

            <GameSelector
                games={games}
                seeds={summarize(firstSeed, firstName, secondSeed, secondName)}
                gamesPredicted={gamesPredicted} />
        </article>
    );
};



Game.propTypes = {
    firstSeed: PropTypes.number,
    secondSeed: PropTypes.number,
    seeds: PropTypes.object,
    firstSeedPredicted: PropTypes.number,
    secondSeedPredicted: PropTypes.number,
    final: PropTypes.bool,
    games: PropTypes.array,
    gamesPredicted: PropTypes.number
};

export default Game;

