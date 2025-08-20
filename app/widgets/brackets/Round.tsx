// app/widgets/brackets/Round.tsx

import React from 'react';
import Game from './Game';
import type { RoundProps } from '@/types';

const Round: React.FC<RoundProps> = ({
  games,
  roundNumber,
  type = 'left',
  onTeamAdvance,
  renderGameHeader,
  renderGameFooter
}) => {
  return (
    <div
      className="d-grid"
      style={{
        gridTemplateRows: 'auto 1fr',
        rowGap: '1rem',
      }}
    >
      <div>
        {games.map((game) => (
          <div key={game.id} className="mb-3">
            <Game
              game={game}
              type={type}
              onTeamAdvance={onTeamAdvance}
              renderGameHeader={renderGameHeader}
              renderGameFooter={renderGameFooter}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Round;