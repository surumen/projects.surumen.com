import React from 'react';
import Team from './Team';
import type { GameProps, SeedMeta } from '@/types';

// Ensure participants is always exactly two SeedMeta objects
const EMPTY_SEED: SeedMeta = { name: 'TBD' };

const Game: React.FC<GameProps> = ({
                                       seeds,
                                       game,
                                       participants,
                                       type = 'left',
                                       onSeedClick,
                                   }) => {
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

    return (
        <div className={`d-flex ${type === 'right' ? 'justify-content-end' : 'justify-content-start'}`}>
            <button
                className={`border-0 ${roundedClass} p-0 list-group list-group-sm mt-n3 m-0 shadow ${textClass}`}
                style={{ minWidth: '10rem', maxWidth: '10rem' }}
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
            </button>
        </div>
    );
};

export default Game;
