// app/utils/gameBuilder.ts

import type { 
  GameDefinition, 
  TournamentDefinition,
  Team,
  SeedingStrategy 
} from '@/types';

/**
 * Generate a unique game ID
 */
export const createGameId = (region: string, round: number, game: number): string => {
  return `${region.toLowerCase()}-r${round}-g${game}`;
};

/**
 * Create a game reference to another game
 */
export const createGameReference = (region: string, round: number, game: number): string => {
  return createGameId(region, round, game);
};

/**
 * Build the game tree for a single-elimination region
 */
export const buildSingleEliminationGames = (
  regionName: string,
  teams: Team[],
  pairings: [number, number][]
): GameDefinition[] => {
  const games: GameDefinition[] = [];
  const teamCount = teams.length;
  
  if (teamCount !== pairings.length * 2) {
    throw new Error(`Team count (${teamCount}) doesn't match pairings (${pairings.length * 2})`);
  }

  // Round 0 - Initial matchups with actual teams
  pairings.forEach(([seed1, seed2], gameIdx) => {
    const team1 = teams.find(t => extractSeedNumber(t) === seed1);
    const team2 = teams.find(t => extractSeedNumber(t) === seed2);
    
    if (!team1 || !team2) {
      throw new Error(`Could not find teams for seeds ${seed1} and ${seed2}`);
    }

    games.push({
      id: createGameId(regionName, 0, gameIdx),
      round: 0,
      region: regionName,
      team1Id: team1.id,
      team2Id: team2.id,
      name: 'First Round',
      isFinal: false,
      isSeries: false
    });
  });

  // Subsequent rounds - games with source references
  let currentRoundGames = pairings.length;
  for (let round = 1; currentRoundGames > 1; round++) {
    const nextRoundGames = Math.floor(currentRoundGames / 2);
    
    for (let gameIdx = 0; gameIdx < nextRoundGames; gameIdx++) {
      const sourceGame1Id = createGameId(regionName, round - 1, gameIdx * 2);
      const sourceGame2Id = createGameId(regionName, round - 1, gameIdx * 2 + 1);
      
      games.push({
        id: createGameId(regionName, round, gameIdx),
        round,
        region: regionName,
        sourceGame1Id,
        sourceGame2Id,
        name: getRoundName(round, teamCount),
        isFinal: false,
        isSeries: false
      });
    }
    
    currentRoundGames = nextRoundGames;
  }

  return games;
};

/**
 * Build games for a best-of-series region (like NBA)
 */
export const buildSeriesGames = (
  regionName: string,
  teams: Team[],
  pairings: [number, number][],
  seriesLength: number = 7
): GameDefinition[] => {
  const games: GameDefinition[] = [];
  
  // Round 0 - Initial series with actual teams
  pairings.forEach(([seed1, seed2], gameIdx) => {
    const team1 = teams.find(t => extractSeedNumber(t) === seed1);
    const team2 = teams.find(t => extractSeedNumber(t) === seed2);
    
    if (!team1 || !team2) {
      throw new Error(`Could not find teams for seeds ${seed1} and ${seed2}`);
    }

    games.push({
      id: createGameId(regionName, 0, gameIdx),
      round: 0,
      region: regionName,
      team1Id: team1.id,
      team2Id: team2.id,
      name: 'First Round',
      isFinal: false,
      isSeries: true,
      bestOf: seriesLength
    });
  });

  // Subsequent rounds
  let currentRoundGames = pairings.length;
  for (let round = 1; currentRoundGames > 1; round++) {
    const nextRoundGames = Math.floor(currentRoundGames / 2);
    
    for (let gameIdx = 0; gameIdx < nextRoundGames; gameIdx++) {
      const sourceGame1Id = createGameId(regionName, round - 1, gameIdx * 2);
      const sourceGame2Id = createGameId(regionName, round - 1, gameIdx * 2 + 1);
      
      games.push({
        id: createGameId(regionName, round, gameIdx),
        round,
        region: regionName,
        sourceGame1Id,
        sourceGame2Id,
        name: getSeriesRoundName(round),
        isFinal: false,
        isSeries: true,
        bestOf: seriesLength
      });
    }
    
    currentRoundGames = nextRoundGames;
  }

  return games;
};

/**
 * Build Final Four / Championship games
 */
