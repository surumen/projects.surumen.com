import React from 'react';
import Team from './Team';
import type { GameProps, SeedMeta } from '@/types';

const Game: React.FC<GameProps> = ({
                                       seeds,
                                       game,
                                       participants, // ← new
                                       type = 'left',
                                       onSeedClick,
                                   }) => {
    let [teamA, teamB]: (SeedMeta|undefined)[] = participants ?? [];

    // if they didn’t come via participants, fall back to firstSeed/secondSeed
    if (!teamA || !teamB) {
        if (game.firstSeed && !teamA) teamA = game.firstSeed;
        if (game.secondSeed && !teamB) teamB = game.secondSeed;
    }

    // derive seed numbers for clicks
    const firstSeedNum = teamA
        ? Number(Object.entries(seeds).find(([n,m])=>m===teamA)?.[0] ?? 0)
        : 0;
    const secondSeedNum = teamB
        ? Number(Object.entries(seeds).find(([n,m])=>m===teamB)?.[0] ?? 0)
        : 0;

    return (
        <div className={`d-flex ${type === 'right' ? 'justify-content-end' : 'justify-content-start'}`}>
            <button
                className={`border-0 rounded-0 p-0 list-group list-group-sm mt-n3 m-0 shadow ${
                    type === 'right' ? 'text-end rounded-start' : 'text-start rounded-end'
                }`}
                style={{ minWidth: '10rem', maxWidth: '10rem' }}
            >
                <Team
                    name={teamA?.name}
                    seed={firstSeedNum}
                    displayName={teamA?.shortName ?? teamA?.name ?? ''}
                    position="top"
                    type={type}
                    logo={teamA?.logo}
                    color={teamA?.color}
                    onClick={() => onSeedClick?.(firstSeedNum)}
                />
                <Team
                    name={teamB?.name}
                    seed={secondSeedNum}
                    displayName={teamB?.shortName ?? teamB?.name ?? ''}
                    position="bottom"
                    type={type}
                    logo={teamB?.logo}
                    color={teamB?.color}
                    onClick={() => onSeedClick?.(secondSeedNum)}
                />
            </button>
        </div>
    );
};

export default Game;
