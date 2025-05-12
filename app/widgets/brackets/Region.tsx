import React, { useRef, useMemo, useEffect } from 'react';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import type { RegionProps } from '@/types';
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
                                       }) => {
    const hasMounted    = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile      = hasMounted && isMobileQuery;
    const isRight       = type === 'right';

    // 1) group by round
    const roundsData = useMemo(() => {
        const map = new Map<number, typeof games>();
        games.forEach(g => {
            const arr = map.get(g.roundNumber) ?? [];
            arr.push(g);
            map.set(g.roundNumber, arr);
        });
        return Array.from(map.keys())
            .sort((a, b) => a - b)
            .map(r => map.get(r)!);
    }, [games]);

    // grid dims
    const roundCount = roundsData.length;
    const rowCount   = useMemo(() => roundsData[0].length * 2 - 1, [roundsData]);

    // prepare refs & reset on games change
    const gameRefs = useRef<React.RefObject<HTMLDivElement>[][]>();
    useEffect(() => { gameRefs.current = undefined }, [games]);
    if (!gameRefs.current) {
        gameRefs.current = roundsData.map(r =>
            r.map(() => React.createRef<HTMLDivElement>())
        );
    }
    const refsForConnector = useMemo(
        () => isRight
            ? [...gameRefs.current!].reverse()
            : gameRefs.current!,
        [isRight]
    );
    const containerRef = useRef<HTMLDivElement>(null);

    // final‐region data
    const semis     = isFinal ? roundsData[0] : [];
    const finalGame = isFinal && roundsData.length > 1
        ? roundsData[1][0]
        : undefined;

    return (
        <div ref={containerRef} className="h-100 d-flex flex-column position-relative">
            <Connector
                gameRefs={refsForConnector}
                containerRef={containerRef}
                type={type}
                isFinalRegion={isFinal}
            />

            {/* title only on non-final desktop */}
            {!isMobile && !isFinal && (
                <h2
                    className="position-absolute text-uppercase text-muted"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                >{name}</h2>
            )}

            {isFinal && !isMobile ? (
                semis.length === 2 && finalGame ? (
                    // desktop 3-pane final
                    <div className="d-flex justify-content-center align-items-center flex-grow-1">
                        {/* semi1 */}
                        <div ref={gameRefs.current![0][0]} className="me-4" style={{ flexShrink: 0 }}>
                            <Round
                                seeds={seeds}
                                gamesData={[semis[0]]}
                                number={0}
                                type='left'
                                pick={userData?.matchups?.[0]?.[0]}
                                rowCount={rowCount}
                                spacing={rowCount/3}
                                gameRefs={gameRefs.current![0]}
                                onSeedClick={seed => onAdvanceTeam!(semis[0], 0, 0, seed)}
                            />
                        </div>
                        {/* final */}
                        <div ref={gameRefs.current![1][0]} className="mx-4" style={{ flexShrink: 0 }}>
                            <Round
                                seeds={seeds}
                                gamesData={[finalGame]}
                                number={1}
                                type='center'
                                pick={userData?.matchups?.[1]?.[0]}
                                rowCount={rowCount}
                                spacing={rowCount/3}
                                gameRefs={gameRefs.current![1]}
                                onSeedClick={seed => onAdvanceTeam!(finalGame, 1, 0, seed)}
                            />
                        </div>
                        {/* semi2 */}
                        <div ref={gameRefs.current![0][1]} className="ms-4" style={{ flexShrink: 0 }}>
                            <Round
                                seeds={seeds}
                                gamesData={[semis[1]]}
                                number={0}
                                type='right'
                                pick={userData?.matchups?.[0]?.[1]}
                                rowCount={rowCount}
                                spacing={rowCount/3}
                                gameRefs={gameRefs.current![0]}
                                onSeedClick={seed => onAdvanceTeam!(semis[1], 0, 1, seed)}
                            />
                        </div>
                    </div>
                ) : (
                    // single‐game final: center
                    <div
                        className="flex-grow-1 w-100"
                        style={{ position: 'relative' }}
                    >
                        <div
                            ref={gameRefs.current![0][0]}
                            style={{
                                position: 'absolute',
                                bottom: '25%',
                                left: '50%',
                                transform: 'translate(-50%, 0)',
                                flexShrink: 0,
                            }}
                        >
                            <Round
                                seeds={seeds}
                                gamesData={[roundsData[0][0]]}
                                number={0}
                                type={type}
                                pick={userData?.matchups?.[0]?.[0]}
                                rowCount={rowCount}
                                spacing={rowCount / 2}
                                gameRefs={gameRefs.current![0]}
                                onSeedClick={seed =>
                                    onAdvanceTeam!(roundsData[0][0], 0, 0, seed)
                                }
                            />
                        </div>
                    </div>
                )
            ) : (
                // original grid
                <div
                    className="flex-grow-1"
                    style={{
                        display: 'grid',
                        gridTemplateRows: `repeat(${rowCount},1fr)`,
                        gridTemplateColumns: `repeat(${roundCount},1fr)`,
                        columnGap: isMobile ? '-1rem' : '-2rem', // negative gap allows rounds to overlap slightly
                        alignContent: 'stretch',
                        ...(isRight ? { transform: 'scaleX(-1)' } : {}),
                    }}
                >
                    {roundsData.map((gamesInRound, roundIdx) =>
                        gamesInRound.map((game, gameIdx) => {
                            const spacing = rowCount/(gamesInRound.length+1);
                            const rowStart = gameIdx * 2**(roundIdx+1) + 2**roundIdx;
                            const pick = userData?.matchups?.[roundIdx]?.[gameIdx];
                            return (
                                <div
                                    key={`${roundIdx}-${gameIdx}`}
                                    ref={gameRefs.current![roundIdx][gameIdx]}
                                    style={{
                                        gridColumn: roundIdx+1,
                                        gridRowStart: rowStart,
                                        ...(isRight?{transform:'scaleX(-1)'}:{})
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
                                        onSeedClick={seed=>onAdvanceTeam!(game,roundIdx,gameIdx,seed)}
                                    />
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default Region;
