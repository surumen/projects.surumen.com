import React, { useMemo } from 'react';
import type { TeamProps } from '@/types';

// Bootstrap color variants for border

const Team: React.FC<TeamProps> = ({
                                       name = '',
                                       seed,
                                       displayName,
                                       position,
                                       type = 'left',
                                       color = 'secondary',
                                   }) => {

    const isRight = type === 'right';

    // Final values (predicted override is planned but unused here)
    const badgeSeed = seed;
    const teamDisplay = displayName;

    // Determine border and rounding direction
    const borderSideClass = isRight ? 'border-end' : 'border-start';
    const roundTopEndClass =
        position === 'top'
            ? isRight
                ? 'rounded-top-start'
                : 'rounded-top-end'
            : undefined;
    const roundBottomEndClass =
        position === 'bottom'
            ? isRight
                ? 'rounded-bottom-start'
                : 'rounded-bottom-end'
            : undefined;

    const classes = [
        'list-group-item',
        'rounded-0',
        roundTopEndClass,
        roundBottomEndClass,
        'bg-light',
        'text-body',
        'border-0',
        borderSideClass,
        'border-5',
        `border-${color}`,
        'px-1',
        'py-2',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            {isRight ? (
                <>
                    {teamDisplay}
                    <span className="badge bg-secondary rounded-pill ms-1">
                        {badgeSeed}
                    </span>
                </>
            ) : (
                <>
                    <span className="badge bg-secondary rounded-pill me-1">
                        {badgeSeed}
                    </span>
                    {teamDisplay}
                </>
            )}
        </div>
    );
};

export default Team;
