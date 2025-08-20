/**
 * Tournament configuration for different league types
 * Each league has its own structure and advancement rules
 */

export interface TournamentConfig {
  regions: readonly string[];
  teamsPerRegion: number;
  tournamentType: 'single-elimination' | 'series' | 'draw-based';
  // For single-elimination and series: fixed seeding pairings
  pairings?: readonly (readonly [number, number])[]; 
  // For draw-based: specific matchup configuration per year
  drawConfig?: {
    requiresDrawData: true;
  };
}

export const TOURNAMENT_CONFIGS = {
  /**
   * NCAA March Madness - Single Elimination
   * Traditional bracket with fixed seeding pairings
   */
  ncaa: {
    regions: ['South', 'East', 'West', 'Midwest'],
    teamsPerRegion: 16,
    tournamentType: 'single-elimination' as const,
    // Traditional March Madness bracket pairing
    pairings: [[1,16], [8,9], [5,12], [4,13], [6,11], [3,14], [7,10], [2,15]]
  },
  
  /**
   * NBA Playoffs - Best-of-7 Series
   * Conference-based with fixed seeding pairings
   */
  nba: {
    regions: ['West', 'East'], 
    teamsPerRegion: 8,
    tournamentType: 'series' as const,
    // NBA playoff bracket pairing
    pairings: [[1,8], [4,5], [2,7], [3,6]]
  },
  
  /**
   * UEFA Champions League - Draw-based
   * Uses actual draw results, not fixed seeding
   */
  ucl: {
    regions: ['SideA', 'SideB'],
    teamsPerRegion: 8,
    tournamentType: 'draw-based' as const,
    drawConfig: {
      requiresDrawData: true
    }
    // No pairings - uses actual draw results from tournament data
  }
} as const;

export type TournamentLeague = keyof typeof TOURNAMENT_CONFIGS;

/**
 * Get tournament configuration for a specific league
 */
export const getTournamentConfig = (league: TournamentLeague): TournamentConfig => {
  return TOURNAMENT_CONFIGS[league];
};

/**
 * Check if a league uses draw-based matchups
 */
export const isDrawBased = (league: TournamentLeague): boolean => {
  return getTournamentConfig(league).tournamentType === 'draw-based';
};

/**
 * Check if a league uses series (best-of-X)
 */
export const usesSeries = (league: TournamentLeague): boolean => {
  return getTournamentConfig(league).tournamentType === 'series';
};

/**
 * Validate that team data matches the expected structure for a league
 */
export const validateTournamentStructure = (
  league: TournamentLeague, 
  teams: any[]
): boolean => {
  const config = getTournamentConfig(league);
  const expectedTeamCount = config.regions.length * config.teamsPerRegion;
  
  if (teams.length !== expectedTeamCount) {
    console.warn(`Expected ${expectedTeamCount} teams for ${league}, got ${teams.length}`);
    return false;
  }
  
  // For non-draw-based tournaments, check region distribution
  if (!isDrawBased(league)) {
    const regionCounts = teams.reduce((acc, team) => {
      acc[team.region] = (acc[team.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    for (const region of config.regions) {
      if (regionCounts[region] !== config.teamsPerRegion) {
        console.warn(`Expected ${config.teamsPerRegion} teams in ${region}, got ${regionCounts[region] || 0}`);
        return false;
      }
    }
  }
  
  return true;
};
