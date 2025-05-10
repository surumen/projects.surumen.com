import React from 'react';
import Team from './Team';
import GameSelector from './GameSelector';
import type { GameProps } from '@/types';

const Game: React.FC<GameProps> = ({
                                       seeds,
                                       firstSeed,
                                       secondSeed,
                                       games = [],
                                       type = 'left',
                                   }) => {
    const isLeft = type === 'right';

    const containerClass = [
        'list-group',
        'list-group-sm',
        'mt-n3',
        'm-0',
        'shadow',
        isLeft ? 'text-end rounded-start' : 'text-start rounded-end',
    ].join(' ');

    const fmt = (slug = '') =>
        slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const team1 = seeds[firstSeed];
    const team2 = seeds[secondSeed];

    const name1 = fmt(team1?.name ?? '');
    const name2 = fmt(team2?.name ?? '');

    const summarySeeds: Record<number, { name: string }> = {
        [firstSeed]: { name: team1?.name ?? '' },
        [secondSeed]: { name: team2?.name ?? '' },
    };

    return (
        <button className={`border-0 rounded-0 p-0 shadow ${containerClass}`}>
            <Team
                name={team1?.name}
                seed={firstSeed}
                displayName={name1}
                position="top"
                type={type}
                logo={team1?.logo}
                color={team1?.color}
            />

            <Team
                name={team2?.name}
                seed={secondSeed}
                displayName={name2}
                position="middle"
                type={type}
                logo={team2?.logo}
                color={team2?.color}
            />

            <GameSelector
                games={games}
                seeds={summarySeeds}
                type={type}
            />
        </button>
    );
};

export default Game;
