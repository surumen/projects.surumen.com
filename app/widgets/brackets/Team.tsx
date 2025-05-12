import React from 'react';
import type { TeamProps } from '@/types';
import { Image } from 'react-bootstrap';

const Team: React.FC<TeamProps> = ({
                                       name = '',
                                       seed = 0,
                                       displayName = '',
                                       displayNamePredicted,
                                       position,
                                       type = 'left',
                                       color = 'secondary',
                                       logo,
                                       onClick,
                                   }) => {
    const isRight = type === 'right';
    const label = displayNamePredicted ?? displayName;

    const borderSide = isRight ? 'border-end' : 'border-start';
    const roundTop = position === 'top' ? (isRight ? 'rounded-top-start' : 'rounded-top-end') : '';
    const roundBottom = position === 'bottom' ? (isRight ? 'rounded-bottom-start' : 'rounded-bottom-end') : '';

    const paddingX = isRight ? 'ps-2 pe-0' : 'pe-2 ps-0';

    const classes = [
        'list-group-item',
        'w-100',
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
    ].join(' ');

    return (
        <div className={classes} onClick={onClick} aria-label={`${name} (Seed ${seed})`}>
            <div className={`row align-items-center gx-1 flex-nowrap ${isRight ? 'justify-content-end' : 'justify-content-start'}`} style={{ width: '100%' }}>
                {!isRight && logo && (
                    <div className="col-auto p-0 ps-2">
                        <Image className="avatar avatar-xss" src={logo} alt={`${label} logo`} />
                    </div>
                )}
                {!isRight && (
                    <div className="col-auto p-0">
                        <span className="badge bg-transparent text-muted fw-light">{seed}</span>
                    </div>
                )}
                <div className="col text-truncate p-0">
                    <span>{label}</span>
                </div>
                {isRight && (
                    <div className="col-auto p-0">
                        <span className="badge bg-transparent text-muted fw-light">{seed}</span>
                    </div>
                )}
                {isRight && logo && (
                    <div className="col-auto p-0 pe-2">
                        <Image className="avatar avatar-xss" src={logo} alt={`${label} logo`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
