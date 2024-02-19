import { RoundOf16_1 } from "./r16";

export const QuarterFinals1 = {
    '@id': 'QF1',
    'id': 'b6e869cc-e6ad-4151-91-5df82458',
    'name': 'QF1',
    'scheduled': 1499547600000,
    'court': { '@ref': '16' },
    'sides': {
        'home': {
            'team': {
                '@id': 'URUGUAY',
                'id': 'uruguay-id',
                'name': 'Uruguay',
            },
            'score': { 'score': 0, 'notes': null },
            'seed': { 'sourceGame': null, 'sourcePool': { '@ref': '14' }, 'rank': 1, 'displayName': '2nd place of A' }
        },
        'visitor': {
            'team': { '@ref': 'FRANCE' },
            'score': { 'score': 2, 'notes': null },
            'seed': {
                'sourceGame': RoundOf16_1,
                'sourcePool': { '@ref': '12' },
                'rank': 1,
                'displayName': 'Winner Round of 16'
            }
        }
    }
}

export const QuarterFinals2 = {
    '@id': 'QF2',
    'id': 'b6e869cc-e6ad-41-5df82458',
    'name': 'QF2',
    'scheduled': 1499547600000,
    'court': { '@ref': '16' },
    'sides': {
        'home': {
            'team': {
                '@id': 'BRAZIL',
                'id': 'brazil-id',
                'name': 'Brazil',
            },
            'score': { 'score': 1, 'notes': null },
            'seed': { 'sourceGame': null, 'sourcePool': { '@ref': '14' }, 'rank': 1, 'displayName': '2nd place of A' }
        },
        'visitor': {
            'team': { '@ref': 'BELGIUM' },
            'score': { 'score': 2, 'notes': null },
            'seed': { 'sourceGame': null, 'sourcePool': { '@ref': '12' }, 'rank': 1, 'displayName': '3rd place of B' }
        }
    }
}

export const QuarterFinals3 = {
    '@id': 'QF3',
    'id': 'b6e869ccad-41-5df82458',
    'name': 'QF3',
    'scheduled': 1499547600000,
    'court': { '@ref': '16' },
    'sides': {
        'home': {
            'team': {
                '@id': 'RUSSIA',
                'id': 'russia-id',
                'name': 'Russia',
            },
            'score': { 'score': 3, 'notes': '(3)' },
            'seed': { 'sourceGame': null, 'sourcePool': { '@ref': '14' }, 'rank': 1, 'displayName': '2nd place of A' }
        },
        'visitor': {
            'team': { '@ref': 'CROATIA' },
            'score': { 'score': 4, 'notes': '(4)' },
            'seed': { 'sourceGame': null, 'sourcePool': { '@ref': '12' }, 'rank': 1, 'displayName': '3rd place of B' }
        }
    }
}


export const QuarterFinals4 = {
    '@id': 'QF4',
    'id': 'b669ccad-41-5df82458',
    'name': 'QF4',
    'scheduled': 1499547600000,
    'court': { '@ref': '16' },
    'sides': {
        'home': {
            'team': {
                '@id': 'SWEDEN',
                'id': 'sweden-id',
                'name': 'Sweden',
            },
            'score': { 'score': 0, 'notes': null },
            'seed': { 'sourceGame': null, 'sourcePool': { '@ref': '14' }, 'rank': 1, 'displayName': '2nd place of A' }
        },
        'visitor': {
            'team': { '@ref': 'ENGLAND' },
            'score': { 'score': 2, 'notes': null },
            'seed': { 'sourceGame': null, 'sourcePool': { '@ref': '12' }, 'rank': 1, 'displayName': '3rd place of B' }
        }
    }
}
