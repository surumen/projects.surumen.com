// components/Game.tsx
import React from 'react';
import Team from './Team';
import GameSelector from './GameSelector';
import type { GameProps } from '@/types';

const Game: React.FC<GameProps> = ({
                                       seeds,
                                       firstSeed,
                                       secondSeed,
                                       games = [],
                                       gamesPredicted = 0,
                                       firstSeedPredicted = 0,
                                       secondSeedPredicted = 0,
                                       type = 'left',         // default to left bracket
                                   }) => {
    const isLeft = type === 'right';

    // build container classes dynamically
    const containerClass = [
        'list-group',
        'list-group-sm',
        'mt-n3',
        'm-0',
        'shadow',
        // swap text-align, rounding, and border side:
        isLeft
            ? 'text-end rounded-start'
            : 'text-start rounded-end',
    ].join(' ');

    const fmt = (slug = '') =>
        slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // actual slugs & display names
    const slug1 = seeds[firstSeed] ?? '';
    const slug2 = seeds[secondSeed] ?? '';
    const name1 = fmt(slug1);
    const name2 = fmt(slug2);

    // predicted
    const slug1p = seeds[firstSeedPredicted] ?? '';
    const slug2p = seeds[secondSeedPredicted] ?? '';
    const name1p = fmt(slug1p);
    const name2p = fmt(slug2p);

    const summarySeeds: Record<number, { name: string }> = {
        [firstSeed]: { name: slug1 },
        [secondSeed]: { name: slug2 },
    };

    return (
        <button className={`border-0 rounded-0 p-0 shadow ${containerClass}`}>
            <Team
                name={slug1}
                seed={firstSeed}
                displayName={name1}
                namePredicted={slug1p || undefined}
                seedPredicted={slug1p ? firstSeedPredicted : undefined}
                displayNamePredicted={slug1p ? name1p : undefined}
                position="top"
                type={type}
            />

            <Team
                name={slug2}
                seed={secondSeed}
                displayName={name2}
                namePredicted={slug2p || undefined}
                seedPredicted={slug2p ? secondSeedPredicted : undefined}
                displayNamePredicted={slug2p ? name2p : undefined}
                position="middle"
                type={type}
            />

            <GameSelector
                games={games}
                seeds={summarySeeds}
                gamesPredicted={gamesPredicted}
                type={type}
            />
        </button>
    );
};

export default Game;
