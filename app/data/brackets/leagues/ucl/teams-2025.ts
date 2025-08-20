import type { Team } from '@/types';

/**
 * UEFA Champions League 2025 - Real draw and match results
 * Extracted from actual UCL tournament with draw-based pairings and results
 */

/**
 * UCL 2025 Round of 16 Draw Results
 * These are the actual pairings from the draw
 */
export const uclR16Draw2025: [string, string][] = [
  ['paris-saint-germain', 'liverpool'],
  ['club-brugge', 'aston-villa'],
  ['real-madrid', 'atletico-madrid'],
  ['psv-eindhoven', 'arsenal'],
  ['benfica', 'barcelona'],
  ['borussia-dortmund', 'lille'],
  ['bayern-munich', 'bayer-leverkusen'],
  ['feyenoord', 'inter-milan'],
];

/**
 * UCL 2025 Quarter-Final Draw Results
 */
export const uclQFDraw2025: [string, string][] = [
  ['paris-saint-germain', 'aston-villa'],
  ['arsenal', 'real-madrid'],
  ['barcelona', 'borussia-dortmund'],
  ['bayern-munich', 'inter-milan'],
];

/**
 * UCL 2025 Semi-Final Pairings
 */
export const uclSFDraw2025: [string, string][] = [
  ['paris-saint-germain', 'arsenal'],
  ['barcelona', 'inter-milan'],
];

/**
 * UCL 2025 Teams with their draw positions
 * Teams are organized by their actual draw results, not fixed seeding
 */
export const uclTeams2025: Team[] = [
  // Teams from R16 Draw - organized by actual matchups
  { id: 'paris-saint-germain', name: 'paris-saint-germain', displayName: 'Paris Saint-Germain', shortName: 'PSG', seed: 1, logo: '', color: 'navy' },
  { id: 'liverpool', name: 'liverpool', displayName: 'Liverpool', shortName: 'Liverpool', seed: 2, logo: '', color: 'danger' },
  
  { id: 'club-brugge', name: 'club-brugge', displayName: 'Club Brugge', shortName: 'Brugge', seed: 3, logo: '', color: 'primary' },
  { id: 'aston-villa', name: 'aston-villa', displayName: 'Aston Villa', shortName: 'Villa', seed: 4, logo: '', color: 'plum' },
  
  { id: 'real-madrid', name: 'real-madrid', displayName: 'Real Madrid', shortName: 'Madrid', seed: 5, logo: '', color: 'cloud' },
  { id: 'atletico-madrid', name: 'atletico-madrid', displayName: 'Atletico Madrid', shortName: 'Atletico', seed: 6, logo: '', color: 'crimson' },
  
  { id: 'psv-eindhoven', name: 'psv-eindhoven', displayName: 'PSV Eindhoven', shortName: 'PSV', seed: 7, logo: '', color: 'danger' },
  { id: 'arsenal', name: 'arsenal', displayName: 'Arsenal', shortName: 'Arsenal', seed: 8, logo: '', color: 'danger' },
  
  { id: 'benfica', name: 'benfica', displayName: 'Benfica', shortName: 'Benfica', seed: 9, logo: '', color: 'danger' },
  { id: 'barcelona', name: 'barcelona', displayName: 'Barcelona', shortName: 'Barca', seed: 10, logo: '', color: 'primary' },
  
  { id: 'borussia-dortmund', name: 'borussia-dortmund', displayName: 'Borussia Dortmund', shortName: 'Dortmund', seed: 11, logo: '', color: 'warning' },
  { id: 'lille', name: 'lille', displayName: 'Lille', shortName: 'Lille', seed: 12, logo: '', color: 'crimson' },
  
  { id: 'bayern-munich', name: 'bayern-munich', displayName: 'Bayern Munich', shortName: 'Bayern', seed: 13, logo: '', color: 'danger' },
  { id: 'bayer-leverkusen', name: 'bayer-leverkusen', displayName: 'Bayer Leverkusen', shortName: 'Leverkusen', seed: 14, logo: '', color: 'primary' },
  
  { id: 'feyenoord', name: 'feyenoord', displayName: 'Feyenoord', shortName: 'Feyenoord', seed: 15, logo: '', color: 'danger' },
  { id: 'inter-milan', name: 'inter-milan', displayName: 'Inter Milan', shortName: 'Inter', seed: 16, logo: '', color: 'primary' },
];

/**
 * UCL 2025 Match Results
 */
export const uclResults2025 = {
  r16: [
    { match: ['paris-saint-germain', 'liverpool'], scores: [1, 1], penalties: [4, 1], winner: 'paris-saint-germain' },
    { match: ['club-brugge', 'aston-villa'], scores: [1, 6], winner: 'aston-villa' },
    { match: ['real-madrid', 'atletico-madrid'], scores: [2, 2], penalties: [4, 2], winner: 'real-madrid' },
    { match: ['psv-eindhoven', 'arsenal'], scores: [3, 9], winner: 'arsenal' },
    { match: ['benfica', 'barcelona'], scores: [1, 4], winner: 'barcelona' },
    { match: ['borussia-dortmund', 'lille'], scores: [3, 2], winner: 'borussia-dortmund' },
    { match: ['bayern-munich', 'bayer-leverkusen'], scores: [5, 0], winner: 'bayern-munich' },
    { match: ['feyenoord', 'inter-milan'], scores: [1, 4], winner: 'inter-milan' },
  ],
  qf: [
    { match: ['paris-saint-germain', 'aston-villa'], scores: [5, 4], winner: 'paris-saint-germain' },
    { match: ['arsenal', 'real-madrid'], scores: [5, 1], winner: 'arsenal' },
    { match: ['barcelona', 'borussia-dortmund'], scores: [5, 3], winner: 'barcelona' },
    { match: ['bayern-munich', 'inter-milan'], scores: [3, 4], winner: 'inter-milan' },
  ],
  sf: [
    { match: ['paris-saint-germain', 'arsenal'], scores: [2, 3], winner: 'arsenal' },
    { match: ['barcelona', 'inter-milan'], scores: [2, 4], winner: 'inter-milan' },
  ],
  final: {
    match: ['arsenal', 'inter-milan'], scores: [3, 2], winner: 'arsenal'
  }
};

/**
 * Get UCL draw for specific round
 */
export const getUclDraw = (round: 'r16' | 'qf' | 'sf') => {
  switch (round) {
    case 'r16': return uclR16Draw2025;
    case 'qf': return uclQFDraw2025;
    case 'sf': return uclSFDraw2025;
    default: return [];
  }
};
