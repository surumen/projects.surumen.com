import React from 'react';
import Team from './Team';
import type { GameProps } from '@/types';

const Game: React.FC<GameProps> = ({
                                       seeds,
                                       game,
                                       type = 'left',
                                       onSeedClick,
                                   }) => {
    const isRight = type === 'right';

    // Build reverse lookup: slug → seed number
    const slugToSeed = React.useMemo(
        () =>
            Object.fromEntries(
                Object.entries(seeds).map(([num, meta]) => [meta.name, Number(num)])
            ) as Record<string, number>,
        [seeds]
    );

    // Determine the two seed numbers
    let firstSeedNum = 0;
    let secondSeedNum = 0;

    if (game.roundNumber === 0) {
        // Guard against undefined firstSeed/secondSeed
        const nameA = game.firstSeed?.name;
        const nameB = game.secondSeed?.name;
        firstSeedNum = (nameA && slugToSeed[nameA]) || 0;
        secondSeedNum = (nameB && slugToSeed[nameB]) || 0;
    } else {
        // Later rounds: ideally you resolve via game.winnerSeed or from your state
        // Fallback to 0 if not available
        firstSeedNum = game.sourceGame1?.gameNumber ?? 0;
        secondSeedNum = game.sourceGame2?.gameNumber ?? 0;
    }

    const team1 = seeds[firstSeedNum];
    const team2 = seeds[secondSeedNum];

    // Extract score
    const [score1, score2] = game.finalScore ?? [0, 0];

    const containerClass = [
        'list-group',
        'list-group-sm',
        'mt-n3',
        'm-0',
        'shadow',
        isRight ? 'text-end rounded-start' : 'text-start rounded-end',
    ].join(' ');

    return (
        <div className={`d-flex ${isRight ? 'justify-content-end' : 'justify-content-start'}`}>
            <button className={`w-100 border-0 rounded-0 p-0 ${containerClass}`}>
                <Team
                    name={team1?.name}
                    seed={firstSeedNum}
                    displayName={team1?.shortName ?? team1?.name ?? ''}
                    position="top"
                    type={type}
                    logo={team1?.logo}
                    color={team1?.color}
                    onClick={() => onSeedClick?.(firstSeedNum)}
                />
                {/*<div className="text-center">*/}
                {/*    {score1} – {score2}*/}
                {/*</div>*/}
                <Team
                    name={team2?.name}
                    seed={secondSeedNum}
                    displayName={team2?.shortName ?? team2?.name ?? ''}
                    position="middle"
                    type={type}
                    logo={team2?.logo}
                    color={team2?.color}
                    onClick={() => onSeedClick?.(secondSeedNum)}
                />
            </button>
        </div>
    );
};

export default Game;
