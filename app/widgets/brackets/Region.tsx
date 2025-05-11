import React, { useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import Round from './Round';
import type { RegionProps, GameData } from '@/types';
import Connector from '@/widgets/brackets/Connector';

const Region: React.FC<RegionProps> = ({
                                           name,
                                           type = 'left',
                                           seeds,
                                           games,         // flat GameData[]
                                           isFinal = false,
                                           userData,
                                           onAdvanceTeam,
                                       }) => {
    // group games by roundNumber
    const roundsData: GameData[][] = React.useMemo(() => {
        const m = new Map<number, GameData[]>();
        games.forEach(g => {
            const arr = m.get(g.roundNumber) || [];
            arr.push(g);
            m.set(g.roundNumber, arr);
        });
        return Array.from(m.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr);
    }, [games]);

    // possibly reverse for right-facing
    const roundSeq = type === 'right' ? [...roundsData].reverse() : roundsData;
    const maxRounds = roundSeq.length;

    // prepare refs
    const gameRefs = useRef<React.RefObject<HTMLDivElement>[][]>();
    if (!gameRefs.current) {
        gameRefs.current = roundSeq.map(r =>
            Array(r.length)
                .fill(null)
                .map(() => React.createRef<HTMLDivElement>())
        );
    }
    const containerRef = useRef<HTMLDivElement>(null);

    // FINAL region layout
    if (isFinal) {
        // if only one round (championship only)
        if (roundSeq.length === 1) {
            const [champGame] = roundSeq[0];
            const refs = gameRefs.current![0];
            return (
                <div ref={containerRef} className="position-relative mb-0 d-flex flex-column h-100 w-100">
                    <div className="d-flex justify-content-center align-items-center flex-grow-1">
                        <Round
                            seeds={seeds}
                            gamesData={[champGame]}
                            final
                            number={0}
                            maxRounds={1}
                            type="left"
                            gameRefs={refs}
                            onSeedClick={(gameIdx, seed) => onAdvanceTeam?.(0, gameIdx, seed)}
                        />
                    </div>
                </div>
            );
        }

        // semis + championship
        const [semis, finals] = roundSeq;
        const [semiRefs, finalRefs] = gameRefs.current!;

        // define columns
        const sections = [
            {
                key: 'left-semi',
                games: [semis[0]],
                final: false,
                number: 0,
                type: 'left' as const,
                refs: [semiRefs[0]],
                px: 2,
            },
            {
                key: 'championship',
                games: finals,
                final: true,
                number: 1,
                type: 'left' as const,
                refs: finalRefs,
                px: 4,
            },
            {
                key: 'right-semi',
                games: [semis[1]],
                final: false,
                number: 0,
                type: 'right' as const,
                refs: [semiRefs[1]],
                px: 2,
            },
        ];

        return (
            <div ref={containerRef} className="position-relative mb-0 d-flex flex-column h-100">
                <Connector gameRefs={gameRefs.current!} containerRef={containerRef} isFinalRegion />

                <div className="d-flex justify-content-between align-items-center flex-grow-1">
                    {sections.map(sec => {
                        const logicalRound = sec.type === 'right'
                            ? maxRounds - sec.number - 1
                            : sec.number;
                        const userChoices = userData?.matchups[logicalRound] ?? [];
                        return (
                            <div key={sec.key} className={`px-${sec.px} w-100`}>
                                <Round
                                    seeds={seeds}
                                    gamesData={sec.games}
                                    final={sec.final}
                                    number={sec.number}
                                    maxRounds={maxRounds}
                                    type={sec.type}
                                    gameRefs={sec.refs}
                                    onSeedClick={(gameIdx, seed) =>
                                        onAdvanceTeam?.(logicalRound, gameIdx, seed)
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // NORMAL region layout
    return (
        <div ref={containerRef} className="position-relative mb-4 d-flex flex-column h-100">
            <h2
                className="position-absolute top-50 start-50 translate-middle text-uppercase fw-semibold text-muted"
                style={{ zIndex: 2, pointerEvents: 'none' }}
            >
                {name}
            </h2>
            <Connector gameRefs={gameRefs.current!} containerRef={containerRef} type={type} isFinalRegion={false} />

            <div className="position-relative flex-grow-1" style={{ zIndex: 1, minHeight: 0 }}>
                <Row className="h-100 g-2">
                    {roundSeq.map((roundGames, idx) => {
                        const logicalRound = type === 'right'
                            ? maxRounds - idx - 1
                            : idx;
                        const refs = gameRefs.current![idx];

                        return (
                            <Col key={idx} xs={12} lg className="d-flex flex-column px-2">
                                <Round
                                    seeds={seeds}
                                    gamesData={roundGames}
                                    final={false}
                                    number={idx}
                                    maxRounds={maxRounds}
                                    type={type}
                                    gameRefs={refs}
                                    onSeedClick={(gameIdx, seed) =>
                                        onAdvanceTeam?.(logicalRound, gameIdx, seed)
                                    }
                                />
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
};

export default Region;
