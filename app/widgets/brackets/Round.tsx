import React from 'react';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import type { RoundProps } from '@/types';
import Game from './Game';

const Round: React.FC<RoundProps> = ({
                                         seeds,
                                         gamesData,
                                         type = 'left',
                                         pick,
                                         onSeedClick,
                                     }) => {
    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;

    // only game in this Round
    const game = gamesData[0];

    // did the user actually pick a non-zero pair?
    const hasPick = !!pick && (pick[0] !== 0 || pick[1] !== 0);

    // build the seed tuple safely
    let tuple: [number, number];
    if (hasPick) {
        tuple = pick!;
    } else if (game.firstSeed && game.secondSeed) {
        tuple = [game.firstSeed.seed!, game.secondSeed.seed!];
    } else {
        // fallback for final region games without first/second seeds
        tuple = [0, 0];
    }

    // lookup the full metadata
    const participants = tuple.map(s => seeds[s]) as [
        typeof seeds[number],
        typeof seeds[number]
    ];

    return (
        <div
            className="d-grid"
            style={{
                gridTemplateRows: 'auto 1fr',
                rowGap: isMobile ? '2.5rem' : '1rem',
            }}
        >
            <div>
                <Game
                    seeds={seeds}
                    game={game}
                    type={type}
                    participants={participants}
                    onSeedClick={onSeedClick}
                />
            </div>
        </div>
    );
};

export default Round;
