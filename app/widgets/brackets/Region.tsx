import React, { useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import Round from './Round';
import type { RegionProps, GameData } from '@/types';
import Connector from '@/widgets/brackets/Connector';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';

const Region: React.FC<RegionProps> = ({
                                           name,
                                           type = 'left',
                                           seeds,
                                           games,         // flat GameData[]
                                           isFinal = false,
                                           userData,
                                           onAdvanceTeam,
                                       }) => {

    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;

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
    const scrollRef    = useRef<HTMLDivElement>(null);
    const connectorRef = isMobile ? scrollRef : containerRef;

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
                            picks={userData?.matchups[0]}
                            final
                            number={0}
                            maxRounds={1}
                            type="left"
                            gameRefs={refs}
                            onSeedClick={(_, seed) =>
                                onAdvanceTeam?.(champGame, 0, champGame.gameNumber, seed)
                            }
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
                                    picks={userData?.matchups[logicalRound]}
                                    final={sec.final}
                                    number={sec.number}
                                    maxRounds={maxRounds}
                                    type={sec.type}
                                    gameRefs={sec.refs}
                                    onSeedClick={(displayIdx, seed) => {
                                        const game  = sec.games[displayIdx];
                                        onAdvanceTeam?.(
                                            game,
                                            logicalRound,
                                            game.gameNumber,
                                            seed
                                        );
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // NORMAL region layout
    // inside your NORMAL-region return, before you map:
    const roundCount = roundSeq.length
    // floor so you don’t exceed 12 columns; if you have e.g. 5 rounds → 12/5 = 2.4 → 2 cols each
    const mobileColSpan = Math.floor(12 / roundCount) || 1

    return (
        <div ref={containerRef} className="position-relative mb-4 d-flex flex-column h-100">
            { !isMobile && (
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

            <div
                className="position-relative flex-grow-1"
                style={{ zIndex: 1, minHeight: 0 }}
            >
                <div
                    // keep it a CSS grid even on mobile
                    style={{
                        display: 'grid',
                        // make all rounds shrink equally to fit the container
                        gridTemplateColumns: `repeat(${roundCount}, minmax(0, 1fr))`,
                        // negative gap on mobile for overlap, small positive gap on desktop
                        columnGap: isMobile ? '-2.75rem' : '1rem',
                        // push the entire first column back in by half the overlap
                        paddingLeft: isMobile && type === 'left' ? '1.375rem' : undefined,
                        paddingRight: isMobile && type === 'right' ? '1.375rem' : undefined,
                    }}
                >
                    {roundSeq.map((roundGames, idx) => {
                        const logicalRound = type === 'right'
                            ? maxRounds - idx - 1
                            : idx;
                        const refs = gameRefs.current![idx];

                        return (
                            <div
                                key={idx} className="px-2 d-flex flex-column"
                                style={
                                    isMobile
                                        ? // bump this Round inward by half the overlap
                                            type === 'left'
                                            ? { marginLeft: '-1.375rem' }
                                            : { marginRight: '-1.375rem' }
                                        : undefined
                                }
                            >
                                <Round
                                    seeds={seeds}
                                    gamesData={roundGames}
                                    picks={userData?.matchups[logicalRound]}
                                    final={false}
                                    number={idx}
                                    maxRounds={maxRounds}
                                    type={type}
                                    gameRefs={refs}
                                    onSeedClick={(displayIdx, seed) => {
                                        const game = roundGames[displayIdx];
                                        onAdvanceTeam?.(
                                            game,
                                            logicalRound,
                                            game.gameNumber,
                                            seed
                                        );
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Region;
