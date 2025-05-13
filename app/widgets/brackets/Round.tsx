import React from 'react';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import type { RoundProps, SeedMeta } from '@/types';
import Game from './Game';

const EMPTY_SEED: SeedMeta = { name: '' };

const Round: React.FC<RoundProps> = ({
                                         seeds,
                                         gamesData,
                                         number,
                                         type = 'left',
                                         pick,
                                         onSeedClick,
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

    const verticalOffset = `${(number ?? 0) * (isMobile ? 0.75 : 0.25)}rem`;

    return (
        <div
            className="d-grid"
            style={{
                gridTemplateRows: 'auto 1fr',
                rowGap: isMobile ? '2.5rem' : '1rem',
                marginTop: verticalOffset,
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
