// components/Round.tsx
import React from 'react';
import Game from './Game';
import type { RoundProps } from '@/types';

interface RoundWithRefsProps extends RoundProps {
    /** Refs to each Game container in this round */
    gameRefs?: React.RefObject<HTMLDivElement>[];
}

const Round: React.FC<RoundWithRefsProps> = ({
                                                 seeds,
                                                 pairings,
                                                 games,
                                                 gamesPredicted,
                                                 pairingsPredicted = [],
                                                 final = false,
                                                 number,
                                                 maxRounds = 0,
                                                 type = 'left',
                                                 champion,
                                                 gameRefs,
                                             }) => {
    // pairings come in as a flat array: turn into [[a,b], [c,d], …]
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

    // grid rows = baselineGames * 2 + 1
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
                const firstSeed =
                    typeof rawA === 'number' ? rawA : (rawA as [string, number])[1];
                const secondSeed =
                    typeof rawB === 'number' ? rawB : (rawB as [string, number])[1];

                const predA = pairingsPredicted[idx * 2];
                const predB = pairingsPredicted[idx * 2 + 1];
                const firstSeedPredicted = Array.isArray(predA)
                    ? predA[1]
                    : (predA as number) || 0;
                const secondSeedPredicted = Array.isArray(predB)
                    ? predB[1]
                    : (predB as number) || 0;

                const rowStart = singleGame
                    ? Math.ceil(totalRows / 2)
                    : isBaseline
                        ? idx * 2 + 2
                        : idx * 4 + 3;

                return (
                    <div
                        key={idx}
                        ref={gameRefs?.[idx]}
                        style={{ gridRowStart: rowStart }}
                    >
                        <Game
                            seeds={seeds as Record<number, string>}
                            firstSeed={firstSeed}
                            secondSeed={secondSeed}
                            type={type}
                            games={games?.[idx] || []}
                            gamesPredicted={gamesPredicted?.[idx] || 0}
                            firstSeedPredicted={firstSeedPredicted}
                            secondSeedPredicted={secondSeedPredicted}
                            final={final}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Round;
