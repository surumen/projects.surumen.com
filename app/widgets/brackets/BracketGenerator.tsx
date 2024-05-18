// import node module libraries
import React, { useState } from "react";
import PropTypes from "prop-types";
import * as _ from 'underscore';
import { gameProps } from "@/widgets/brackets/BracketGame";
import { makeFinals } from "@/utils";
import Bracket from "@/widgets/brackets/Bracket";


const BracketGenerator = (props) => {
    const { games } = props;
    const [finals, setFinals] = useState<any>(makeFinals(games));

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            {
                _.map(
                    finals,
                    ({ game, height }) => (
                        <div key={game.id} style={{ textAlign: 'center', flexGrow: 1, maxWidth: '100%' }}>
                            <div style={{ maxWidth: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                <Bracket game={game} />
                            </div>
                        </div>
                    )
                )
            }
        </div>
    );
};


BracketGenerator.propTypes = {
    games: PropTypes.arrayOf(gameProps)
}

export default BracketGenerator;