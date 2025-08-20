// app/store/bracketStore.ts - Modern Zustand bracket store
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type { GameDefinition, GamePick } from '@/types';

/**
 * Get teams playing in a game (handles both direct assignment and source games)
 */
function getTeamsInGame(game: GameDefinition, picks: Record<string, GamePick>): [string?, string?] {
  // Handle direct team assignment (Round 1 games)
  if (game.team1Id && game.team2Id) {
    return [game.team1Id, game.team2Id];
  }
  
  // Handle source-based assignment (later rounds)
  const team1 = game.sourceGame1Id ? picks[game.sourceGame1Id]?.winnerId : undefined;
  const team2 = game.sourceGame2Id ? picks[game.sourceGame2Id]?.winnerId : undefined;
  return [team1, team2];
}

/**
 * Get the losing team ID from a game when a winner is selected
 */
function getLosingTeamId(gameId: string, winnerId: string, allGames: GameDefinition[], currentPicks: Record<string, GamePick>): string | null {
  const game = allGames.find(g => g.id === gameId);
  if (!game) return null;
  
  // Get both teams in this game
  const [team1, team2] = getTeamsInGame(game, currentPicks);
  
  // The losing team is the one that didn't win
  if (team1 === winnerId) return team2 || null;
  if (team2 === winnerId) return team1 || null;
  
  return null;
}

interface BracketState {
  // Current tournament selection
  currentLeague: string;
  currentYear: number;
  
  // User picks for games
  picks: Record<string, GamePick>;
  
  // Tournament games for path traversal
  tournamentGames: GameDefinition[];
  
  // Actions
  setLeague: (league: string) => void;
  setYear: (year: number) => void;
  setTournament: (league: string, year: number) => void;
  setTournamentGames: (games: GameDefinition[]) => void;
  advanceTeam: (gameId: string, winnerId: string, score?: [number, number]) => void;
  removePick: (gameId: string) => void;
  resetBracket: () => void;
  clearAllPicks: () => void;
  
  // Computed
  getActiveTournament: () => string;
}

export const useBracketStore = create<BracketState>()(
  persist(
    immer((set, get) => ({
      currentLeague: 'ncaa',
      currentYear: 2025,
      picks: {},
      tournamentGames: [],
      
      setLeague: (league) => set((state) => {
        state.currentLeague = league;
      }),
      
      setYear: (year) => set((state) => {
        state.currentYear = year;
      }),
      
      setTournament: (league, year) => set((state) => {
        state.currentLeague = league;
        state.currentYear = year;
      }),
      
      setTournamentGames: (games) => set((state) => {
        // Store games for path traversal
        state.tournamentGames = games;
      }),
      
      advanceTeam: (gameId, winnerId, score) => set((state) => {
        // MAIN ALGORITHM
        // 1. Determine eliminated team BEFORE setting new pick
        const eliminatedTeam = getLosingTeamId(gameId, winnerId, state.tournamentGames, state.picks);
        
        // 2. Set the new pick
        state.picks[gameId] = {
          gameId,
          winnerId,
          score,
          timestamp: Date.now()
        };
        
        // 3. Remove eliminated team from downstream path
        if (eliminatedTeam) {
          const removeTeamFromDownstreamPath = (eliminatedTeam: string, startGameId: string) => {
            const visited = new Set<string>();
            
            const traverseDownstream = (currentGameId: string) => {
              // Find all games that reference this game as a source
              const nextGames = state.tournamentGames.filter(game => 
                game.sourceGame1Id === currentGameId || game.sourceGame2Id === currentGameId
              );
              
              nextGames.forEach(nextGame => {
                if (visited.has(nextGame.id)) return;
                visited.add(nextGame.id);
                
                // Check if eliminated team was the winner of this downstream game
                const pick = state.picks[nextGame.id];
                if (pick && pick.winnerId === eliminatedTeam) {
                  // Remove the pick entirely since the team can no longer advance
                  delete state.picks[nextGame.id];
                  
                  // Continue following this team's path
                  traverseDownstream(nextGame.id);
                } else {
                  // Check if team would be in this game via source resolution
                  const [team1, team2] = getTeamsInGame(nextGame, state.picks);
                  if (team1 === eliminatedTeam || team2 === eliminatedTeam) {
                    // Team would be in this game, continue traversal
                    traverseDownstream(nextGame.id);
                  }
                }
              });
            };
            
            traverseDownstream(startGameId);
          };
          
          removeTeamFromDownstreamPath(eliminatedTeam, gameId);
        }
      }),
      
      removePick: (gameId) => set((state) => {
        const removedPick = state.picks[gameId];
        delete state.picks[gameId];
        
        // Follow the removed team's path and remove from downstream games
        if (removedPick && removedPick.winnerId) {
          const removeTeamFromDownstreamPath = (eliminatedTeam: string, startGameId: string) => {
            const visited = new Set<string>();
            
            const traverseDownstream = (currentGameId: string) => {
              const nextGames = state.tournamentGames.filter(game => 
                game.sourceGame1Id === currentGameId || game.sourceGame2Id === currentGameId
              );
              
              nextGames.forEach(nextGame => {
                if (visited.has(nextGame.id)) return;
                visited.add(nextGame.id);
                
                const pick = state.picks[nextGame.id];
                if (pick && pick.winnerId === eliminatedTeam) {
                  // Remove the pick since the team can no longer advance
                  delete state.picks[nextGame.id];
                  
                  // Continue following this team's path
                  traverseDownstream(nextGame.id);
                }
              });
            };
            
            traverseDownstream(startGameId);
          };
          
          removeTeamFromDownstreamPath(removedPick.winnerId, gameId);
        }
      }),
      
      resetBracket: () => set((state) => {
        state.picks = {};
      }),
      
      clearAllPicks: () => set((state) => {
        state.picks = {};
      }),
      
      getActiveTournament: () => {
        const { currentLeague, currentYear } = get();
        return `${currentLeague}-${currentYear}`;
      }
    })),
    {
      name: 'bracket-storage',
      partialize: (state) => ({
        currentLeague: state.currentLeague,
        currentYear: state.currentYear,
        picks: state.picks
      })
    }
  )
);
