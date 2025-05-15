import React, { Fragment } from 'react';
import type { GameSelectorProps } from '@/types';


const variants: string[] = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'];

const GameSelector: React.FC<GameSelectorProps> = ({
                                                       game,
                                                       type = 'left',
                                                       className = 'bg-secondary bg-opacity-10'
                                                   }) => {
    const isRight = type === 'right';

    // 1) build badges 1…7
    let seriesGames = Array.from({ length: 7 }, (_, idx) => {
        const seq = idx + 1;

        return (
            <span key={idx} className={`badge ${className} rounded-circle text-center small`} data-value={idx}>
                {seq}
            </span>
        );
    });

    // 2) if right, flip the order -> [7,6,…,1]
    if (isRight) seriesGames = seriesGames.reverse();

    const border = game.isFinal && game.winnerSeed ? 'border-0' : 'border-0 border-5 border-light';
    const textColor = game.isFinal && game.winnerSeed ? '' : 'text-body';
    const justify = game.isFinal && game.winnerSeed ? 'justify-content-center' : isRight ? 'justify-content-end' : 'justify-content-start';

    const containerClass = [
        'list-group-item',
        'd-flex',
        'flex-wrap',
        justify,
        'gap-1',
        'align-items-center',
        'rounded-0',
        isRight ? 'rounded-bottom-start' : 'rounded-bottom-end',
        textColor,
        isRight ? 'border-end' : 'border-start',
        border,
        'px-2',
        'py-2',
    ]
        .filter(Boolean)
        .join(' ');

    const accentColor = game.winnerSeed?.color
        ? variants.includes(game.winnerSeed?.color)
            ? `bg-${game.winnerSeed?.color} text-white`
            : `bg-accent-${game.winnerSeed?.color} text-white`
        : '';

    return (
        <Fragment>
            {game.isSeries && (
                <div className={`bg-transparent ${containerClass}`}>
                    {seriesGames}
                </div>
            )}
            {game.isFinal && game.winnerSeed && (
                <div className={`${containerClass} ${accentColor}`}>
                    {game.winnerSeed?.shortName}
                </div>
            )}
        </Fragment>
    );
};

export default GameSelector;
