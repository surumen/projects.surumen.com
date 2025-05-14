// widgets/brackets/Region.tsx
import React, { useRef, useMemo, useEffect } from 'react';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import type { RegionProps, GameData, SeedMeta } from '@/types';
import Round from '@/widgets/brackets/Round';
import Connector from '@/widgets/brackets/Connector';

const Region: React.FC<RegionProps> = ({
                                           name,
                                           type = 'left',
                                           seeds,
                                           games,
                                           userData,
                                           onAdvanceTeam,
                                           isFinal = false,
                                           semiSeedsMaps,
                                       }) => {
    const hasMounted    = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile      = hasMounted && isMobileQuery;
    const isRight    = type === 'right';

    // group games by round
    const roundsData = useMemo(() => {
        const m = new Map<number, GameData[]>();
        games.forEach(g => {
            const arr = m.get(g.roundNumber) ?? [];
            arr.push(g);
            m.set(g.roundNumber, arr);
        });
        return Array.from(m.keys()).sort((a, b) => a - b).map(r => m.get(r)!);
    }, [games]);

    const roundCount = roundsData.length;
    const rowCount   = roundsData[0].length * 2 - 1;

    // refs for connectors
    const gameRefs = useRef<React.RefObject<HTMLDivElement>[][]>();
    useEffect(() => { gameRefs.current = undefined; }, [games]);
    if (!gameRefs.current) {
        gameRefs.current = roundsData.map(r => r.map(() => React.createRef()));
    }
    const refsForConnector = gameRefs.current!;
    const containerRef     = useRef<HTMLDivElement>(null);

    // FINAL-REGION (unchanged) …
    if (isFinal) {
        // … your existing final-region code here, passing refsForConnector …
    }

    // NORMAL BRACKET GRID
    return (
        <div ref={containerRef} className="h-100 d-flex flex-column position-relative">
            <Connector
                gameRefs={refsForConnector}
                containerRef={containerRef}
                type={type}
                isFinalRegion={false}
            />

            {!isMobile && (
                <h2
                    className="position-absolute text-uppercase text-muted"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex:      1,
                        pointerEvents:'none',
                    }}
                >
                    {name}
                </h2>
            )}

            <div
                className="flex-grow-1"
                style={{
                    display:            'grid',
                    gridTemplateRows:   `repeat(${rowCount}, 1fr)`,
                    gridTemplateColumns:`repeat(${roundCount}, 1fr)`,
                    columnGap:          isMobile ? '-1rem' : '-2rem',
                    alignContent:       'stretch',
                }}
            >
                {roundsData.map((gamesInRound, roundIdx) =>
                    gamesInRound.map((game, gameIdx) => {
                        const spacing  = rowCount / (gamesInRound.length + 1);
                        const rowStart = gameIdx * 2 ** (roundIdx + 1) + 2 ** roundIdx;
                        const pick     = userData?.matchups?.[roundIdx]?.[gameIdx];

                        // pick column either left→right or right→left
                        const col = isRight
                            ? roundCount - roundIdx
                            : roundIdx + 1;

                        return (
                            <div
                                key={`${roundIdx}-${gameIdx}`}
                                ref={gameRefs.current![roundIdx][gameIdx]}
                                style={{
                                    gridColumn:   col,
                                    gridRowStart: rowStart,
                                }}
                            >
                                <Round
                                    seeds={seeds}
                                    gamesData={[game]}
                                    number={roundIdx}
                                    type={type}
                                    pick={pick}
                                    rowCount={rowCount}
                                    spacing={spacing}
                                    gameRefs={gameRefs.current![roundIdx]}
                                    onSeedClick={p => onAdvanceTeam!(game, roundIdx, gameIdx, p)}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Region;
