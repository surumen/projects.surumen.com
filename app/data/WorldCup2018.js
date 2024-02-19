import { SemiFinal1, SemiFinal2 } from './world-cup-18/sf';


export const WorldCup2018 = {
    '@id': '1',
    'id': '35b0745d-ef13-4255-8c40-c9daa95e4cc4',
    'name': 'Final',
    'scheduled': 1499551200000,

    'court': {
        '@id': '16',
        'id': 'ec7c9d92-c59a-450d-83df-2034d232f7b9',
        'name': 'COURT 1',
        'venue': { '@ref': '9' },
    },

    'sides': {
        'home': {
            'score': { 'score': 4, 'notes': null },
            'team': {
                '@id': 'FRANCE',
                'id': 'france-id',
                'name': 'France',
            },
            'seed': {
                'rank': 1,
                'displayName': 'Winner of SF1',
                'sourceGame': SemiFinal1

            }
        },

        'visitor': {
            'score': { 'score': 2, 'notes': null },
            'team': {
                '@id': 'CROATIA',
                'id': 'croatia-id',
                'name': 'Croatia',
            },
            'seed': {
                'rank': 1,
                'displayName': 'Winner of SF2',
                'sourceGame': SemiFinal2
            }
        },
    }

};