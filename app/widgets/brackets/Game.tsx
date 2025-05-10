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
                                       gameIndex,
                                       onSeedClick,
                                   }) => {
    const isRight = type === 'right';

    const containerClass = [
        'list-group',
        'list-group-sm',
        'mt-n3',
        'm-0',
        'shadow',
        isRight ? 'text-end rounded-start' : 'text-start rounded-end',
    ].join(' ');

    const fmt = (slug = '') =>
        slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const team1 = seeds[firstSeed];
    const team2 = seeds[secondSeed];

    const summarySeeds: Record<number, { name: string }> = {
        [firstSeed]: { name: team1?.name ?? '' },
        [secondSeed]: { name: team2?.name ?? '' },
    };

    const name1 = team1?.shortName ?? team1?.name ?? '';
    const name2 = team2?.shortName ?? team2?.name ?? '';

    return (
        <div className={`d-flex ${isRight ? 'justify-content-end' : 'justify-content-start'}`}>
            <button className={`w-100 border-0 rounded-0 p-0 ${containerClass}`}>
                <Team
                    name={team1?.name}
                    seed={firstSeed}
                    displayName={name1}
                    position="top"
                    type={type}
                    logo={team1?.logo}
                    color={team1?.color}
                    onClick={() => onSeedClick?.(firstSeed)}
                />

                <Team
                    name={team2?.name}
                    seed={secondSeed}
                    displayName={name2}
                    position="middle"
                    type={type}
                    logo={team2?.logo}
                    color={team2?.color}
                    onClick={() => onSeedClick?.(secondSeed)}
                />

                 {/*<GameSelector games={games} seeds={summarySeeds} type={type} />*/}
            </button>
        </div>
    );
};

export default Game;
