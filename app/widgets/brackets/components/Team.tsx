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

// import widget/custom components


const Team = (props) => {
    let { name, namePredicted, displayName, seed, seedPredicted, displayNamePredicted } = props;

    let className = 'team team-' + name;
    let dataTeam = name;
    let wrongName = '';

    if(!name && namePredicted) {
        className = 'team team-' + namePredicted;
        dataTeam = namePredicted;
        seed = seedPredicted;
        displayName = displayNamePredicted;
    }
    else {
        wrongName = displayNamePredicted;
    }

    return (
        <div className={className} data-team={dataTeam} >
            <span className="team-seed">
                {seed}
            </span>
            <span className="team-name">
                <div className="correct">
                    {displayName}
                </div>
                {/*<div className="incorrect">*/}
                {/*    {wrongName}*/}
                {/*</div>*/}
            </span>
        </div>
    );
};



Team.propTypes = {
    name: PropTypes.string,
    namePredicted: PropTypes.string,
    displayName: PropTypes.string,
    seed: PropTypes.number,
    seedPredicted: PropTypes.number,
    displayNamePredicted: PropTypes.string
};

export default Team;

