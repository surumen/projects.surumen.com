// components/Team.tsx
import React, { useMemo } from 'react';
import type { TeamProps } from '@/types';

// Bootstrap color variants for border
const variants = ['primary','secondary','success','danger','warning','info','dark'];

/**
 * Team component renders a list-group item with a left border color,
 * displays seed and team name, and handles predicted name/seed.
 */
const Team: React.FC<TeamProps> = ({
                                   name = '',
                                   seed,
                                   displayName,
                                   namePredicted,
                                   seedPredicted,
                                   displayNamePredicted,
                                   position,
                                   type = 'left'
}) => {
    // random Bootstrap variant
    const color = useMemo(
        () => variants[Math.floor(Math.random() * variants.length)],
        []
    );

    // predicted overrides actual
    const isPredicted = Boolean(namePredicted);
    const badgeSeed = isPredicted ? seedPredicted! : seed;
    const teamDisplay = isPredicted ? displayNamePredicted! : displayName;

    const isRight = type === 'right';

    // pick which side to draw the colored border on…
    const borderSideClass = isRight ? 'border-end' : 'border-start';
    // …and which corners to round on that same “outer” side:
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
        'rounded-0',          // reset default rounding
        roundTopEndClass,     // round one corner if top
        roundBottomEndClass,  // round one corner if bottom
        'bg-light',
        'text-body',
        'border-0',           // remove all other borders
        borderSideClass,      // add colored border on start/end
        'border-5',           // thickness
        `border-${color}`,    // random color
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
