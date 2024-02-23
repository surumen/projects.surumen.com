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
import React from "react";

// import widget/custom components


// import data
import * as PLAYOFFS from '@/data/Playoffs.json';
import * as BRACKETS from '@/data/Brackets.json';
import Region from "@/widgets/brackets/components/Region";


const getRegions = () => {
    const response: any[] = [];
    for(const key in PLAYOFFS) {
        if (key !== 'default') {
            response.push(key);
        }
    }
    return response;
}

const RegionalTournament = () => {

    const regions = getRegions().map((element, index) => {
        return (
            <Region
                seeds = {PLAYOFFS[element]["seeds"]}
                rounds = {PLAYOFFS[element]["rounds"]}
                games = {PLAYOFFS[element]["games"]}
                userData = {BRACKETS["sample"][element]}
                type = {index % 2 == 0 ? "left" : "right"}
                name = {element}
                key = {index} />
        );
    });


    return (
        <div className="tournament">
            {regions}
        </div>
    );
};



export default RegionalTournament;

