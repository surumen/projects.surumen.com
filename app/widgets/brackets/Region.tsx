import React, { useRef, useMemo } from 'react';
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
                                       }) => {
    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;
    const isRight = type === 'right';

    // 1) group games by roundNumber
    const roundsData = useMemo(() => {
        const map = new Map<number, typeof games>();
        games.forEach((g) => {
            const arr = map.get(g.roundNumber) ?? [];
            arr.push(g);
            map.set(g.roundNumber, arr);
        });
        return Array.from(map.keys())
            .sort((a, b) => a - b)
            .map((round) => map.get(round)!);
    }, [games]);

    const roundCount = roundsData.length;
    // total grid rows = 2 * (first-round games) - 1
    const rowCount = useMemo(() => roundsData[0].length * 2 - 1, [roundsData]);

    // 2) prepare refs for each cell
    const gameRefs = useRef<React.RefObject<HTMLDivElement>[][]>();
    if (!gameRefs.current) {
        gameRefs.current = roundsData.map((r) =>
            r.map(() => React.createRef<HTMLDivElement>())
        );
    }

    // 3) if this is a right region, reverse refs so Connector sees logical 0→1→2 order
    const refsForConnector = useMemo(
        () => (isRight ? [...gameRefs.current!].reverse() : gameRefs.current!),
        [isRight]
    );

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="h-100 d-flex flex-column position-relative"
        >
            {/* Connector uses refsForConnector (never flipped) */}
            <Connector
                gameRefs={refsForConnector}
                containerRef={containerRef}
                type={type}
                isFinalRegion={false}
            />

            {/* Header */}
            {!isMobile && (
                <h2
                    className="position-absolute text-uppercase text-muted"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                >
                    {name}
                </h2>
            )}

            {/* Visual grid (flipped for right) */}
            <div
                className="flex-grow-1"
                style={{
                    display: 'grid',
                    // break into 2*N-1 rows so midpoints align
                    gridTemplateRows: `repeat(${rowCount}, 1fr)`,
                    gridTemplateColumns: `repeat(${roundCount}, 1fr)`,
                    columnGap: isMobile ? '1rem' : '2rem',
                    alignContent: 'stretch',
                    ...(isRight ? { transform: 'scaleX(-1)' } : {}),
                }}
            >
                {roundsData.map((gamesInRound, roundIdx) =>
                    gamesInRound.map((game, gameIdx) => {
                        // still pass spacing for Round, even if not used for positioning
                        const spacing = rowCount / (gamesInRound.length + 1);
                        // place each game halfway between its two feeders:
                        const rowStart =
                            gameIdx * Math.pow(2, roundIdx + 1) + Math.pow(2, roundIdx);

                        const pick = userData?.matchups?.[roundIdx]?.[gameIdx];
                        const participants = pick
                            ? ([seeds[pick[0]], seeds[pick[1]]] as [
                                typeof seeds[number]?,
                                typeof seeds[number]?
                            ])
                            : undefined;

                        return (
                            <div
                                key={`${roundIdx}-${gameIdx}`}
                                ref={gameRefs.current![roundIdx][gameIdx]}
                                style={{
                                    gridColumn: roundIdx + 1,
                                    gridRowStart: rowStart,
                                    // un-flip the content inside
                                    ...(isRight ? { transform: 'scaleX(-1)' } : {}),
                                }}
                            >
                                <Round
                                    seeds={seeds}
                                    gamesData={[game]}
                                    number={roundIdx}
                                    type={type}
                                    pick={userData?.matchups?.[roundIdx]?.[gameIdx]}
                                    rowCount={rowCount}
                                    spacing={spacing}
                                    gameRefs={gameRefs.current![roundIdx]}
                                    onSeedClick={(seed) =>
                                        onAdvanceTeam!(game, roundIdx, gameIdx, seed)
                                    }
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
