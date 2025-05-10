import React from 'react';
import Game from './Game';
import type { RoundProps } from '@/types';

const Round: React.FC<RoundProps> = ({
                                         seeds,
                                         pairings,
                                         games,
                                         final = false,
                                         number,
                                         maxRounds = 0,
                                         type = 'left',
                                         gameRefs,
                                     }) => {
    // Convert flat list of seed refs to pairs: [a, b], [c, d], ...
    const matchTuples: Array<
        [number | [string, number], number | [string, number]]
    > = [];
    for (let i = 0; i < pairings.length; i += 2) {
        matchTuples.push([pairings[i], pairings[i + 1]]);
    }

    const isBaseline =
        !final &&
        ((type === 'left' && number === 0) ||
            (type === 'right' && number === maxRounds - 1));

    const baselineGames = Object.keys(seeds).length / 2;
    const totalRows = baselineGames * 2 + 1;
    const singleGame = matchTuples.length === 1;

    return (
        <div
            className="flex-grow-1 h-100"
            style={{
                display: 'grid',
                gridTemplateRows: `repeat(${totalRows}, 1fr)`,
            }}
        >
            {matchTuples.map((tuple, idx) => {
                const [rawA, rawB] = tuple;
                const firstSeed = typeof rawA === 'number' ? rawA : rawA[1];
                const secondSeed = typeof rawB === 'number' ? rawB : rawB[1];

                // Mirror round index for right-facing alignment
                const effectiveRound = type === 'right'
                    ? maxRounds - number - 1
                    : number;

                const spacingPerGame = Math.pow(2, effectiveRound + 1);
                const baseOffset = spacingPerGame / 2;

                const rowStart = singleGame
                    ? Math.ceil(totalRows / 2)
                    : isBaseline
                        ? idx * 2 + 2
                        : idx * spacingPerGame + baseOffset + 1;

                return (
                    <div
                        key={idx}
                        ref={gameRefs?.[idx]}
                        style={{ gridRowStart: rowStart }}
                    >
                        <Game
                            seeds={seeds}
                            firstSeed={firstSeed}
                            secondSeed={secondSeed}
                            type={type}
                            games={games?.[idx] || []}
                            final={final}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Round;
