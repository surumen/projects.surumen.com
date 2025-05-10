import type { TournamentStructure } from '@/types';

export const ncaaTournamentData: TournamentStructure = {
    regions: {
        West: {
            seeds: {
                1: 'unc',
                2: 'arizona',
                3: 'baylor',
                4: 'alabama',
                5: 'saint-marys',
                6: 'clemson',
                7: 'dayton',
                8: 'mississippi-state',
                9: 'michigan-state',
                10: 'nevada',
                11: 'new-mexico',
                12: 'grand-canyon',
                13: 'college-of-charleston',
                14: 'colgate',
                15: 'long-beach-state',
                16: 'wagner',
            },
            // seeds remaining by round: R64 → R32 → S16 → E8 finalists
            rounds: [
                [1,16,8,9,5,12,4,13,6,11,3,14,7,10,2,15],
                [1,9,12,4,6,3,7,2],
                [1,4,6,2],
                [4,6]
            ],
            // actual match-ups each round
            games: [
                // Round of 64
                [[1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15]],
                // Round of 32
                [[1,9],[12,4],[6,3],[7,2]],
                // Sweet 16
                [[1,4],[6,2]],
                // Elite 8 (region final)
                [[4,6]]
            ]
        },

        East: {
            seeds: {
                1: 'uconn',
                2: 'iowa-state',
                3: 'illinois',
                4: 'auburn',
                5: 'san-diego-state',
                6: 'byu',
                7: 'washington-state',
                8: 'florida-atlantic',
                9: 'northwestern',
                10: 'drake',
                11: 'duquesne',
                12: 'uab',
                13: 'yale',
                14: 'morehead-state',
                15: 'south-dakota-state',
                16: 'stetson',
            },
            rounds: [
                [1,16,8,9,5,12,4,13,6,11,3,14,7,10,2,15],
                [1,9,5,4,11,3,7,2],
                [1,4,3,2],
                [1,3]
            ],
            games: [
                [[1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15]],
                [[1,9],[5,4],[11,3],[7,2]],
                [[1,4],[3,2]],
                [[1,3]]
            ]
        },

        Midwest: {
            seeds: {
                1: 'purdue',
                2: 'tennessee',
                3: 'creighton',
                4: 'kansas',
                5: 'gonzaga',
                6: 'south-carolina',
                7: 'texas',
                8: 'utah-state',
                9: 'tcu',
                10: 'colorado-state',
                11: 'oregon',
                12: 'mcneese-state',
                13: 'samford',
                14: 'akron',
                15: 'st-peters',
                16: 'grambling',
            },
            rounds: [
                [1,16,8,9,5,12,4,13,6,11,3,14,7,10,2,15],
                [1,8,5,4,11,3,7,2],
                [1,4,3,2],
                [1,2]
            ],
            games: [
                [[1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15]],
                [[1,8],[5,4],[11,3],[7,2]],
                [[1,4],[3,2]],
                [[1,2]]
            ]
        },

        South: {
            seeds: {
                1: 'houston',
                2: 'marquette',
                3: 'kentucky',
                4: 'duke',
                5: 'wisconsin',
                6: 'texas-tech',
                7: 'florida',
                8: 'nebraska',
                9: 'texas-a&m',
                10: 'colorado',
                11: 'nc-state',
                12: 'james-madison',
                13: 'vermont',
                14: 'oakland',
                15: 'western-kentucky',
                16: 'longwood',
            },
            rounds: [
                [1,16,8,9,5,12,4,13,6,11,3,14,7,10,2,15],
                [1,9,12,4,11,14,10,2],
                [1,4,11,2],
                [11,4]
            ],
            games: [
                [[1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15]],
                [[1,9],[12,4],[11,14],[10,2]],
                [[1,4],[11,2]],
                [[11,4]]
            ]
        }
    },

    // The Final Four and Championship
    final: {
        seeds: {
            East: {1: 'uconn'},
            West: {1: 'alabama'},
            Midwest: {1: 'purdue'},
            South: {1: 'nc-state'}
        },
        rounds: [
            [1,1,1,1],  // four regional champs
            [1,1]       // two finalists
        ],
        games: [
            [[1,1],[1,1]],  // UConn vs Alabama, Purdue vs NC State in semis
            [[1,1]]         // UConn vs Purdue in the title game
        ]
    }
};
