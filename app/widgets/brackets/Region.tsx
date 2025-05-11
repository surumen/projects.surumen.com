import React, { useRef } from 'react';
import Round from './Round';
import Connector from '@/widgets/brackets/Connector';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import type { RegionProps, GameData } from '@/types';

const Region: React.FC<RegionProps> = ({
                                           name,
                                           type = 'left',
                                           seeds,
                                           games,
                                           isFinal = false,
                                           userData,
                                           onAdvanceTeam,
                                       }) => {
    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;

    // 1) group & optionally reverse
    const roundsData = React.useMemo(() => {
        const m = new Map<number, GameData[]>();
        games.forEach(g => {
            (m.get(g.roundNumber) || m.set(g.roundNumber, []).get(g.roundNumber)!).push(g);
        });
        return Array.from(m.entries())
            .sort(([a], [b]) => a - b)
            .map(([, arr]) => arr);
    }, [games]);

    const roundSeq = type === 'right' ? [...roundsData].reverse() : roundsData;
    const maxRounds = roundSeq.length;

    // 2) prepare refs
    const gameRefs = useRef<React.RefObject<HTMLDivElement>[][]>();
    if (!gameRefs.current) {
        gameRefs.current = roundSeq.map(r => r.map(() => React.createRef<HTMLDivElement>()));
    }
    const containerRef = useRef<HTMLDivElement>(null);

    // 3) renderGrid helper
    const renderGrid = (cols: number, finalFlags: boolean[]) => (
        <div className="position-relative flex-grow-1" style={{ zIndex: 1, minHeight: 0 }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    columnGap: isMobile ? '-2.75rem' : '2rem',
                    paddingLeft: isMobile && type === 'left'   ? '1.375rem' : undefined,
                    paddingRight: isMobile && type === 'right' ? '1.375rem' : undefined,
                }}
            >
                {roundSeq.map((roundGames, idx) => {
                    const logicalRound = type === 'right' ? maxRounds - idx - 1 : idx;
                    const refs         = gameRefs.current![idx];
                    const isFinalRound = finalFlags[idx];

                    return (
                        <div
                            key={idx}
                            className="px-2 d-flex flex-column"
                            style={
                                isMobile
                                    ? (type === 'left'
                                        ? { marginLeft: '-1.375rem' }
                                        : { marginRight: '-1.375rem' })
                                    : undefined
                            }
                        >
                            <Round
                                seeds={seeds}
                                gamesData={roundGames}
                                picks={userData?.matchups[logicalRound]}
                                final={isFinalRound}
                                number={idx}
                                maxRounds={maxRounds}
                                type={type}
                                gameRefs={refs}
                                onSeedClick={(displayIdx, seed) => {
                                    const game = roundGames[displayIdx];
                                    onAdvanceTeam?.(game, logicalRound, game.gameNumber, seed);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // ─── 1) Final + Mobile: act just like a 2-col left-type Normal ─────────────────────────
    if (isFinal && isMobile) {
        return (
            <div ref={containerRef} className="position-relative mb-4 d-flex flex-column h-100">
                <Connector
                    gameRefs={gameRefs.current!}
                    containerRef={containerRef}
                    type="left"
                    isFinalRegion={false}
                />
                {renderGrid(2, [false, true])}
            </div>
        );
    }

    // ─── 2) Final + Desktop: your three-section semis / champ / semis layout ─────────────────
    if (isFinal) {
        const [semis, finals] = roundSeq;
        const [semiRefs, finalRefs] = gameRefs.current!;

        const sections = [
            { key: 'left-semi',   games: [semis[0]], final: false, number: 0, type: 'left' as const,  refs: [semiRefs[0]], px: 2 },
            { key: 'championship', games:    finals,     final: true,  number: 1, type: 'left' as const,  refs: finalRefs,   px: 4 },
            { key: 'right-semi',  games: [semis[1]], final: false, number: 0, type: 'right' as const, refs: [semiRefs[1]], px: 2 },
        ];

        return (
            <div ref={containerRef} className="position-relative mb-0 d-flex flex-column h-100">
                <Connector gameRefs={gameRefs.current!} containerRef={containerRef} isFinalRegion />
                <div className="d-flex justify-content-between align-items-center flex-grow-1">
                    {sections.map(sec => {
                        const logicalRound = sec.type === 'right'
                            ? maxRounds - sec.number - 1
                            : sec.number;

                        return (
                            <div key={sec.key} className={`px-${sec.px} w-100`}>
                                <Round
                                    seeds={seeds}
                                    gamesData={sec.games}
                                    picks={userData?.matchups[logicalRound]}
                                    final={sec.final}
                                    number={sec.number}
                                    maxRounds={maxRounds}
                                    type={type}
                                    gameRefs={sec.refs}
                                    onSeedClick={(displayIdx, seed) => {
                                        const game = sec.games[displayIdx];
                                        onAdvanceTeam?.(game, logicalRound, game.gameNumber, seed);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ─── 3) Normal region (any screen) ──────────────────────────────────────────────────────
    return (
        <div ref={containerRef} className="position-relative mb-4 d-flex flex-column h-100">
            {!isMobile && (
                <h2
                    className="position-absolute top-50 start-50 translate-middle text-uppercase fw-semibold text-muted"
                    style={{ zIndex: 2, pointerEvents: 'none' }}
                >
                    {name}
                </h2>
            )}

            <Connector
                gameRefs={gameRefs.current!}
                containerRef={containerRef}
                type={type}
                isFinalRegion={false}
            />

            {renderGrid(maxRounds, Array(maxRounds).fill(false))}
        </div>
    );
};

export default Region;
