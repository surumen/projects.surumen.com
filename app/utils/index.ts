// app/utils/index.ts
// Centralized utility exports

// ========================
// TECHNOLOGY UTILITIES
// ========================
export { 
  getTechnologyColor,
  getTechnologyScheme, 
  getTechnologyColors,
  getColorDistribution,
  getLanguageScheme
} from './technologyColors';

// ========================
// FORMATTING UTILITIES
// ========================
export { formatValue } from './formatting';

// ========================
// BRACKETS UTILITIES
// ========================
export { TournamentBuilder } from './brackets/tournament';

export { 
  buildBracketView,
  getAvailableGames
} from './brackets/views';

export {
  createGameId,
  createGameReference,
  buildSingleEliminationGames,
  buildSeriesGames,
  buildFinalGames,
  validateGameTree
} from './brackets/games';

// ========================
// FPL UTILITIES
// ========================
export { reshapeFPLHistory } from './fpl/history';

// ========================
// HOOKS RE-EXPORTS
// ========================
// Re-export bracket hooks for convenience
export {
  useBracket,
  useBracketController,
  useTournamentController
} from '@/hooks/useBrackets';
