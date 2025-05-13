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
                                           semiSeedsMaps
                                       }) => {
    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;
    const isRight = type === 'right';

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
    const rowCount = useMemo(() => roundsData[0].length * 2 - 1, [roundsData]);

    // refs for connectors
    const gameRefs = useRef<React.RefObject<HTMLDivElement>[][]>();
    useEffect(() => { gameRefs.current = undefined }, [games]);
    if (!gameRefs.current) {
        gameRefs.current = roundsData.map(r => r.map(() => React.createRef<HTMLDivElement>()));
    }
    const refsForConnector = isRight
        ? [...gameRefs.current!].reverse()
        : gameRefs.current!;
    const containerRef = useRef<HTMLDivElement>(null);

    if (isFinal) {
        const semis = roundsData[0];
        const finalGame = roundsData[1]?.[0];

        // helper: remap regionKey→SeedMeta to seed→SeedMeta
        const reindex = (m: Record<string, SeedMeta> = {}) => {
            const out: Record<number, SeedMeta> = {};
            Object.values(m).forEach(meta => {
                if (!meta?.seed) return;
                out[meta.seed] = meta;
            });
            return out;
        };

        // semi #1 & #2
        const seedsA = reindex(semiSeedsMaps?.[semis[0].gameNumber]);
        const seedsB = reindex(semiSeedsMaps?.[semis[1].gameNumber]);
        const seedsF = { ...seedsA, ...seedsB };

        return (
            <div ref={containerRef} className="h-100 d-flex flex-column position-relative">
                <Connector
                    gameRefs={refsForConnector!}
                    containerRef={containerRef}
                    type={type}
                    isFinalRegion
                />

                {!isMobile ? (
                    <div className="d-flex justify-content-center align-items-center flex-grow-1">
                        {/* semi #1 */}
                        <div ref={gameRefs.current![0][0]} className="me-4" style={{ flexShrink: 0 }}>
                            <Round
                                seeds={seedsA}
                                gamesData={[semis[0]]}
                                number={0}
                                type="left"
                                pick={userData?.matchups?.[0]?.[0]}
                                rowCount={rowCount}
                                spacing={rowCount / 3}
                                gameRefs={gameRefs.current![0]}
                                onSeedClick={(pick: SeedMeta) => onAdvanceTeam!(semis[0], 0, 0, pick)}
                            />
                        </div>

                        {/* championship */}
                        {finalGame && (
                            <div ref={gameRefs.current![1][0]} className="mx-4" style={{ flexShrink: 0 }}>
                                <Round
                                    seeds={seedsF}
                                    gamesData={[finalGame]}
                                    number={1}
                                    type="center"
                                    pick={userData?.matchups?.[1]?.[0]}
                                    rowCount={rowCount}
                                    spacing={rowCount / 3}
                                    gameRefs={gameRefs.current![1]}
                                    onSeedClick={(pick: SeedMeta) => onAdvanceTeam!(finalGame, 1, 0, pick)}
                                />
                            </div>
                        )}

                        {/* semi #2 */}
                        <div ref={gameRefs.current![0][1]} className="ms-4" style={{ flexShrink: 0 }}>
                            <Round
                                seeds={seedsB}
                                gamesData={[semis[1]]}
                                number={0}
                                type="right"
                                pick={userData?.matchups?.[0]?.[1]}
                                rowCount={rowCount}
                                spacing={rowCount / 3}
                                gameRefs={gameRefs.current![0]}
                                onSeedClick={(pick: SeedMeta) => onAdvanceTeam!(semis[1], 0, 1, pick)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow-1 w-100 position-relative">
                        <div
                            ref={gameRefs.current![0][0]}
                            style={{
                                position: 'absolute',
                                bottom:   '25%',
                                left:     '50%',
                                transform: 'translate(-50%,0)',
                                flexShrink: 0,
                            }}
                        >
                            <Round
                                seeds={seedsA}
                                gamesData={[semis[0]]}
                                number={0}
                                type={type}
                                pick={userData?.matchups?.[0]?.[0]}
                                rowCount={rowCount}
                                spacing={rowCount / 2}
                                gameRefs={gameRefs.current![0]}
                                onSeedClick={(pick: SeedMeta) => onAdvanceTeam!(semis[0], 0, 0, pick)}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // normal bracket grid
    return (
        <div ref={containerRef} className="h-100 d-flex flex-column position-relative">
            <Connector
                gameRefs={refsForConnector!}
                containerRef={containerRef}
                type={type}
                isFinalRegion={false}
            />

            {!isMobile && (
                <h2
                    className="position-absolute text-uppercase text-muted"
                    style={{
                        top:        '50%',
                        left:       '50%',
                        transform:  'translate(-50%, -50%)',
                        zIndex:     1,
                        pointerEvents: 'none',
                    }}
                >
                    {name}
                </h2>
            )}

            <div
                className="flex-grow-1"
                style={{
                    display:           'grid',
                    gridTemplateRows:  `repeat(${rowCount},1fr)`,
                    gridTemplateColumns:`repeat(${roundCount},1fr)`,
                    columnGap:         isMobile ? '-1rem' : '-2rem',
                    alignContent:      'stretch',
                    ...(isRight ? { transform: 'scaleX(-1)' } : {}),
                }}
            >
                {roundsData.map((gamesInRound, roundIdx) =>
                    gamesInRound.map((game, gameIdx) => {
                        const spacing  = rowCount / (gamesInRound.length + 1);
                        const rowStart = gameIdx * 2 ** (roundIdx + 1) + 2 ** roundIdx;
                        const pick     = userData?.matchups?.[roundIdx]?.[gameIdx];
                        return (
                            <div
                                key={`${roundIdx}-${gameIdx}`}
                                ref={gameRefs.current![roundIdx][gameIdx]}
                                style={{
                                    gridColumn:   roundIdx + 1,
                                    gridRowStart: rowStart,
                                    ...(isRight ? { transform: 'scaleX(-1)' } : {}),
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
                                    onSeedClick={(pick: SeedMeta) => onAdvanceTeam!(game, roundIdx, gameIdx, pick)}
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
