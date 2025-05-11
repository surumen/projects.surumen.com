// components/Round.tsx

import React from 'react';
import Game from './Game';
import type { RoundProps } from '@/types';

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

                // if the user pre-picked this entire game, it'll be a [seedA,seedB] tuple
                const participants = picks?.[idx]
                    ? ([ picks[idx][0], picks[idx][1] ] as [number,number])
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
                            participants={participants
                                ? [ seeds[participants[0]], seeds[participants[1]] ]
                                : undefined}
                            onSeedClick={(seed) => onSeedClick?.(idx, seed)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Round;
