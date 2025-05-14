import React from 'react';
import Team from './Team';
import type { GameProps, SeedMeta } from '@/types';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';


const Game: React.FC<GameProps> = ({
                                       game,
                                       participants,
                                       type = 'left',
                                       onSeedClick,
                                       renderGameHeader,
                                       renderGameFooter
                                   }) => {
    const hasMounted    = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile      = hasMounted && isMobileQuery;

    const [teamA, teamB]: [SeedMeta, SeedMeta] = participants;

    // Extract scores & penalties (if present)
    const scoreA = game.finalScore?.[0] ?? 0;
    const scoreB = game.finalScore?.[1] ?? 0;
    const penA   = game.penalties?.[0];
    const penB   = game.penalties?.[1];

    // Determine winners based on the game.winnerSeed
    const winnerSeed = game.winnerSeed?.seed;
    const isWinnerA  = teamA.seed === winnerSeed;
    const isWinnerB  = teamB.seed === winnerSeed;


    const textClass =
        type === 'right'
            ? 'text-end'
            : type === 'left'
                ? 'text-start'
                : 'text-center';

    const roundedClass =
        type === 'right'
            ? 'rounded-0 rounded-start'
            : type === 'left'
                ? 'rounded-0 rounded-end'
                : 'rounded';

    const width = !isMobile && !game.isSeries ? '10rem' :
        !isMobile && game.isSeries ? '12rem': '10rem';

    return (
        <div className={`d-flex ${type === 'right' ? 'justify-content-end' : 'justify-content-start'}`}>
            {renderGameHeader && (
                renderGameHeader(game, type)
            )}
            <button
                className={`border-0 ${roundedClass} p-0 list-group list-group-sm mt-n3 m-0 shadow ${textClass}`}
                style={{ minWidth: width, maxWidth: width }}
            >
                <Team
                    team={teamA}
                    position="top"
                    type={type}
                    score={scoreA}
                    isWinner={isWinnerA}
                    penaltyGoals={penA}
                    onClick={() => onSeedClick?.(teamA)}
                />
                <Team
                    team={teamB}
                    position="bottom"
                    type={type}
                    score={scoreB}
                    isWinner={isWinnerB}
                    penaltyGoals={penB}
                    onClick={() => onSeedClick?.(teamB)}
                />
                {renderGameFooter && (
                    renderGameFooter(game, type)
                )}
            </button>
        </div>
    );
};

export default Game;
