// app/widgets/brackets/Region.tsx

import React, { useRef, useMemo, useEffect } from 'react';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import Round from './Round';
import Connector from './Connector';
import type { RegionProps } from '@/types';

const Region: React.FC<RegionProps> = ({
  regionView,
  type = 'left',
  onTeamAdvance,
  renderRegionHeader,
  renderGameHeader,
  renderGameFooter,
  isFinal = false
}) => {
  const hasMounted = useMounted();
  const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
  const isMobile = hasMounted && isMobileQuery;

  const effectiveType = isMobile ? 'left' : type;
  const isRight = effectiveType === 'right';

  // Get games organized by round
  const gamesByRound = regionView.gamesByRound;
  const roundCount = gamesByRound.length;
  const rowCount = gamesByRound[0]?.length * 2 - 1 || 1;

  // Refs for connectors
  const gameRefs = useRef<React.RefObject<HTMLDivElement>[][]>();
  useEffect(() => { gameRefs.current = undefined; }, [regionView]);
  if (!gameRefs.current) {
    gameRefs.current = gamesByRound.map(r => r.map(() => React.createRef()));
  }
  const refsForConnector = gameRefs.current;
  const containerRef = useRef<HTMLDivElement>(null);

  // FINAL REGION LAYOUT
  if (isFinal && !isMobile) {
    // Split out semis + final
    const semiFinals = regionView.games.filter(g => g.round === 0);
    const finalGame = regionView.games.find(g => g.round > 0) || regionView.games[0];
    const hasTwoSemis = semiFinals.length === 2;

    return (
      <div ref={containerRef} className="h-100 position-relative">
        <Connector
          gameRefs={gameRefs.current}
          containerRef={containerRef}
          type={effectiveType}
          isFinalRegion
        />

        {/* Desktop: flex trifecta */}
        <div className="d-flex align-items-center justify-content-center h-100">
          {hasTwoSemis && (
            <Round
              games={[semiFinals[0]]}
              roundNumber={0}
              type="left"
              onTeamAdvance={onTeamAdvance}
              renderGameHeader={renderGameHeader}
              renderGameFooter={renderGameFooter}
            />
          )}

          <div className="mx-4">
            <Round
              games={[finalGame]}
              roundNumber={hasTwoSemis ? 1 : 0}
              type="left"
              onTeamAdvance={onTeamAdvance}
              renderGameHeader={renderGameHeader}
              renderGameFooter={renderGameFooter}
            />
          </div>

          {hasTwoSemis && (
            <Round
              games={[semiFinals[1]]}
              roundNumber={0}
              type="right"
              onTeamAdvance={onTeamAdvance}
              renderGameHeader={renderGameHeader}
              renderGameFooter={renderGameFooter}
            />
          )}
        </div>
      </div>
    );
  }

  // NORMAL BRACKET GRID
  return (
    <div ref={containerRef} className="h-100 d-flex flex-column position-relative">
      <Connector
        gameRefs={refsForConnector}
        containerRef={containerRef}
        type={effectiveType}
        isFinalRegion={false}
      />

      {renderRegionHeader && renderRegionHeader(regionView.name)}

      <div
        className="flex-grow-1"
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${rowCount}, 1fr)`,
          gridTemplateColumns: `repeat(${roundCount}, 1fr)`,
          columnGap: '0',
          rowGap: isMobile ? '0rem' : '1rem',
          alignContent: 'stretch',
        }}
      >
        {gamesByRound.map((gamesInRound, roundIdx) =>
          gamesInRound.map((game, gameIdx) => {
            const rowStart = gameIdx * 2 ** (roundIdx + 1) + 2 ** roundIdx;

            // Base grid placement: either left→right or right→left
            const col = isRight
              ? roundCount - roundIdx
              : roundIdx + 1;

            // Mobile overlap logic
            const overlapPx = 100;
            const shift = isMobile
              ? (isRight ? roundIdx * overlapPx : -roundIdx * overlapPx)
              : 0;

            return (
              <div
                key={`${roundIdx}-${gameIdx}`}
                ref={gameRefs.current![roundIdx][gameIdx]}
                style={{
                  gridColumn: col,
                  gridRowStart: rowStart,
                  transform: isMobile ? `translateX(${shift}px)` : undefined,
                }}
              >
                <Round
                  games={[game]}
                  roundNumber={roundIdx}
                  type={effectiveType}
                  onTeamAdvance={onTeamAdvance}
                  renderGameHeader={renderGameHeader}
                  renderGameFooter={renderGameFooter}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Region;