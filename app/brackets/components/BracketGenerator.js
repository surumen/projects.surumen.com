/***************************
 Component : BracketGenerator
 ****************************

 Available Parameters

game            : Add docs
style           : Add docs

 */

// import node module libraries
import { useState } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'underscore';

// import widget/custom components
import { makeFinals } from '../utils/makeFinals';
import Bracket from "./Bracket";


const BracketTitle = (titleProps) => {
    const { game, height } = titleProps;

    return (
        <h3 style={{ textAlign: 'center' }}>
            {game.bracketLabel || game.name} ({height} {height === 1 ? 'round' : 'rounds'})
        </h3>
    );
};

const BracketGenerator = (props) => {

    const { games, titleComponent, style } = props;
    const [finals, setFinals] = useState(makeFinals({ games: games }));

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', ...style }}>
            {
                _.map(
                    finals,
                    ({ game, height }) => (
                        <div key={game.id} style={{ textAlign: 'center', flexGrow: 1, maxWidth: '100%' }}>
                            <BracketTitle game={game} height={height}/>
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

BracketGenerator.defaultProps = {
    titleComponent: BracketTitle,
};

BracketGenerator.propTypes = {
    games: PropTypes.object,
    titleComponent: PropTypes.object,
    style: PropTypes.string
};

export default BracketGenerator;

