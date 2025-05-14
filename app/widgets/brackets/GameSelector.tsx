import React from 'react';
import type { GameSelectorProps } from '@/types';

const GameSelector: React.FC<GameSelectorProps> = ({
                                                       type = 'left',
                                                   }) => {
    const isRight = type === 'right';

    // 1) build badges 1…7
    let options = Array.from({ length: 7 }, (_, idx) => {
        const seq = idx + 1;

        let cls = 'badge rounded-circle text-center ';
        cls += ' bg-secondary bg-opacity-10 small text-secondary';

        return (
            <span key={idx} className={cls} data-value={idx}>
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
        isRight ? 'justify-content-end' : 'justify-content-start',
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
