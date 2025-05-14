import React from 'react';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import type { RoundProps, SeedMeta } from '@/types';
import Game from './Game';

const EMPTY_SEED: SeedMeta = { name: '' };

const Round: React.FC<RoundProps> = ({
                                         gamesData,
                                         type = 'left',
                                         pick,
                                         onSeedClick,
                                         renderGameHeader,
                                         renderGameFooter
                                     }) => {
    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;

    // only game in this Round
    const game = gamesData[0];

    // determine if user has a valid metadata pick
    const hasMetaPick = !!pick && (pick[0] !== null || pick[1] !== null);

    // build the participants tuple of SeedMeta, never null
    const participants: [SeedMeta, SeedMeta] = hasMetaPick
        ? [pick![0] ?? EMPTY_SEED, pick![1] ?? EMPTY_SEED]
        : [game.firstSeed ?? EMPTY_SEED, game.secondSeed ?? EMPTY_SEED];


    return (
        <div
            className="d-grid"
            style={{
                gridTemplateRows: 'auto 1fr',
                rowGap: isMobile ? '2rem' : '1rem',
            }}
        >
            <div>
                <Game
                    game={game}
                    type={type}
                    participants={participants}
                    onSeedClick={onSeedClick}
                    renderGameHeader={renderGameHeader}
                    renderGameFooter={renderGameFooter}
                />
            </div>
        </div>
    );
};

export default Round;
