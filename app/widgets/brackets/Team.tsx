// components/Team.tsx

import React from 'react';
import type { TeamProps } from '@/types';
import { Image } from 'react-bootstrap';

const Team: React.FC<TeamProps> = ({
                                       name = '',
                                       seed = 0,
                                       displayName= '',
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

    const paddingX = isRight ? 'px-2 pe-0' : 'px-2 ps-0';

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
        'rounded-0',
        roundTop,
        roundBottom,
        paddingX,
        'py-1',
        'cursor-pointer',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick} aria-label={`${name} (Seed ${seed})`}>
            {isRight ? (
                <>
                    <div className='d-flex align-items-center'>
                        <span>{label}</span>
                        <span className="badge bg-transparent text-muted fw-light rounded-pill ms-1">
                            {seed}
                        </span>
                        {logo && (
                            <span className="badge bg-transparent rounded-pill">
                                <Image
                                    className='avatar avatar-xss me-2'
                                    src={logo}
                                    alt={`${label} logo`}
                                />
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className='d-flex align-items-center'>
                        {logo && (
                            <span className="badge bg-transparent rounded-pill">
                                <Image
                                    className='avatar avatar-xss'
                                    src={logo}
                                    alt={`${label} logo`}
                                />
                            </span>
                        )}
                        <span className="badge bg-transparent text-muted fw-light rounded-pill me-1">
                            {seed}
                        </span>
                        <span>{label}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Team;
