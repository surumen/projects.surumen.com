import type { Team } from '@/types';

/**
 * NBA Playoffs 2025 - Real seeding data
 * Extracted from actual playoff seeding with proper 1-8 seeds per conference
 * Uses the conference property which is part of the Team interface for NBA
 */
export const nbaTeams2025: Team[] = [
  // Western Conference - Seeds 1-8
  { id: 'oklahoma-city', name: 'oklahoma-city', displayName: 'Oklahoma City Thunder', shortName: 'Thunder', seed: 1, conference: 'West', logo: 'https://sports.cbsimg.net/fly/images/team-logos/1628527.svg', color: 'blue' },
  { id: 'houston', name: 'houston', displayName: 'Houston Rockets', shortName: 'Rockets', seed: 2, conference: 'West', logo: 'https://sports.cbsimg.net/fly/images/team-logos/342.svg', color: 'red' },
  { id: 'los-angeles-lakers', name: 'los-angeles-lakers', displayName: 'Los Angeles Lakers', shortName: 'Lakers', seed: 3, conference: 'West', logo: 'https://sports.cbsimg.net/fly/images/team-logos/345.svg', color: 'primary' },
  { id: 'denver', name: 'denver', displayName: 'Denver Nuggets', shortName: 'Nuggets', seed: 4, conference: 'West', logo: 'https://sports.cbsimg.net/fly/images/team-logos/339.svg', color: 'cloud' },
  { id: 'los-angeles-clippers', name: 'los-angeles-clippers', displayName: 'Los Angeles Clippers', shortName: 'Clippers', seed: 5, conference: 'West', logo: 'https://sports.cbsimg.net/fly/images/team-logos/344.svg', color: 'tangerine' },
  { id: 'minnesota', name: 'minnesota', displayName: 'Minnesota Timberwolves', shortName: 'Timberwolves', seed: 6, conference: 'West', logo: 'https://sports.cbsimg.net/fly/images/team-logos/348.svg', color: 'plum' },
  { id: 'golden-state', name: 'golden-state', displayName: 'Golden State Warriors', shortName: 'Warriors', seed: 7, conference: 'West', logo: 'https://sports.cbsimg.net/fly/images/team-logos/341.svg', color: 'gold' },
  { id: 'memphis', name: 'memphis', displayName: 'Memphis Grizzlies', shortName: 'Grizzlies', seed: 8, conference: 'West', logo: 'https://sports.cbsimg.net/fly/images/team-logos/360.svg', color: 'navy' },

  // Eastern Conference - Seeds 1-8
  { id: 'cleveland', name: 'cleveland', displayName: 'Cleveland Cavaliers', shortName: 'Cavaliers', seed: 1, conference: 'East', logo: 'https://sports.cbsimg.net/fly/images/team-logos/337.svg', color: 'crimson' },
  { id: 'boston', name: 'boston', displayName: 'Boston Celtics', shortName: 'Celtics', seed: 2, conference: 'East', logo: 'https://sports.cbsimg.net/fly/images/team-logos/334.svg', color: 'secondary' },
  { id: 'new-york-knicks', name: 'new-york-knicks', displayName: 'New York Knicks', shortName: 'Knicks', seed: 3, conference: 'East', logo: 'https://sports.cbsimg.net/fly/images/team-logos/350.svg', color: 'orange' },
  { id: 'indiana', name: 'indiana', displayName: 'Indiana Pacers', shortName: 'Pacers', seed: 4, conference: 'East', logo: 'https://sports.cbsimg.net/fly/images/team-logos/343.svg', color: 'yellow' },
  { id: 'milwaukee', name: 'milwaukee', displayName: 'Milwaukee Bucks', shortName: 'Bucks', seed: 5, conference: 'East', logo: 'https://sports.cbsimg.net/fly/images/team-logos/347.svg', color: 'warning' },
  { id: 'detroit', name: 'detroit', displayName: 'Detroit Pistons', shortName: 'Pistons', seed: 6, conference: 'East', logo: 'https://sports.cbsimg.net/fly/images/team-logos/340.svg', color: 'danger' },
  { id: 'orlando', name: 'orlando', displayName: 'Orlando Magic', shortName: 'Magic', seed: 7, conference: 'East', logo: 'https://sports.cbsimg.net/fly/images/team-logos/351.svg', color: 'blue' },
  { id: 'miami', name: 'miami', displayName: 'Miami Heat', shortName: 'Heat', seed: 8, conference: 'East', logo: 'https://sports.cbsimg.net/fly/images/team-logos/346.svg', color: 'danger' },
];
