// app/widgets/brackets/FinalRegion.tsx

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Region from './Region';
import type { FinalProps } from '@/types';
import type { BracketRegionView, BracketGameView } from '@/types';

const FinalRegion: React.FC<FinalProps> = ({
  finalGames,
  onTeamAdvance,
  renderGameHeader,
  renderGameFooter,
  isMobile = false
}) => {
  // Create a mock region view for final games
  const finalRegionView: BracketRegionView = {
    name: 'Final',
    games: finalGames,
    gamesByRound: [],
    isComplete: false,
    champion: undefined
  };

  // Group games by round
  const gamesByRound: BracketGameView[][] = [];
  if (finalGames.length > 0) {
    const maxRound = Math.max(...finalGames.map(g => g.round));
    for (let round = 0; round <= maxRound; round++) {
      gamesByRound[round] = finalGames.filter(g => g.round === round);
    }
  }
  
  finalRegionView.gamesByRound = gamesByRound;

  // Desktop final layout
  if (!isMobile && finalGames.length > 0) {
    const semis = finalGames.filter(g => g.round === 0);
    const isSingleFinal = semis.length === 1;
    const regionsPerRow = 2;

    const positionStyle: React.CSSProperties = isSingleFinal
      ? { top: '20%', left: '50%', transform: 'translateX(-50%)' }
      : {
          top: 0,
          left: `${(100 / regionsPerRow) / 2}%`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };

    return (
      <div
        style={{
          position: 'absolute',
          width: `${100 / regionsPerRow}%`,
          pointerEvents: 'none',
          zIndex: 1,
          ...positionStyle,
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <Region
            regionView={finalRegionView}
            type="left"
            onTeamAdvance={onTeamAdvance}
            renderGameHeader={renderGameHeader}
            renderGameFooter={renderGameFooter}
            isFinal={true}
          />
        </div>
      </div>
    );
  }

  // Mobile final layout
  if (isMobile && finalGames.length > 0) {
    return (
      <Row className="gy-md-5 mb-md-5">
        <Col xs={12} className="px-0 h-100">
          <Region
            regionView={finalRegionView}
            type="left"
            onTeamAdvance={onTeamAdvance}
            renderGameHeader={renderGameHeader}
            renderGameFooter={renderGameFooter}
            isFinal={true}
          />
        </Col>
      </Row>
    );
  }

  return null;
};

export default FinalRegion;