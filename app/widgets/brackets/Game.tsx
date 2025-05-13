import React from 'react';
import Team from './Team';
import type { GameProps, SeedMeta } from '@/types';

// Ensure participants is always exactly two SeedMeta objects
const EMPTY_SEED: SeedMeta = { name: 'TBD' };

const Game: React.FC<GameProps> = ({
                                       seeds,
                                       game,
                                       participants,
                                       type = 'left',
                                       onSeedClick,
                                   }) => {
    // participants is guaranteed to always be [SeedMeta, SeedMeta]
    const [teamA, teamB]: [SeedMeta, SeedMeta] = participants;

    const seedA = teamA.seed!;
    const seedB = teamB.seed!;

    const textClass =
        type === 'right'
            ? 'text-end'
            : type === 'left'
                ? 'text-start'
                : 'text-center';

    const roundedClass =
        type === 'right'
            ? 'rounded-0 rounded-start'
            : type === 'left'
                ? 'rounded-0 rounded-end'
                : 'rounded';

    return (
        <div className={`d-flex ${type === 'right' ? 'justify-content-end' : 'justify-content-start'}`}>
            <button
                className={`border-0 ${roundedClass} p-0 list-group list-group-sm mt-n3 m-0 shadow ${textClass}`}
                style={{ minWidth: '10rem', maxWidth: '10rem' }}
            >
                <Team
                    name={teamA.name}
                    seed={seedA}
                    displayName={teamA.shortName ?? teamA.name}
                    position="top"
                    type={type}
                    logo={teamA.logo}
                    color={teamA.color}
                    onClick={() => onSeedClick?.(teamA)}
                />
                <Team
                    name={teamB.name}
                    seed={seedB}
                    displayName={teamB.shortName ?? teamB.name}
                    position="bottom"
                    type={type}
                    logo={teamB.logo}
                    color={teamB.color}
                    onClick={() => onSeedClick?.(teamB)}
                />
            </button>
        </div>
    );
};

export default Game;
