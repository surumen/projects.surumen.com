// components/GameSelector.tsx
import React from 'react';
import type { GameSelectorProps } from '@/types';

const GameSelector: React.FC<GameSelectorProps> = ({
                                                       games = [],
                                                       seeds = {},
                                                       gamesPredicted = 0,
                                                       type = 'left',
                                                   }) => {
    const isRight = type === 'right';

    // 1) build badges 1…7
    let options = Array.from({ length: 7 }, (_, idx) => {
        const seq = idx + 1;
        const seed = games[idx];
        const played = seed != null && seed in seeds;
        const isPred = seq === gamesPredicted;

        let cls = 'badge rounded-circle text-center';
        cls += played
            ? ' bg-soft-secondary text-secondary'
            : ' bg-soft-secondary text-secondary';
        if (isPred) cls += ' bg-soft-secondary text-primary';

        return (
            <span key={idx} className={cls} data-value={seed ?? idx}>
        {seq}
      </span>
        );
    });

    // 2) if right, flip the order -> [7,6,…,1]
    if (isRight) options = options.reverse();

    // 3) container swaps justify & border/corner side as before
    const containerClass = [
        'list-group-item',
        'd-flex',
        'flex-wrap',
        isRight ? 'justify-content-end' : 'justify-content-center',
        'gap-1',
        'align-items-center',
        'rounded-0',
        isRight ? 'rounded-bottom-start' : 'rounded-bottom-end',
        'bg-light',
        'text-body',
        'border-0',
        isRight ? 'border-end' : 'border-start',
        'border-5',
        'border-light',
        'px-2',
        'py-2',
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={containerClass}>{options}</div>;
};

export default GameSelector;
