// app/utils/bracketViewBuilder.ts

import type { 
  TournamentDefinition,
  GamePick,
  BracketView,
  BracketRegionView,
  BracketGameView,
  Team
} from '@/types';

/**
 * Build a complete bracket view by merging tournament definition with user picks
 */
export const buildBracketView = (
  tournament: TournamentDefinition,
  userPicks: Record<string, GamePick>
): BracketView => {
  
  // Build region views
  const regions: Record<string, BracketRegionView> = {};
  const regionNames = Object.keys(tournament.regions).filter(name => name !== 'Final');
  
  regionNames.forEach(regionName => {
    regions[regionName] = buildRegionView(tournament, regionName, userPicks);
  });

  // Build final games view
  const finalGames = buildFinalGamesView(tournament, userPicks, regions);

  // Calculate overall completion
  const allGames = Object.values(tournament.games);
  const totalGames = allGames.length;
  const completedGames = Object.keys(userPicks).length;
  const completionPercentage = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;

  // Find overall champion
  const championshipGame = finalGames.find(game => game.isFinal);
  const champion = championshipGame?.userPick 
    ? tournament.teams[championshipGame.userPick.winnerId]
    : championshipGame?.historicalWinner;

  // Calculate user score (simplified - would be more complex in real implementation)
  const userScore = calculateBracketScore(tournament, userPicks);
  const maxScore = calculateMaxPossibleScore(tournament);

  return {
    tournament,
    regions,
    regionNames,
    finalGames,
    isComplete: completionPercentage === 100,
    champion,
    userScore,
    maxScore,
    completionPercentage
  };
};

/**
 * Build a view for a specific region
 */
const buildRegionView = (
  tournament: TournamentDefinition,
  regionName: string,
  userPicks: Record<string, GamePick>
): BracketRegionView => {
  
  const region = tournament.regions[regionName];
  const games: BracketGameView[] = [];

  // Build game views for this region
  region.gameIds.forEach(gameId => {
    const gameView = buildGameView(tournament, gameId, userPicks);
    games.push(gameView);
  });

  // Group games by round for easier rendering
  const gamesByRound: BracketGameView[][] = [];
  const maxRound = Math.max(...games.map(g => g.round));
  
  for (let round = 0; round <= maxRound; round++) {
    gamesByRound[round] = games.filter(g => g.round === round);
  }

  // Find region champion (winner of the final game in this region)
  const regionFinal = games.find(game => 
    game.round === maxRound && game.region === regionName
  );
  
  const champion = regionFinal?.userPick
    ? tournament.teams[regionFinal.userPick.winnerId]
    : regionFinal?.historicalWinner;

  // Check if region is complete
  const isComplete = games.every(game => 
    game.userPick || game.historicalWinner || !game.isPickable
  );

  return {
    name: regionName,
    games,
    gamesByRound,
    isComplete,
    champion
  };
};

/**
 * Build views for final games (Final Four, Championship, etc.)
 */
const buildFinalGamesView = (
  tournament: TournamentDefinition,
  userPicks: Record<string, GamePick>,
  regions: Record<string, BracketRegionView>
): BracketGameView[] => {
  
  const finalRegion = tournament.regions['Final'];
  if (!finalRegion) return [];

  const finalGames: BracketGameView[] = [];

  finalRegion.gameIds.forEach(gameId => {
    const gameView = buildGameView(tournament, gameId, userPicks);
    
    // For final games, we need to resolve teams from region winners
    if (gameView.sourceGame1Id && gameView.sourceGame2Id) {
      const team1 = resolveTeamFromSource(tournament, gameView.sourceGame1Id, userPicks, regions);
      const team2 = resolveTeamFromSource(tournament, gameView.sourceGame2Id, userPicks, regions);
      
      gameView.team1 = team1;
      gameView.team2 = team2;
      gameView.isPickable = !!(team1 || team2); // Allow picking with at least one team
    }

    finalGames.push(gameView);
  });

  return finalGames.sort((a, b) => {
    // Sort by round, then by game order
    if (a.round !== b.round) return a.round - b.round;
    return a.id.localeCompare(b.id);
  });
};

/**
 * Build a view for a specific game
 */
