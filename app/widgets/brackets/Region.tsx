// components/Region.tsx
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
                                           isFinal = false,
                                       }) => {
    const roundSeq  = type === 'right' ? [...rounds].reverse() : rounds;
    const gamesSeq  = type === 'right' ? [...games].reverse()  : games;
    const maxRounds = roundSeq.length;

    const gameRefs = useRef<React.RefObject<HTMLDivElement>[][]>();
    if (!gameRefs.current) {
        gameRefs.current = roundSeq.map(r =>
            Array(Math.ceil(r.length / 2))
                .fill(null)
                .map(() => React.createRef<HTMLDivElement>())
        );
    }
    const containerRef = useRef<HTMLDivElement>(null);

    // Final layout
    if (isFinal) {
        // single championship
        if (roundSeq.length === 1) {
            const [a, b] = roundSeq[0];
            const [g]    = gamesSeq[0];
            const refs   = gameRefs.current![0];

            return (
                <div ref={containerRef} className="position-relative mb-4 d-flex flex-column h-100">
                    <div className="d-flex justify-content-center align-items-center flex-grow-1">
                        <Round
                            seeds={seeds}
                            pairings={[a, b]}
                            games={[g]}
                            final={true}
                            number={0}
                            maxRounds={1}
                            type="left"
                            gameRefs={refs}
                        />
                    </div>
                </div>
            );
        }

        // semis + final
        const semisSeeds = roundSeq[0];
        const semisGames = gamesSeq[0];
        const finalSeeds = roundSeq[1];
        const finalGames = gamesSeq[1];
        const semiRefs   = gameRefs.current![0];
        const finalRefs  = gameRefs.current![1];

        return (
            <div ref={containerRef} className="position-relative mb-4 d-flex flex-column h-100">
                <Connector
                    gameRefs={gameRefs.current!}
                    containerRef={containerRef}
                    isFinalRegion={true}    // use new flag
                />

                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    {/* Left Semi */}
                    <div className="px-2">
                        <Round
                            seeds={seeds}
                            pairings={[semisSeeds[0], semisSeeds[1]]}
                            games={[semisGames[0]]}
                            final={false}
                            number={0}
                            maxRounds={2}
                            type="left"
                            gameRefs={[semiRefs[0]]}
                        />
                    </div>
                    {/* Championship */}
                    <div className="px-4">
                        <Round
                            seeds={seeds}
                            pairings={finalSeeds}
                            games={finalGames}
                            final={true}
                            number={1}
                            maxRounds={2}
                            type="left"
                            gameRefs={finalRefs}
                        />
                    </div>
                    {/* Right Semi */}
                    <div className="px-2">
                        <Round
                            seeds={seeds}
                            pairings={[semisSeeds[2], semisSeeds[3]]}
                            games={[semisGames[1]]}
                            final={false}
                            number={0}
                            maxRounds={2}
                            type="right"
                            gameRefs={[semiRefs[1]]}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Default regions
    return (
        <div ref={containerRef} className="position-relative mb-4 d-flex flex-column h-100">
            <h2
                className="position-absolute top-50 start-50 translate-middle text-uppercase fw-semibold text-muted"
                style={{ zIndex: 2, pointerEvents: 'none' }}
            >
                {name}
            </h2>
            <Connector
                gameRefs={gameRefs.current!}
                containerRef={containerRef}
                type={type}
                isFinalRegion={false}
            />
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
