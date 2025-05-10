import type { TournamentStructure, BracketData, SeedMeta } from '@/types';

export const teamsData: SeedMeta[] = [
    { name: 'golden-state', logo: '/logos/golden-state.png', color: 'gold' },
    { name: 'san-antonio', logo: '/logos/san-antonio.png', color: 'graphite' },
    { name: 'houston', logo: '/logos/houston.png', color: 'crimson' },
    { name: 'la-clippers', logo: '/logos/la-clippers.png', color: 'ocean' },
    { name: 'utah', logo: '/logos/utah.png', color: 'plum' },
    { name: 'oklahoma-city', logo: '/logos/oklahoma-city.png', color: 'tangerine' },
    { name: 'memphis', logo: '/logos/memphis.png', color: 'navy' },
    { name: 'portland', logo: '/logos/portland.png', color: 'rust' },
    { name: 'boston', logo: '/logos/boston.png', color: 'crimson' },
    { name: 'cleveland', logo: '/logos/cleveland.png', color: 'crimson' },
    { name: 'toronto', logo: '/logos/toronto.png', color: 'crimson' },
    { name: 'washington', logo: '/logos/washington.png', color: 'crimson' },
    { name: 'atlanta', logo: '/logos/atlanta.png', color: 'crimson' },
    { name: 'milwaukee', logo: '/logos/milwaukee.png', color: 'crimson' },
    { name: 'indiana', logo: '/logos/indiana.png', color: 'crimson' },
    { name: 'chicago', logo: '/logos/chicago.png', color: 'crimson' }
];

export const tournamentData: TournamentStructure = {
    regions: {
        West: {
            seeds: {
                1: 'golden-state', 2: 'san-antonio', 3: 'houston', 4: 'la-clippers',
                5: 'utah', 6: 'oklahoma-city', 7: 'memphis', 8: 'portland'
            },
            rounds: [
                [1,8,4,5,2,7,3,6],
                [1,5,2,3],
                [1,2]
            ],
            games: [
                [ [1,1,1,1], [5,4,4,5,5,4,5], [2,2,7,7,2,2], [3,3,6,3,3] ],
                [ [1], [3] ],
                [ [1,2] ]
            ]
        },
        East: {
            seeds: {
                1: 'boston', 2: 'cleveland', 3: 'toronto', 4: 'washington',
                5: 'atlanta', 6: 'milwaukee', 7: 'indiana', 8: 'chicago'
            },
            rounds: [
                [1,8,4,5,2,7,3,6],
                [1,4,2,3],
                [4,2]
            ],
            games: [
                [ [8,8,1,1,1,1], [4,4,5,5,4,4], [2,2,2,2], [6,3,6,3,3,3] ],
                [ [1,1], [2] ],
                [ [4,2] ]
            ]
        }
    },
    final: {
        seeds: {
            east: {
                1:'boston', 2:'cleveland', 3:'toronto', 4:'washington',
                5:'atlanta', 6:'milwaukee', 7:'indiana', 8:'chicago'
            },
            west: {
                1:'golden-state', 2:'san-antonio', 3:'houston', 4:'la-clippers',
                5:'utah', 6:'oklahoma-city', 7:'memphis', 8:'portland'
            }
        },
        rounds: [[2,1]],
        games: []
    }
};

export const bracketData: BracketData = {
    moses: {
        regions: {
            West: {
                matchups: [[], [1,4,2,3], [1,2]],
                games: [[5,5,6,7], [4,7], [6]]
            },
            East: {
                matchups: [[], [1,4,2,3], [4,2]],
                games: [[6,6,6,5], [7,5], [5]]
            }
        },
        final: {
            matchups: [[['east',2],['west',1]]],
            games: [[6]],
            winner: 'Golden State'
        }
    },
    victor: {
        regions: {
            West: { matchups:[[],[1,5,2,3],[1,3]], games:[[4,6,6,6],[5,6],[7]] },
            East: { matchups:[[],[1,4,2,3],[1,2]], games:[[5,5,6,6],[6,5],[5]] }
        },
        final: {
            matchups: [[['east',2],['west',3]]],
            games: [[7]],
            winner: 'Cleveland'
        }
    },
    linus: {
        regions: {
            West: { matchups:[[],[1,5,2,3],[1,2]], games:[[5,6,4,5],[6,6],[6]] },
            East: { matchups:[[],[1,4,2,6],[1,2]], games:[[6,5,5,6],[5,6],[6]] }
        },
        final: {
            matchups: [[['east',2],['west',1]]],
            games: [[7]],
            winner: 'Cleveland'
        }
    }
};