export const buildFinalGames = (
  regionNames: string[],
  finalType: 'final-four' | 'conference-finals' | 'single-final',
  isSeries: boolean = false,
  allRegionalGames: GameDefinition[] = []
): GameDefinition[] => {
  const games: GameDefinition[] = [];
  
  // Helper function to find the regional final game for a region
  const findRegionFinalGameId = (regionName: string): string => {
    // Find all games in this region
    const regionGames = allRegionalGames.filter(g => g.region === regionName);
    
    if (regionGames.length === 0) {
      throw new Error(`No games found for region: ${regionName}`);
    }
    
    // Find the game with the highest round number (that's the regional final)
    const finalGame = regionGames.reduce((highest, game) => 
      game.round > highest.round ? game : highest
    );
    
    return finalGame.id;
  };
  
  switch (finalType) {
    case 'final-four':
      // NCAA-style: 4 regions → 2 semis → 1 final
      if (regionNames.length !== 4) {
        throw new Error('Final Four requires exactly 4 regions');
      }
      
      // Semifinals
      games.push({
        id: createGameId('Final', 0, 0),
        round: 0,
        region: 'Final',
        sourceGame1Id: findRegionFinalGameId(regionNames[0]), // Dynamic lookup
        sourceGame2Id: findRegionFinalGameId(regionNames[1]), // Dynamic lookup
        name: 'Semifinal',
        isFinal: false,
        isSeries
      });
      
      games.push({
        id: createGameId('Final', 0, 1),
        round: 0,
        region: 'Final',
        sourceGame1Id: findRegionFinalGameId(regionNames[2]), // Dynamic lookup
        sourceGame2Id: findRegionFinalGameId(regionNames[3]), // Dynamic lookup
        name: 'Semifinal',
        isFinal: false,
        isSeries
      });
      
      // Championship
      games.push({
        id: createGameId('Final', 1, 0),
        round: 1,
        region: 'Final',
        sourceGame1Id: createGameId('Final', 0, 0),
        sourceGame2Id: createGameId('Final', 0, 1),
        name: 'Championship',
        isFinal: true,
        isSeries
      });
      break;
      
    case 'conference-finals':
      // NBA-style: 2 conferences → 1 final
      if (regionNames.length !== 2) {
        throw new Error('Conference Finals requires exactly 2 regions');
      }
      
      games.push({
        id: createGameId('Final', 0, 0),
        round: 0,
        region: 'Final',
        sourceGame1Id: findRegionFinalGameId(regionNames[0]), // Dynamic lookup
        sourceGame2Id: findRegionFinalGameId(regionNames[1]), // Dynamic lookup
        name: 'Finals',
        isFinal: true,
        isSeries,
        bestOf: isSeries ? 7 : undefined
      });
      break;
      
    case 'single-final':
      // UCL-style: 2 sides → 1 final
      if (regionNames.length !== 2) {
        throw new Error('Single Final requires exactly 2 regions');
      }
      
      games.push({
        id: createGameId('Final', 0, 0),
        round: 0,
        region: 'Final',
        sourceGame1Id: findRegionFinalGameId(regionNames[0]), // Dynamic lookup
        sourceGame2Id: findRegionFinalGameId(regionNames[1]), // Dynamic lookup
        name: 'Final',
        isFinal: true,
        isSeries: false
      });
      break;
  }
  
  return games;
};

/**
 * Extract seed number from team (handles different data formats)
 */
const extractSeedNumber = (team: Team): number => {
  // Try different ways teams might store seed info
  if ('seed' in team && typeof team.seed === 'number') {
    return team.seed;
  }
  
  // Parse from name if it contains seed info
  const seedMatch = team.name.match(/^(\d+)-/);
  if (seedMatch) {
    return parseInt(seedMatch[1]);
  }
  
  throw new Error(`Could not determine seed for team: ${team.name}`);
};

/**
 * Get round name based on team count and round number
 */
const getRoundName = (round: number, teamCount: number): string => {
  const roundNames: Record<number, Record<number, string>> = {
    64: { 1: 'Round of 32', 2: 'Sweet 16', 3: 'Elite Eight' },
    32: { 1: 'Round of 16', 2: 'Quarterfinals', 3: 'Semifinals' },
    16: { 1: 'Quarterfinals', 2: 'Semifinals' },
    8: { 1: 'Semifinals' }
  };
  
  return roundNames[teamCount]?.[round] || `Round ${round + 1}`;
};

/**
 * Get series round name
 */
const getSeriesRoundName = (round: number): string => {
  const seriesNames = [
    'First Round',
    'Conference Semifinals', 
    'Conference Finals',
    'Finals'
  ];
  
  return seriesNames[round] || `Round ${round + 1}`;
};

/**
 * Validate game tree structure
 */
export const validateGameTree = (games: GameDefinition[]): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const gameIds = new Set(games.map(g => g.id));
  
  // Check that all source games exist
  games.forEach(game => {
    if (game.sourceGame1Id && !gameIds.has(game.sourceGame1Id)) {
      errors.push(`Game ${game.id} references non-existent source game: ${game.sourceGame1Id}`);
    }
    if (game.sourceGame2Id && !gameIds.has(game.sourceGame2Id)) {
      errors.push(`Game ${game.id} references non-existent source game: ${game.sourceGame2Id}`);
    }
  });
  
  // Check for circular dependencies
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  const hasCycle = (gameId: string): boolean => {
    if (recursionStack.has(gameId)) return true;
    if (visited.has(gameId)) return false;
    
    visited.add(gameId);
    recursionStack.add(gameId);
    
    const game = games.find(g => g.id === gameId);
    if (game) {
      if (game.sourceGame1Id && hasCycle(game.sourceGame1Id)) return true;
      if (game.sourceGame2Id && hasCycle(game.sourceGame2Id)) return true;
    }
    
    recursionStack.delete(gameId);
    return false;
  };
  
  games.forEach(game => {
    if (hasCycle(game.id)) {
      errors.push(`Circular dependency detected involving game: ${game.id}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
