// app/types/brackets/components.ts
// React component prop types for bracket widgets

import type { BracketView, BracketRegionView, BracketGameView, Team } from './core';

// ===============================
// COMPONENT PROP TYPES
// ===============================

export interface BracketProps {
  bracketView: BracketView;
  regionsPerRow?: number;
  onTeamAdvance: (gameId: string, teamId: string) => void;
  onGameClick?: (game: BracketGameView) => void;
  renderRegionHeader?: (regionName: string) => React.ReactNode;
  renderGameHeader?: (game: BracketGameView) => React.ReactNode;
  renderGameFooter?: (game: BracketGameView) => React.ReactNode;
  className?: string;
}

export interface RegionProps {
  regionView: BracketRegionView;
  type: 'left' | 'right';
  onTeamAdvance: (gameId: string, teamId: string) => void;
  renderRegionHeader?: (regionName: string) => React.ReactNode;
  renderGameHeader?: (game: BracketGameView) => React.ReactNode;
  renderGameFooter?: (game: BracketGameView) => React.ReactNode;
  isFinal?: boolean;
}

export interface RoundProps {
  games: BracketGameView[];
  roundNumber: number;
  type: 'left' | 'right';
  onTeamAdvance: (gameId: string, teamId: string) => void;
  renderGameHeader?: (game: BracketGameView) => React.ReactNode;
  renderGameFooter?: (game: BracketGameView) => React.ReactNode;
}

export interface GameProps {
  game: BracketGameView;
  type: 'left' | 'right';
  onTeamAdvance: (gameId: string, teamId: string) => void;
  renderGameHeader?: (game: BracketGameView) => React.ReactNode;
  renderGameFooter?: (game: BracketGameView) => React.ReactNode;
}

export interface TeamProps {
  team: Team;
  game: BracketGameView;
  position: 'top' | 'bottom';
  isSelected: boolean;
  isWinner: boolean;
  onClick: () => void;
  disabled?: boolean;
  type?: 'left' | 'right';
  showScore?: boolean;
}

export interface ConnectorProps {
  gameRefs: React.RefObject<HTMLDivElement>[][];
  containerRef: React.RefObject<HTMLDivElement>;
  type: 'left' | 'right';
  isFinalRegion?: boolean;
}

export interface FinalProps {
  finalGames: BracketGameView[];
  onTeamAdvance: (gameId: string, teamId: string) => void;
  renderGameHeader?: (game: BracketGameView) => React.ReactNode;
  renderGameFooter?: (game: BracketGameView) => React.ReactNode;
  isMobile?: boolean;
}
