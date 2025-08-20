// app/types/BracketCore.ts
// Core tournament and bracket types

// ===============================
// TOURNAMENT DEFINITION TYPES
// ===============================

export interface Team {
  id: string;                          // Unique identifier
  name: string;                        // Team slug/identifier
  displayName?: string;                // Full display name
  shortName?: string;                  // Abbreviation
  logo?: string;                       // Logo URL
  color?: string;                      // Team color
  conference?: string;                 // For NBA/conferences
  
  // Seeding info (for tournaments)
  seed?: number;                       // Tournament seed
  
  // Metadata
  city?: string;
  founded?: number;
  website?: string;
}

export interface GameDefinition {
  id: string;                          // "west-r1-g0"
  round: number;                       // 0, 1, 2, 3...
  region: string;                      // "West", "East", "Final"
  
  // Participants (either direct teams or source games)
  team1Id?: string;                    // Direct team reference
  team2Id?: string;
  sourceGame1Id?: string;              // "west-r0-g0"
  sourceGame2Id?: string;              // "west-r0-g1"
  
  // Game metadata
  name?: string;                       // "Elite Eight", "Semifinals"
  isFinal?: boolean;
  isSeries?: boolean;
  bestOf?: number;                     // For NBA series (7)
  
  // Historical data (if any)
  finalScore?: [number, number];
  penalties?: [number, number];
  winnerId?: string;                   // Historical winner
}

export interface Round {
  number: number;                      // 0, 1, 2, 3
  name: string;                        // "Round of 64", "Elite Eight"
  gamesPerRegion?: number;             // How many games in this round per region
  isRegionalFinal?: boolean;           // Last round before Final Four
  isFinal?: boolean;                   // Championship round
}

export interface RegionDefinition {
  name: string;                        // "West", "East", etc.
  teams: string[];                     // Team IDs in this region
  gameIds: string[];                   // All game IDs in this region
}

export interface AdvancementRule {
  type: 'single-elimination' | 'best-of-series' | 'group-stage';
  
  // For series
  seriesLength?: number;               // Best of 7
  
  // For group stage
  advanceCount?: number;               // Top 2 advance
  
  // Winner determination
  winCondition: 'higher-score' | 'series-wins' | 'points';
}

export interface TournamentDefinition {
  // Basic info
  id: string;                          // "ncaa-2025"
  name: string;                        // "NCAA March Madness 2025"
  year: number;
  type: 'single-elimination' | 'series' | 'draw-based';
  
  // Normalized data
  teams: Record<string, Team>;         // teamId → team data
  games: Record<string, GameDefinition>; // gameId → game definition
  regions: Record<string, RegionDefinition>; // regionName → region data
  rounds: Round[];                     // Round definitions
  
  // Rules
  advancement: AdvancementRule;
  
  // Metadata
  sport: string;                       // "basketball", "football"
  league: string;                      // "NCAA", "NBA", "UEFA"
  startDate?: string;
  endDate?: string;
}

// ===============================
// USER STATE TYPES
// ===============================

export interface GamePick {
  gameId: string;
  winnerId: string;                    // Team ID of picked winner
  score?: [number, number];            // Predicted score
  confidence?: number;                 // 1-10 confidence rating
  timestamp: number;                   // When pick was made
}

export interface BracketUserState {
  // Current tournament
  activeTournament: string | null;
  
  // User picks (normalized by game ID)
  picks: Record<string, GamePick>;     // gameId → pick
  
  // Computed helper sets (for performance)
  completedGames: Set<string>;         // Games with picks
  availableGames: Set<string>;         // Games ready for picking
  
  // Stats
  bracketScore: number;
  totalPossibleScore: number;
  completionPercentage: number;
}

// ===============================
// COMPUTED VIEW TYPES
// ===============================

export interface BracketGameView {
  // Game definition
  id: string;
  round: number;
  region: string;
  name?: string;
  isFinal?: boolean;
  isSeries?: boolean;
  
  // Participants (resolved teams)
  team1?: Team;
  team2?: Team;
  
  // Source game references (for advancement logic)
  sourceGame1Id?: string;
  sourceGame2Id?: string;
  
  // User state
  userPick?: GamePick;
  isPickable: boolean;                 // Can user make a pick?
  
  // Historical data
  historicalWinner?: Team;
  finalScore?: [number, number];
  penalties?: [number, number];
}

export interface BracketRegionView {
  name: string;
  games: BracketGameView[];
  gamesByRound: BracketGameView[][];   // For easy rendering
  isComplete: boolean;
  champion?: Team;
}

export interface BracketView {
  // Tournament info
  tournament: TournamentDefinition;
  
  // Regional brackets
  regions: Record<string, BracketRegionView>;
  regionNames: string[];
  
  // Final games
  finalGames: BracketGameView[];
  
  // Overall state
  isComplete: boolean;
  champion?: Team;
  userScore: number;
  maxScore: number;
  completionPercentage: number;
}

// ===============================
// BUILDER CONFIG TYPES
// ===============================

export interface TournamentConfig {
  name: string;
  year: number;
  type: 'single-elimination' | 'series' | 'draw-based';
  sport: string;
  league: string;
  
  regions: RegionConfig[];
  finalStructure: FinalConfig;
  advancement: AdvancementRule;
}

export interface RegionConfig {
  name: string;
  teamCount: number;
  seedingStrategy: SeedingStrategy;
}

export interface FinalConfig {
  type: 'final-four' | 'conference-finals' | 'single-final';
  gameCount: number;
  advancement: 'region-winners' | 'conference-winners';
}

export interface SeedingStrategy {
  type: 'traditional-bracket' | 'conference-playoffs' | 'random-draw';
  pairings?: [number, number][];       // For traditional brackets
  drawRules?: DrawRule[];              // For random draws
}

export interface DrawRule {
  round: number;
  restriction?: string;                // "no-same-country", etc.
}

// ===============================
// EVENT TYPES
// ===============================

export interface BracketEvent {
  type: 'TEAM_ADVANCED' | 'GAME_COMPLETED' | 'BRACKET_RESET' | 'TOURNAMENT_CHANGED';
  tournamentId: string;
  gameId?: string;
  winnerId?: string;
  timestamp: number;
  userId?: string;
}

// ===============================
// UTILITY TYPES
// ===============================

export type TournamentType = 'ncaa' | 'nba' | 'ucl';
export type RegionType = 'left' | 'right' | 'center';

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TournamentValidation extends ValidationResult {
  missingGames: string[];
  invalidReferences: string[];
  orphanedTeams: string[];
}
