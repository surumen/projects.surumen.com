// components/Team.tsx

import React from 'react';
import type { TeamProps } from '@/types';

const Team: React.FC<TeamProps> = ({
                                       name = '',
                                       seed,
                                       displayName,
                                       displayNamePredicted,
                                       position,
                                       type = 'left',
                                       color = 'secondary',
                                       abbreviation,
                                       logo,
                                       onClick,
                                   }) => {
    const isRight = type === 'right';

    // Use predicted label if provided
    const label = displayNamePredicted ?? displayName;

    // Border / rounding classes
    const borderSide = isRight ? 'border-end' : 'border-start';
    const roundTop = position === 'top'
        ? isRight ? 'rounded-top-start' : 'rounded-top-end'
        : '';
    const roundBottom = position === 'bottom'
        ? isRight ? 'rounded-bottom-start' : 'rounded-bottom-end'
        : '';

    const classes = [
        'list-group-item',
        'd-flex',
        isRight ? 'justify-content-end' : 'justify-content-start',
        'align-items-center',
        'bg-light',
        'text-body',
        'border-0',
        borderSide,
        'border-5',
        `border-${color}`,
        roundTop,
        roundBottom,
        'px-2',
        'py-1',
        'cursor-pointer',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick} aria-label={`${name} (Seed ${seed})`}>
            {isRight && logo && (
                <img src={logo} alt={`${label} logo`} style={{ height: 24, marginRight: 8 }} />
            )}
            {isRight ? (
                <>
                    <span>{label}</span>
                    <span className="badge bg-secondary rounded-pill ms-2">
            {seed}
          </span>
                </>
            ) : (
                <>
          <span className="badge bg-secondary rounded-pill me-2">
            {seed}
          </span>
                    <span>{label}</span>
                    {!isRight && logo && (
                        <img src={logo} alt={`${label} logo`} style={{ height: 24, marginLeft: 8 }} />
                    )}
                </>
            )}
        </div>
    );
};

export default Team;
