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

    const effectiveType = isMobile ? 'left' : type;
    const isRight      = effectiveType === 'right';

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

    // HELPER to pull out your pick from userData
    const getPick = (round: number, idx: number) =>
        userData?.matchups?.[round]?.[idx];

    // FINAL-REGION (unchanged) …
    if (isFinal) {
        // 1) split out semis + final
        const semiFinals = games.filter(g => g.roundNumber === 0);
        const finalGame  = games.find(g => g.roundNumber > 0) || games[0];
        const hasTwoSemis = semiFinals.length === 2;

        return (
            <div ref={containerRef} className="h-100 position-relative">
                <Connector
                    gameRefs={gameRefs.current!}
                    containerRef={containerRef}
                    type={effectiveType}
                    isFinalRegion
                />

                {/* region label in the middle */}
                {!isMobile && (
                    <h2
                        className="position-absolute text-uppercase text-muted"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                            pointerEvents: 'none',
                        }}
                    >
                        {name}
                    </h2>
                )}

                {/* DESKTOP: flex trifecta */}
                {!isMobile ? (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        {hasTwoSemis && (
                            <Round
                                seeds={seeds}
                                gamesData={[semiFinals[0]]}
                                number={0}
                                type="left"
                                pick={getPick(0, 0)}
                                onSeedClick={p => onAdvanceTeam!(semiFinals[0],   0, 0, p)}
                            />
                        )}

                        <div className="mx-4">
                            <Round
                                seeds={seeds}
                                gamesData={[finalGame]}
                                number={hasTwoSemis ? 1 : 0}
                                type="left"
                                pick={getPick(hasTwoSemis ? 1 : 0, 0)}
                                onSeedClick={p => onAdvanceTeam!(finalGame, hasTwoSemis ? 1 : 0, 0, p)}
                            />
                        </div>

                        {hasTwoSemis && (
                            <Round
                                seeds={seeds}
                                gamesData={[semiFinals[1]]}
                                number={0}
                                type="right"
                                pick={getPick(0, 1)}
                                onSeedClick={p => onAdvanceTeam!(semiFinals[1],   0, 1, p)}
                            />
                        )}
                    </div>
                ) : (
                    /* MOBILE: fall back to your normal grid */
                    <div
                        className="flex-grow-1"
                        style={{
                            display:            'grid',
                            gridTemplateRows:   `repeat(${roundsData[0].length * 2 - 1}, 1fr)`,
                            gridTemplateColumns:`repeat(${roundsData.length}, 1fr)`,
                            columnGap:          '0',
                            rowGap:             '1rem',
                            alignContent:       'stretch',
                        }}
                    >
                        {/* ...exactly your existing grid mapping here... */}
                    </div>
                )}
            </div>
        );
    }

    // NORMAL BRACKET GRID
    return (
        <div ref={containerRef} className="h-100 d-flex flex-column position-relative">
            <Connector
                gameRefs={refsForConnector}
                containerRef={containerRef}
                type={effectiveType}
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
                    columnGap:          '0',
                    rowGap:             isMobile ? '0rem' : '1rem',
                    alignContent:       'stretch',
                }}
            >
                {roundsData.map((gamesInRound, roundIdx) =>
                    gamesInRound.map((game, gameIdx) => {
                        const spacing  = rowCount / (gamesInRound.length + 1);
                        const rowStart = gameIdx * 2 ** (roundIdx + 1) + 2 ** roundIdx;
                        const pick     = userData?.matchups?.[roundIdx]?.[gameIdx];

                        // base grid placement: either left→right or right→left
                        const col = isRight
                            ? roundCount - roundIdx
                            : roundIdx + 1;

                        // how much to overlap per round (tweak 50px as needed)
                        const overlapPx = 100;
                        // on mobile, left‐regions shift left, right‐regions shift right
                        const shift = isMobile
                            ? (isRight ? roundIdx * overlapPx : -roundIdx * overlapPx)
                            : 0;

                        return (
                            <div
                                key={`${roundIdx}-${gameIdx}`}
                                ref={gameRefs.current![roundIdx][gameIdx]}
                                style={{
                                    gridColumn:   col,
                                    gridRowStart: rowStart,
                                    transform:    isMobile ? `translateX(${shift}px)` : undefined,
                                }}
                            >
                                <Round
                                    seeds={seeds}
                                    gamesData={[game]}
                                    number={roundIdx}
                                    type={effectiveType}
                                    pick={pick}
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