const buildGameView = (
  tournament: TournamentDefinition,
  gameId: string,
  userPicks: Record<string, GamePick>
): BracketGameView => {
  
  const game = tournament.games[gameId];
  const userPick = userPicks[gameId];

  // Resolve teams independently - don't wait for both teams
  let team1: Team | undefined;
  let team2: Team | undefined;

  if (game.team1Id && game.team2Id) {
    // Direct team matchup (Round 0)
    team1 = tournament.teams[game.team1Id];
    team2 = tournament.teams[game.team2Id];
  } else {
    // Teams come from previous games (Round 1+) - resolve independently
    if (game.sourceGame1Id) {
      team1 = getGameWinner(tournament, game.sourceGame1Id, userPicks);
    }
    if (game.sourceGame2Id) {
      team2 = getGameWinner(tournament, game.sourceGame2Id, userPicks);
    }
  }

  // Game is pickable if it has at least one team (allow changing existing picks)
  const isPickable = !!(team1 || team2);

  // Find historical winner if any
  const historicalWinner = game.winnerId ? tournament.teams[game.winnerId] : undefined;

  return {
    id: game.id,
    round: game.round,
    region: game.region,
    name: game.name,
    isFinal: game.isFinal,
    isSeries: game.isSeries,
    team1,
    team2,
    userPick,
    isPickable,
    historicalWinner,
    finalScore: game.finalScore,
    penalties: game.penalties,
    sourceGame1Id: game.sourceGame1Id,
    sourceGame2Id: game.sourceGame2Id
  };
};

/**
 * Resolve a team from a source game (for Final Four scenarios)
 */
const resolveTeamFromSource = (
  tournament: TournamentDefinition,
  sourceGameId: string,
  userPicks: Record<string, GamePick>,
  regions: Record<string, BracketRegionView>
): Team | undefined => {
  
  const sourceGame = tournament.games[sourceGameId];
  if (!sourceGame) return undefined;

  // Check user pick first
  const userPick = userPicks[sourceGameId];
  if (userPick) {
    return tournament.teams[userPick.winnerId];
  }

  // Check historical winner
  if (sourceGame.winnerId) {
    return tournament.teams[sourceGame.winnerId];
  }

  // Check if it's a region final and get the region champion
  if (sourceGame.region !== 'Final') {
    const region = regions[sourceGame.region];
    return region?.champion;
  }

  return undefined;
};

/**
 * Calculate bracket score based on user picks vs actual results
 */
const calculateBracketScore = (
  tournament: TournamentDefinition,
  userPicks: Record<string, GamePick>
): number => {
  let score = 0;
  
  Object.values(userPicks).forEach(pick => {
    const game = tournament.games[pick.gameId];
    if (game && game.winnerId === pick.winnerId) {
      // Score based on round (later rounds worth more)
      const roundMultiplier = Math.pow(2, game.round);
      score += roundMultiplier;
    }
  });

  return score;
};

/**
 * Calculate maximum possible score for the tournament
 */
const calculateMaxPossibleScore = (tournament: TournamentDefinition): number => {
  let maxScore = 0;
  
  Object.values(tournament.games).forEach(game => {
    // Each game worth points based on round
    const roundMultiplier = Math.pow(2, game.round);
    maxScore += roundMultiplier;
  });

  return maxScore;
};

/**
 * Get available games that user can pick
 */
export const getAvailableGames = (
  tournament: TournamentDefinition,
  userPicks: Record<string, GamePick>
): string[] => {
  const availableGames: string[] = [];

  Object.values(tournament.games).forEach(game => {
    // Skip if already picked
    if (userPicks[game.id]) return;

    // Check if teams are available
    if (game.team1Id && game.team2Id) {
      // Direct matchup - always available
      availableGames.push(game.id);
    } else if (game.sourceGame1Id && game.sourceGame2Id) {
      // Check if both source games have winners
      const source1Winner = getGameWinner(tournament, game.sourceGame1Id, userPicks);
      const source2Winner = getGameWinner(tournament, game.sourceGame2Id, userPicks);
      
      if (source1Winner && source2Winner) {
        availableGames.push(game.id);
      }
    }
  });

  return availableGames;
};

/**
 * Get the winner of a specific game
 */
const getGameWinner = (
  tournament: TournamentDefinition,
  gameId: string,
  userPicks: Record<string, GamePick>
): Team | undefined => {
  
  const userPick = userPicks[gameId];
  if (userPick) {
    return tournament.teams[userPick.winnerId];
  }

  const game = tournament.games[gameId];
  if (game?.winnerId) {
    return tournament.teams[game.winnerId];
  }

  return undefined;
};
