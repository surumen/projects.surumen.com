// app/utils/TournamentBuilder.ts

import type { 
  TournamentDefinition,
  Team,
  GameDefinition,
  RegionDefinition,
  Round,
  AdvancementRule
} from '@/types';

import { 
  buildSingleEliminationGames,
  buildSeriesGames,
  buildFinalGames,
  createGameId,
  validateGameTree
} from './games';

// Import region configurations
import { ncaaRegions2025 } from '@/data/brackets/leagues/ncaa/teams-2025';

export class TournamentBuilder {
  /**
   * Build NCAA March Madness tournament
   */
  static ncaa(year: number, teamsData: Team[]): TournamentDefinition {
    // Create teams lookup
    const teamsById = new Map(teamsData.map(team => [team.id, team]));
    
    // Get region configuration for the year
    const regionConfig = year === 2025 ? ncaaRegions2025 : ncaaRegions2025; // Use 2025 as default
    
    // Build games for each region
    const allGames: GameDefinition[] = [];
    const regions: Record<string, RegionDefinition> = {};
    
    // NCAA pairings (1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15)
    const ncaaPairings: [number, number][] = [
      [1, 16], [8, 9], [5, 12], [4, 13], 
      [6, 11], [3, 14], [7, 10], [2, 15]
    ];
    
    Object.entries(regionConfig).forEach(([regionName, teamIds]) => {
      // Get teams for this region
      const regionTeams = teamIds.map(id => teamsById.get(id)).filter(Boolean) as Team[];
      
      if (regionTeams.length !== 16) {
        console.warn(`Region ${regionName} has ${regionTeams.length} teams, expected 16`);
      }
      
      // Sort by seed
      regionTeams.sort((a, b) => (a.seed || 999) - (b.seed || 999));
      
      // Build games for this region
      const regionGames = buildSingleEliminationGames(regionName, regionTeams, ncaaPairings);
      allGames.push(...regionGames);
      
      regions[regionName] = {
        name: regionName,
        teams: regionTeams.map(t => t.id),
        gameIds: regionGames.map(g => g.id)
      };
    });

    // Build Final Four games
    const regionNames = Object.keys(regionConfig);
    const finalGames = buildFinalGames(regionNames, 'final-four', false, allGames);
    allGames.push(...finalGames);

    // Add Final region
    regions['Final'] = {
      name: 'Final',
      teams: [], // Teams come from region winners
      gameIds: finalGames.map(g => g.id)
    };

    // Build rounds
    const rounds = this.buildNcaaRounds();

    // Normalize teams and games
    const normalizedTeams = this.normalizeTeams(teamsData);
    const normalizedGames = this.normalizeGames(allGames);

    return {
      id: `ncaa-${year}`,
      name: `NCAA March Madness ${year}`,
      year,
      type: 'single-elimination',
      sport: 'basketball',
      league: 'NCAA',
      teams: normalizedTeams,
      games: normalizedGames,
      regions,
      rounds,
      advancement: {
        type: 'single-elimination',
        winCondition: 'higher-score'
      }
    };
  }

  /**
   * Build NBA Playoffs tournament
   */
  static nba(year: number, teamsData: Team[]): TournamentDefinition {
    // Create teams lookup
    const teamsById = new Map(teamsData.map(team => [team.id, team]));
    
    // Organize by conference
    const westTeams = teamsData.filter(t => t.conference === 'West').slice(0, 8);
    const eastTeams = teamsData.filter(t => t.conference === 'East').slice(0, 8);
    
    // Sort by seed
    westTeams.sort((a, b) => (a.seed || 999) - (b.seed || 999));
    eastTeams.sort((a, b) => (a.seed || 999) - (b.seed || 999));
    
    // NBA playoff pairings (1v8, 4v5, 2v7, 3v6)
    const nbaPairings: [number, number][] = [
      [1, 8], [4, 5], [2, 7], [3, 6]
    ];
    
    const allGames: GameDefinition[] = [];
    const regions: Record<string, RegionDefinition> = {};
    
    // Build West conference
    if (westTeams.length >= 8) {
      const westGames = buildSeriesGames('West', westTeams, nbaPairings, 7);
      allGames.push(...westGames);
      regions['West'] = {
        name: 'West',
        teams: westTeams.map(t => t.id),
        gameIds: westGames.map(g => g.id)
      };
    }
    
    // Build East conference
    if (eastTeams.length >= 8) {
      const eastGames = buildSeriesGames('East', eastTeams, nbaPairings, 7);
      allGames.push(...eastGames);
      regions['East'] = {
        name: 'East',
        teams: eastTeams.map(t => t.id),
        gameIds: eastGames.map(g => g.id)
      };
    }

    // Build Finals
    const finalGames = buildFinalGames(['West', 'East'], 'conference-finals', true, allGames);
    allGames.push(...finalGames);

    regions['Final'] = {
      name: 'Final',
      teams: [],
      gameIds: finalGames.map(g => g.id)
    };

    // Build rounds
    const rounds = this.buildNbaRounds();

    // Normalize
    const normalizedTeams = this.normalizeTeams(teamsData);
    const normalizedGames = this.normalizeGames(allGames);

    return {
      id: `nba-${year}`,
      name: `NBA Playoffs ${year}`,
      year,
      type: 'series',
      sport: 'basketball',
      league: 'NBA',
      teams: normalizedTeams,
      games: normalizedGames,
      regions,
      rounds,
      advancement: {
        type: 'best-of-series',
        seriesLength: 7,
        winCondition: 'series-wins'
      }
    };
  }

