// app/hooks/useBrackets.ts

import { useMemo, useState, useEffect } from 'react';
import { useBracketStore } from '@/store/bracketStore';
import { loadTournamentTeams } from '@/data/brackets/leagues';
import { TournamentBuilder } from '@/utils';
import { buildBracketView } from '@/utils';
import type { BracketView, TournamentDefinition, Team } from '@/types';

/**
 * Simple hooks for tournament management using Zustand
 */

export const useTournamentController = () => {
  const currentLeague = useBracketStore(state => state.currentLeague);
  const currentYear = useBracketStore(state => state.currentYear);
  const setLeague = useBracketStore(state => state.setLeague);
  const setYear = useBracketStore(state => state.setYear);
  const getActiveTournament = useBracketStore(state => state.getActiveTournament);
  
  return useMemo(() => ({
    activeTournament: getActiveTournament(),
    currentLeague,
    currentYear,
    
    setLeague,
    setYear,
    
    switchTo: (tournamentId: string) => {
      const [league, yearStr] = tournamentId.split('-');
      const year = parseInt(yearStr);
      setLeague(league);
      setYear(year);
    },
    
    isActive: (tournamentId: string) => {
      return tournamentId === getActiveTournament();
    }
  }), [currentLeague, currentYear, setLeague, setYear, getActiveTournament]);
};

export const useBracketController = () => {
  const advanceTeam = useBracketStore(state => state.advanceTeam);
  const removePick = useBracketStore(state => state.removePick);
  const resetBracket = useBracketStore(state => state.resetBracket);
  const clearAllPicks = useBracketStore(state => state.clearAllPicks);
  
  return useMemo(() => ({
    advanceTeam,
    removePick,
    resetBracket,
    clearAllPicks
  }), [advanceTeam, removePick, resetBracket, clearAllPicks]);
};

// Real bracket hook that loads actual tournament data
export const useBracket = (): BracketView | null => {
  const picks = useBracketStore(state => state.picks);
  const setTournamentGames = useBracketStore(state => state.setTournamentGames);
  const currentLeague = useBracketStore(state => state.currentLeague);
  const currentYear = useBracketStore(state => state.currentYear);
  
  const [tournament, setTournament] = useState<TournamentDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tournament data when league/year changes
  useEffect(() => {
    const loadTournament = async () => {
      if (!currentLeague || !currentYear) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load teams for the tournament
        const teams = await loadTournamentTeams(currentLeague, currentYear);
        
        // Build tournament structure
        let tournamentDef: TournamentDefinition;
        if (currentLeague === 'ncaa') {
          tournamentDef = TournamentBuilder.ncaa(currentYear, teams);
        } else if (currentLeague === 'nba') {
          tournamentDef = TournamentBuilder.nba(currentYear, teams);
        } else if (currentLeague === 'ucl') {
          tournamentDef = TournamentBuilder.ucl(currentYear, teams);
        } else {
          throw new Error(`Unsupported league: ${currentLeague}`);
        }
        
        setTournament(tournamentDef);
        
        // Set tournament games in store for efficient cascade logic
        const gameDefinitions = Object.values(tournamentDef.games);
        setTournamentGames(gameDefinitions);
        
      } catch (err) {
        console.error('Failed to load tournament:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tournament');
        setTournament(null);
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, [currentLeague, currentYear, setTournamentGames]);

  // Build bracket view from tournament + picks
  return useMemo(() => {
    if (!tournament) {
      return null;
    }

    try {
      return buildBracketView(tournament, picks);
    } catch (err) {
      console.error('Failed to build bracket view:', err);
      return null;
    }
  }, [tournament, picks]);
};

// Stub implementations for other hooks to prevent compilation errors
export const useBracketView = useBracket;
export const useBracketManager = useBracketController;
export const useTournamentManager = useTournamentController;
export const useRegionView = () => null;
export const useRegionRoundGames = () => [];
export const useFinalGames = () => [];
export const useAvailableGames = () => [];
export const useGameView = () => null;
export const useRegionChampion = () => null;
export const useTournamentChampion = () => null;
export const useBracketStats = () => ({
  completionPercentage: 0,
  userScore: 0,
  maxScore: 0,
  isComplete: false,
  totalGames: 0,
  completedGames: 0
});
export const useRegionStats = () => ({
  isComplete: false,
  totalGames: 0,
  completedGames: 0,
  hasChampion: false
});
export const useCanPickGame = () => false;
export const useGameTeams = () => ({ hasTeams: false });
