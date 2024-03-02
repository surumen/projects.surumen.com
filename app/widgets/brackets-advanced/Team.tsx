/***************************
 Component : Team
 ****************************

 Available Parameters

 */

// import node module libraries
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

// import widget/custom components


const Team = (props) => {
    let { name, logo, seed, score, className } = props;

    return (
        <button className="team" type="button">
            <div className="team-summary">
                <div className="team-logo">
                    <Image src={logo} alt={name} className='logo-image' />
                </div>
                <div className="team-title">
                    <span className="team-seeding">{seed}</span>
                    <span className="team-name">{name}</span>
                </div>
            </div>
            <span className="game-score">{score}</span>
            <div className="winner-border"></div>
        </button>
    );
};



Team.propTypes = {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string,
    seed: PropTypes.number,
    score: PropTypes.string,
    className: PropTypes.string
};

export default Team;

