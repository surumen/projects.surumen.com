import type { Team } from '@/types';

/**
 * Real tournament data registry for modern bracket system
 * Contains actual seeding and team data extracted from existing tournament files
 * Located in /app/data for proper data organization
 */

// Type for lazy-loaded team data
type TeamDataLoader = () => Promise<Team[]>;

/**
 * Registry of real tournament data organized by league and year
 * Uses dynamic imports for performance optimization
 */
export const TOURNAMENT_DATA: Record<string, Record<number, TeamDataLoader>> = {
  ncaa: {
    // TODO: Add 2022-2024 data extraction
    // 2022: () => import('./ncaa/teams-2022').then(m => m.ncaaTeams2022),
    // 2023: () => import('./ncaa/teams-2023').then(m => m.ncaaTeams2023),
    // 2024: () => import('./ncaa/teams-2024').then(m => m.ncaaTeams2024), 
    2025: () => import('./ncaa/teams-2025').then(m => m.ncaaTeams2025)
  },
  nba: {
    // TODO: Add 2022-2024 data extraction
    // 2022: () => import('./nba/teams-2022').then(m => m.nbaTeams2022),
    // 2023: () => import('./nba/teams-2023').then(m => m.nbaTeams2023),
    // 2024: () => import('./nba/teams-2024').then(m => m.nbaTeams2024),
    2025: () => import('./nba/teams-2025').then(m => m.nbaTeams2025)
  },
  ucl: {
    // TODO: Add 2022-2024 data extraction with actual draw results
    // 2022: () => import('./ucl/teams-2022').then(m => m.uclTeams2022),
    // 2023: () => import('./ucl/teams-2023').then(m => m.uclTeams2023),
    // 2024: () => import('./ucl/teams-2024').then(m => m.uclTeams2024),
    2025: () => import('./ucl/teams-2025').then(m => m.uclTeams2025)
  }
};

/**
 * Get available years for a specific league
 */
export const getAvailableYears = (league: string): number[] => {
  const leagueData = TOURNAMENT_DATA[league];
  return leagueData ? Object.keys(leagueData).map(Number).sort((a, b) => b - a) : [];
};

/**
 * Get available leagues
 */
export const getAvailableLeagues = (): string[] => {
  return Object.keys(TOURNAMENT_DATA);
};

/**
 * Check if tournament data exists for a specific league and year
 */
export const tournamentDataExists = (league: string, year: number): boolean => {
  return !!(TOURNAMENT_DATA[league]?.[year]);
};

/**
 * Load team data for a specific tournament
 */
export const loadTournamentTeams = async (league: string, year: number): Promise<Team[]> => {
  const loader = TOURNAMENT_DATA[league]?.[year];
  if (!loader) {
    throw new Error(`No tournament data found for ${league} ${year}`);
  }
  
  try {
    return await loader();
  } catch (error) {
    throw new Error(`Failed to load tournament data for ${league} ${year}: ${error}`);
  }
};

/**
 * Get all available tournament combinations
 */
export const getAllAvailableTournaments = (): Array<{ league: string; year: number; id: string }> => {
  const tournaments: Array<{ league: string; year: number; id: string }> = [];
  
  Object.entries(TOURNAMENT_DATA).forEach(([league, years]) => {
    Object.keys(years).forEach(year => {
      tournaments.push({
        league,
        year: parseInt(year),
        id: `${league}-${year}`
      });
    });
  });
  
  return tournaments.sort((a, b) => {
    // Sort by league first, then by year (descending)
    if (a.league !== b.league) {
      return a.league.localeCompare(b.league);
    }
    return b.year - a.year;
  });
};

/**
 * Parse tournament ID to get league and year
 */
export const parseTournamentId = (tournamentId: string): { league: string; year: number } | null => {
  const match = tournamentId.match(/^([a-z]+)-(\d{4})$/);
  if (!match) return null;
  
  return {
    league: match[1],
    year: parseInt(match[2])
  };
};

/**
 * Generate tournament ID from league and year
 */
export const generateTournamentId = (league: string, year: number): string => {
  return `${league}-${year}`;
};

/**
 * Load draw data for UCL tournaments (since they use actual draw results)
 */
export const loadUclDrawData = async (year: number) => {
  switch (year) {
    case 2025:
      const { getUclDraw, uclResults2025 } = await import('./ucl/teams-2025');
      return { getUclDraw, results: uclResults2025 };
    // TODO: Add other years
    default:
      throw new Error(`No UCL draw data available for ${year}`);
  }
};
