import React, { useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import Round from './Round';
import type { RegionProps } from '@/types';
import Connector from '@/widgets/brackets/Connector';

const Region: React.FC<RegionProps> = ({
                                           name,
                                           type = 'left',
                                           seeds,
                                           rounds,
                                           games,
                                       }) => {
    // 1) Reverse sequences for right
    const roundSeq  = type === 'right' ? [...rounds].reverse()            : rounds;
    const gamesSeq  = type === 'right' ? [...games].reverse()             : games;
    const maxRounds = roundSeq.length;

    // 2) Stable gameRefs using useRef + lazy init
    const gameRefs = useRef<Array<Array<React.RefObject<HTMLDivElement>>>>();
    if (!gameRefs.current) {
        gameRefs.current = roundSeq.map(r =>
            Array(Math.ceil(r.length / 2))
                .fill(null)
                .map(() => React.createRef<HTMLDivElement>())
        );
    }

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="position-relative mb-4 d-flex flex-column h-100"
        >

            {/* Region name centered in the middle */}
            <h2
                className="position-absolute top-50 start-50 translate-middle text-uppercase fw-semibold text-muted"
                style={{ zIndex: 2, pointerEvents: 'none' }}
            >
                {name}
            </h2>

            {/* Connector behind everything */}
            <Connector
                gameRefs={gameRefs.current!}
                containerRef={containerRef}
                type={type}
            />

            {/* Foreground game buttons */}
            <div className="position-relative flex-grow-1" style={{ zIndex: 1, minHeight: 0 }}>
                <Row className="h-100 g-2">
                    {roundSeq.map((pairings, idx) => (
                        <Col key={idx} xs={12} lg className="d-flex flex-column px-2">
                            <Round
                                seeds={seeds}
                                pairings={pairings}
                                games={gamesSeq[idx]}
                                final={false}
                                number={idx}
                                maxRounds={maxRounds}
                                type={type}
                                gameRefs={gameRefs.current![idx]}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default Region;
