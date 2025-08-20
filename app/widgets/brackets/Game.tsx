// app/widgets/brackets/Game.tsx

import React, { useCallback } from 'react';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import Team from './Team';
import type { GameProps } from '@/types';

// TBD slot component for missing teams
const TBDSlot: React.FC<{ 
  position: 'top' | 'bottom';
  type: 'left' | 'right' | 'center';
}> = ({ position, type }) => {
  const isRight = type === 'right';
  const isLeft = type === 'left';
  
  const roundTop = position === 'top'
    ? isRight ? 'rounded-top-start' : isLeft ? 'rounded-top-end' : 'rounded-top'
    : '';
  const roundBottom = position === 'bottom'
    ? isRight ? 'rounded-bottom-start' : isLeft ? 'rounded-bottom-end' : 'rounded-bottom'
    : '';
  const paddingX = isRight ? 'ps-2 pe-0' : isLeft ? 'pe-2 ps-0' : 'px-3';
  const justifyContent = isRight ? 'justify-content-end' : isLeft ? 'justify-content-start' : 'justify-content-center';

  return (
    <div 
      className={`list-group-item w-100 d-flex ${justifyContent} align-items-center bg-light text-body border-0 border-5 border-light ${isRight ? 'border-end' : isLeft ? 'border-start' : ''} rounded-0 ${roundTop} ${roundBottom} ${paddingX} py-1`}
    >
      <div className={`row align-items-center gx-1 flex-nowrap ${justifyContent}`} style={{ width: '100%' }}>
        <div className="col text-truncate p-0">
          <span className="text-muted">TBD</span>
        </div>
      </div>
    </div>
  );
};

const Game: React.FC<GameProps> = ({
  game,
  type = 'left',
  onTeamAdvance,
  renderGameHeader,
  renderGameFooter
}) => {
  const hasMounted = useMounted();
  const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
  const isMobile = hasMounted && isMobileQuery;

  const isRight = type === 'right';
  const isLeft = type === 'left';

  // Get teams - handle missing teams gracefully
  const team1 = game.team1;
  const team2 = game.team2;
  const hasTeam1 = !!team1;
  const hasTeam2 = !!team2;
  
  // Determine if this game is pickable
  const canPick = game.isPickable;
  
  // Determine winner
  const userPickWinnerId = game.userPick?.winnerId;
  const historicalWinnerId = game.historicalWinner?.id;
  const winnerId = userPickWinnerId || historicalWinnerId;
  
  const isTeam1Winner = !!(team1 && winnerId === team1.id);
  const isTeam2Winner = !!(team2 && winnerId === team2.id);

  // Styling
  const textClass = isRight
    ? 'text-end'
    : isLeft
      ? 'text-start'
      : 'text-center';

  const roundedClass = isRight
    ? 'rounded-0 rounded-start'
    : isLeft
      ? 'rounded-0 rounded-end'
      : 'rounded';

  const justifyContent = isRight 
    ? 'justify-content-end' 
    : 'justify-content-start';

  // Game button width
  const width = !isMobile && !game.isSeries ? '10rem' :
    game.isSeries ? '12rem' : '10rem';

  // Handle team selection
  const handleTeamClick = useCallback((teamId: string) => {
    if (canPick) {
      onTeamAdvance(game.id, teamId);
    }
  }, [canPick, onTeamAdvance, game.id]);

  // Show empty state if no teams available - but still use a button for connectors
  if (!hasTeam1 && !hasTeam2) {
    return (
      <div className={`d-flex ${justifyContent}`}>
        <button
          className={`border-0 bg-light ${roundedClass} p-2 ${textClass}`}
          style={{ minWidth: width, maxWidth: width }}
          disabled
        >
          <div className="text-muted small">
            {game.name || `Round ${game.round + 1}`}
          </div>
          <div className="text-muted small">
            Teams TBD
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`d-flex ${justifyContent}`}>
      {renderGameHeader && renderGameHeader(game)}
      
      <button
        className={`border-0 bg-light ${roundedClass} p-0 list-group list-group-sm mt-n3 m-0 shadow ${textClass}`}
        style={{ minWidth: width, maxWidth: width }}
        disabled={false} // Always allow interaction to change picks
      >
        {hasTeam1 ? (
          <Team
            team={team1}
            game={game}
            position="top"
            type={type}
            isSelected={false}
            isWinner={isTeam1Winner}
            onClick={() => handleTeamClick(team1.id)}
            disabled={false}
            showScore={!!game.finalScore}
          />
        ) : (
          <TBDSlot position="top" type={type} />
        )}
        
        {hasTeam2 ? (
          <Team
            team={team2}
            game={game}
            position="bottom"
            type={type}
            isSelected={false}
            isWinner={isTeam2Winner}
            onClick={() => handleTeamClick(team2.id)}
            disabled={false}
            showScore={!!game.finalScore}
          />
        ) : (
          <TBDSlot position="bottom" type={type} />
        )}
        
        {renderGameFooter && renderGameFooter(game)}
      </button>
    </div>
  );
};

export default Game;