import React, { Fragment, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import DynamicBracket from '@/components/brackets/DynamicBracket';

const TournamentAssistant = () => {

    return (
        <Fragment>
           <DynamicBracket
               tournamentType={'ncaa'}
               year={2025}
               regionsPerRow={2}
           />
        </Fragment>
    );
};

export default TournamentAssistant;
