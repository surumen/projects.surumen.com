import React from 'react';
import type { TeamProps } from '@/types';
import { Image } from 'react-bootstrap';

const Team: React.FC<TeamProps> = ({
                                       team,
                                       score,
                                       isWinner,
                                       penaltyGoals,
                                       displayNamePredicted,
                                       position,
                                       type = 'left',
                                       onClick,
                                   }) => {
    const isRight = type === 'right';
    const isLeft  = type === 'left';
    const displayName = team.shortName ?? team.name;
    const label = displayNamePredicted ?? displayName;
    const color = team.color ?? 'secondary';
    const seed  = team.seed ?? 0;

    const borderSide = isRight
        ? 'border-end'
        : isLeft
            ? 'border-start'
            : '';
    const roundTop = position === 'top'
        ? isRight
            ? 'rounded-top-start'
            : isLeft
                ? 'rounded-top-end'
                : 'rounded-top'
        : '';
    const roundBottom = position === 'bottom'
        ? isRight
            ? 'rounded-bottom-start'
            : isLeft
                ? 'rounded-bottom-end'
                : 'rounded-bottom'
        : '';
    const paddingX = isRight
        ? 'ps-2 pe-0'
        : isLeft
            ? 'pe-2 ps-0'
            : 'px-3';

    const classes = [
        'list-group-item',
        'w-100',
        'd-flex',
        isRight ? 'justify-content-end' : isLeft ? 'justify-content-start' : '',
        'align-items-center',
        'bg-light',
        'text-body',
        'border-0',
        borderSide,
        'border-5',
        `border-${color}`,
        isLeft || isRight ? 'rounded-0' : 'rounded',
        roundTop,
        roundBottom,
        paddingX,
        'py-1',
        'cursor-pointer',
    ].join(' ');

    const renderSeedOrScore = () => {
        if (displayNamePredicted || !score) {
            return <span className="badge bg-transparent text-muted fw-light">{seed}</span>;
        }

        // no predicted, show scores
        const hasPen = penaltyGoals != null;
        const scoreClass = hasPen
            // when there are penalties:
            //   if winner, score muted; if loser, score muted
            ? 'text-muted'
            // when no penalties:
            : isWinner
                ? 'fw-bold text-body'
                : 'text-muted';

        const penClass = hasPen
            // when penalties:
            //   if winner, penalties bold; if loser, penalty muted
            ? isWinner
                ? 'fw-bold text-body ms-1'
                : 'text-muted ms-1'
            : '';

        return (
            <>
                <span className="badge bg-transparent fw-light">
                    <span className={scoreClass}>{score}</span>
                    {hasPen && <span className={penClass}>({penaltyGoals})</span>}
                </span>
            </>
        );
    };

    return (
        <div className={classes} onClick={onClick} aria-label={team.name}>
            <div
                className={`row align-items-center gx-1 flex-nowrap ${
                    isRight ? 'justify-content-end' : 'justify-content-start'
                }`}
                style={{ width: '100%' }}
            >
                {!isRight && team.logo && (
                    <div className="col-auto p-0 ps-2">
                        <Image
                            className="avatar avatar-xss"
                            src={team.logo}
                            alt={`${label} logo`}
                        />
                    </div>
                )}

                {!isRight && (
                    <div className="col-auto p-0">
                        {renderSeedOrScore()}
                    </div>
                )}

                <div className="col text-truncate p-0">
                    <span>{label}</span>
                </div>

                {isRight && (
                    <div className="col-auto p-0">
                        {renderSeedOrScore()}
                    </div>
                )}

                {isRight && team.logo && (
                    <div className="col-auto p-0 pe-2">
                        <Image
                            className="avatar avatar-xss"
                            src={team.logo}
                            alt={`${label} logo`}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