  /**
   * Build UEFA Champions League tournament
   */
  static ucl(year: number, teamsData: Team[]): TournamentDefinition {
    // UCL uses draw-based structure, split teams into two sides based on seeding
    const sortedTeams = [...teamsData].sort((a, b) => (a.seed || 999) - (b.seed || 999));
    
    // Split teams into two sides (8 teams each for Round of 16)
    const sideATeams = sortedTeams.slice(0, 8);
    const sideBTeams = sortedTeams.slice(8, 16);
    
    // UCL knockout pairings (drawn matchups)
    const uclPairings: [number, number][] = [
      [1, 2], [3, 4], [5, 6], [7, 8]
    ];
    
    const allGames: GameDefinition[] = [];
    const regions: Record<string, RegionDefinition> = {};
    
    // Build Side A (Top half of the bracket)
    if (sideATeams.length >= 4) {
      const sideAGames = buildSingleEliminationGames('SideA', sideATeams, uclPairings);
      allGames.push(...sideAGames);
      regions['SideA'] = {
        name: 'SideA',
        teams: sideATeams.map(t => t.id),
        gameIds: sideAGames.map(g => g.id)
      };
    }
    
    // Build Side B (Bottom half of the bracket)
    if (sideBTeams.length >= 4) {
      const sideBGames = buildSingleEliminationGames('SideB', sideBTeams, uclPairings);
      allGames.push(...sideBGames);
      regions['SideB'] = {
        name: 'SideB',
        teams: sideBTeams.map(t => t.id),
        gameIds: sideBGames.map(g => g.id)
      };
    }

    // Build Final
    const finalGames = buildFinalGames(['SideA', 'SideB'], 'single-final', false, allGames);
    allGames.push(...finalGames);

    regions['Final'] = {
      name: 'Final',
      teams: [],
      gameIds: finalGames.map(g => g.id)
    };

    // Build rounds
    const rounds = this.buildUclRounds();

    // Normalize
    const normalizedTeams = this.normalizeTeams(teamsData);
    const normalizedGames = this.normalizeGames(allGames);

    return {
      id: `ucl-${year}`,
      name: `UEFA Champions League ${year}`,
      year,
      type: 'draw-based',
      sport: 'football',
      league: 'UEFA',
      teams: normalizedTeams,
      games: normalizedGames,
      regions,
      rounds,
      advancement: {
        type: 'single-elimination',
        winCondition: 'higher-score'
      }
    };
  }

  /**
   * Build NCAA rounds definition
   */
  private static buildNcaaRounds(): Round[] {
    return [
      { number: 0, name: 'First Round', gamesPerRegion: 8, isRegionalFinal: false, isFinal: false },
      { number: 1, name: 'Round of 32', gamesPerRegion: 4, isRegionalFinal: false, isFinal: false },
      { number: 2, name: 'Sweet 16', gamesPerRegion: 2, isRegionalFinal: false, isFinal: false },
      { number: 3, name: 'Elite Eight', gamesPerRegion: 1, isRegionalFinal: true, isFinal: false },
      { number: 4, name: 'Final Four', gamesPerRegion: 2, isRegionalFinal: false, isFinal: false },
      { number: 5, name: 'Championship', gamesPerRegion: 1, isRegionalFinal: false, isFinal: true }
    ];
  }

  /**
   * Build NBA rounds definition
   */
  private static buildNbaRounds(): Round[] {
    return [
      { number: 0, name: 'First Round', gamesPerRegion: 4, isRegionalFinal: false, isFinal: false },
      { number: 1, name: 'Conference Semifinals', gamesPerRegion: 2, isRegionalFinal: false, isFinal: false },
      { number: 2, name: 'Conference Finals', gamesPerRegion: 1, isRegionalFinal: true, isFinal: false },
      { number: 3, name: 'NBA Finals', gamesPerRegion: 1, isRegionalFinal: false, isFinal: true }
    ];
  }

  /**
   * Build UCL rounds definition
   */
  private static buildUclRounds(): Round[] {
    return [
      { number: 0, name: 'Round of 16', gamesPerRegion: 4, isRegionalFinal: false, isFinal: false },
      { number: 1, name: 'Quarterfinals', gamesPerRegion: 2, isRegionalFinal: false, isFinal: false },
      { number: 2, name: 'Semifinals', gamesPerRegion: 1, isRegionalFinal: true, isFinal: false },
      { number: 3, name: 'Final', gamesPerRegion: 1, isRegionalFinal: false, isFinal: true }
    ];
  }

  /**
   * Normalize teams into a lookup object
   */
  private static normalizeTeams(teams: Team[]): Record<string, Team> {
    return teams.reduce((acc, team) => {
      acc[team.id] = team;
      return acc;
    }, {} as Record<string, Team>);
  }

  /**
   * Normalize games into a lookup object
   */
  private static normalizeGames(games: GameDefinition[]): Record<string, GameDefinition> {
    return games.reduce((acc, game) => {
      acc[game.id] = game;
      return acc;
    }, {} as Record<string, GameDefinition>);
  }
}
