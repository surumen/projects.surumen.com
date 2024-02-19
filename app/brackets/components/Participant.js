/***************************
 Component : Participant
 ****************************

 Available Parameters

 x              : Add docs
 y              : Add docs
 side           : Add docs
 onHover        : Add docs

 */

// import node module libraries
import PropTypes from 'prop-types';

// import widget/custom components
import { ClippedRect } from './Clipped';

const Participant = (props) => {
    const { x, y, side, teamNameStyle, teamScoreStyle, onHover } = props;

    const tooltip = side.seed && side.team ? <title>{side.seed.displayName}</title> : null;

    return (
        <g onMouseEnter={() => onHover(side && side.team ? side.team.id : null)} onMouseLeave={() => onHover(null)}>
            {/* trigger mouse events on the entire block */}
            <rect x={x} y={y} height={22.5} width={200} fillOpacity={0}>
                {tooltip}
            </rect>

            <ClippedRect x={x} y={y} height={22.5} width={165}>
                <text x={x + 5} y={y + 16}
                      style={{ ...teamNameStyle, fontStyle: side.seed && side.seed.sourcePool ? 'italic' : null }}>
                    {tooltip}
                    {side.team ? side.team.name : (side.seed ? side.seed.displayName : null)}
                </text>
            </ClippedRect>

            <text x={x + 185} y={y + 16} style={teamScoreStyle} textAnchor="middle">
                {side.score ? side.score.score : null}
            </text>
        </g>
    );
};


const SideProps = PropTypes.shape({
    score: PropTypes.shape({
        score: PropTypes.number
    }),
    seed: PropTypes.shape({
        displayName: PropTypes.string,
        rank: PropTypes.number,
        sourceGame: PropTypes.object,
        sourcePool: PropTypes.object
    }),
    team: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
    })
});


Participant.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    side: SideProps,
    teamNameStyle: PropTypes.object,
    teamScoreStyle: PropTypes.object,
    onHover: PropTypes.func
};

export default Participant;

