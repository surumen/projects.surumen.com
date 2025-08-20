// app/widgets/brackets/Bracket.tsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import Region from './Region';
import FinalRegion from './FinalRegion';
import type { BracketProps } from '@/types';

const Bracket: React.FC<BracketProps> = ({
  bracketView,
  regionsPerRow = 2,
  onTeamAdvance,
  onGameClick,
  renderRegionHeader,
  renderGameHeader,
  renderGameFooter,
  className = ''
}) => {
  const hasMounted = useMounted();
  const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
  const isMobile = hasMounted && isMobileQuery;

  const regionKeys = bracketView.regionNames;
  const isMultiRegion = regionKeys.length > 1;

  const renderRow = (regions: string[]) => (
    <Row className="gy-md-5 mb-md-5 mx-0 mx-md-auto" key={regions.join('-')}>
      {regions.map((regionName, idx) => {
        const regionView = bracketView.regions[regionName];
        if (!regionView) return null;

        return (
          <Col xs={12} md={12 / regionsPerRow} className="px-0 h-100" key={regionName}>
            <Region
              regionView={regionView}
              type={idx % 2 === 0 ? 'left' : 'right'}
              onTeamAdvance={onTeamAdvance}
              renderRegionHeader={renderRegionHeader}
              renderGameHeader={renderGameHeader}
              renderGameFooter={renderGameFooter}
            />
          </Col>
        );
      })}
    </Row>
  );

  return (
    <Container className={`tournament py-4 px-0 position-relative ${className}`}>
      {/* Regional brackets */}
      {renderRow(regionKeys.slice(0, regionsPerRow))}
      {regionKeys.length > regionsPerRow &&
        renderRow(regionKeys.slice(regionsPerRow))}

      {/* Final Four/Championship */}
      {isMultiRegion && bracketView.finalGames.length > 0 && (
        <FinalRegion
          finalGames={bracketView.finalGames}
          onTeamAdvance={onTeamAdvance}
          renderGameHeader={renderGameHeader}
          renderGameFooter={renderGameFooter}
          isMobile={isMobile}
        />
      )}
    </Container>
  );
};

export default Bracket;