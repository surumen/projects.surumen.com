// components/Round.tsx

import React from 'react';
import Game from './Game';
import type { RoundProps } from '@/types';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';

const Round: React.FC<RoundProps> = ({
                                         seeds,
                                         gamesData,
                                         final = false,
                                         number,
                                         maxRounds = 0,
                                         type = 'left',
                                         gameRefs,
                                         picks,
                                         onSeedClick,
                                         rowCount,   // ← new prop
                                         spacing,    // ← new prop
                                     }) => {
    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;

    const singleGame = gamesData.length === 1;

    // Mirror round index for right-facing alignment
    const effectiveRound = type === 'right'
        ? maxRounds - number - 1
        : number;

    const isBaseline =
        !final &&
        ((type === 'left' && number === 0) ||
            (type === 'right' && number === maxRounds - 1));

    return (
        <div
            className="flex-grow-1 h-100"
            style={{
                display: 'grid',
                gridTemplateRows: `repeat(${rowCount}, 1fr)`,
                ...(isMobile ? { rowGap: '1.75rem' } : {}),
            }}
        >
            {gamesData.map((game, idx) => {
                // center single game, otherwise use uniform spacing
                const rowStart = singleGame
                    ? Math.ceil(rowCount / 2)
                    : Math.round(spacing * (idx + 1));

                // pull out exactly one tuple per game
                const tuple = picks?.[idx];
                const participants = tuple
                    ? [
                        seeds[tuple[0]] ?? undefined,
                        seeds[tuple[1]] ?? undefined,
                    ] as [typeof seeds[number]?, typeof seeds[number]?]
                    : undefined;

                return (
                    <div
                        key={idx}
                        ref={gameRefs?.[idx]}
                        style={{ gridRowStart: rowStart }}
                    >
                        <Game
                            seeds={seeds}
                            game={game}
                            type={type}
                            participants={participants}
                            onSeedClick={(seed) => onSeedClick?.(idx, seed)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Round;
