// app/widgets/brackets/Team.tsx

import React from 'react';
import { Image } from 'react-bootstrap';
import type { TeamProps } from '@/types';

const Team: React.FC<TeamProps> = ({
  team,
  game,
  position,
  isSelected,
  isWinner,
  onClick,
  disabled = false,
  type = 'left',
  showScore = false
}) => {
  const isRight = type === 'right';
  const isLeft = type === 'left';
  
  // Team display logic
  const displayName = team.shortName || team.name;
  const seed = team.seed || 0;
  const color = team.color && isWinner ? team.color : 'light';
  
  // Score logic
  const scoreIndex = position === 'top' ? 0 : 1;
  const score = game.finalScore?.[scoreIndex] ?? 0;
  const penalties = game.penalties?.[scoreIndex];
  
  // Styling classes
  const borderSide = isRight
    ? 'border-end'
    : isLeft
      ? 'border-start'
      : '';
      
  const border = game.isFinal 
    ? 'ps-2' 
    : `border-5 border-${color} ${borderSide}`;
    
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
      
  const justifyContent = isRight 
    ? 'justify-content-end' 
    : isLeft 
      ? 'justify-content-start' 
      : 'justify-content-center';

  const classes = [
    'list-group-item',
    'w-100',
    'd-flex',
    justifyContent,
    'align-items-center',
    'bg-light',
    'text-body',
    'border-0',
    border,
    isLeft || isRight ? 'rounded-0' : 'rounded',
    roundTop,
    roundBottom,
    paddingX,
    'py-1',
    disabled ? 'cursor-default' : 'cursor-pointer',
    isSelected ? 'bg-primary text-white' : '',
  ].filter(Boolean).join(' ');

  const renderSeedOrScore = () => {
    if (!showScore || !game.finalScore) {
      return <span className="badge bg-transparent text-muted fw-light">{seed}</span>;
    }

    // Show scores
    const hasPenalties = penalties != null;
    const scoreClass = hasPenalties
      ? 'text-muted'
      : isWinner
        ? 'fw-bold text-body'
        : 'text-muted';

    const penaltyClass = hasPenalties
      ? isWinner
        ? 'fw-bold text-body ms-1'
        : 'text-muted ms-1'
      : '';

    return (
      <span className="badge bg-transparent fw-light">
        <span className={scoreClass}>{score}</span>
        {hasPenalties && <span className={penaltyClass}>({penalties})</span>}
      </span>
    );
  };

  return (
    <div 
      className={classes} 
      onClick={disabled ? undefined : onClick}
      aria-label={team.name}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <div
        className={`row align-items-center gx-1 flex-nowrap ${justifyContent}`}
        style={{ width: '100%' }}
      >
        {/* Logo - Left side for left regions */}
        {!isRight && team.logo && (
          <div className="col-auto p-0 ps-2">
            <Image
              className="avatar avatar-xss"
              src={team.logo}
              alt={`${displayName} logo`}
            />
          </div>
        )}

        {/* Seed/Score - Left side for left regions */}
        {!isRight && (
          <div className="col-auto p-0">
            {renderSeedOrScore()}
          </div>
        )}

        {/* Team Name - Center */}
        <div className="col text-truncate p-0">
          <span className={isSelected ? 'fw-bold' : ''}>{displayName}</span>
        </div>

        {/* Seed/Score - Right side for right regions */}
        {isRight && (
          <div className="col-auto p-0">
            {renderSeedOrScore()}
          </div>
        )}

        {/* Logo - Right side for right regions */}
        {isRight && team.logo && (
          <div className="col-auto p-0 pe-2">
            <Image
              className="avatar avatar-xss"
              src={team.logo}
              alt={`${displayName} logo`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;