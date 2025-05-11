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
                                     }) => {

    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;

    // number of baseline games = total seeds / 2
    const baselineGames = Object.keys(seeds).length / 2;
    const totalRows = baselineGames * 2 + 1;
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
                gridTemplateRows: `repeat(${totalRows}, 1fr)`,
                ...(isMobile ? { rowGap: '1.75rem' } : {}),   // only on mobile
            }}
        >
            {gamesData.map((game, idx) => {
                const spacingPerGame = Math.pow(2, effectiveRound + 1);
                const baseOffset = spacingPerGame / 2;

                const rowStart = singleGame
                    ? Math.ceil(totalRows / 2)
                    : isBaseline
                        ? idx * 2 + 2
                        : idx * spacingPerGame + baseOffset + 1;

                // pull out exactly one tuple per game
                const tuple = picks?.[idx]            // [seedA,seedB] or undefined
                const participants = tuple
                    ? [
                        seeds[tuple[0]] ?? undefined,
                        seeds[tuple[1]] ?? undefined,
                    ] as [typeof seeds[number]?, typeof seeds[number]?]
                    : undefined

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
