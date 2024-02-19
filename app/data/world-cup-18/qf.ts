import {
    RoundOf16_M1,
    RoundOf16_M2,
    RoundOf16_M3,
    RoundOf16_M4,
    RoundOf16_M5,
    RoundOf16_M6,
    RoundOf16_M7, RoundOf16_M8
} from "./r16";

export const QuarterFinals1 = {
    '@id': 'QF1',
    'id': 'b6e869cc-e6ad-4151-91-5df82458',
    'name': 'QF1',
    'scheduled': 1499547600000,
    'court': { '@ref': '16' },
    'sides': {
        'home': {
            'team': { '@ref': 'URUGUAY' },
            'score': { 'score': 0, 'notes': null },
            'seed': {
                'sourceGame': RoundOf16_M2,
                'sourcePool': { '@ref': '14' }, 'rank': 1,
                'displayName': 'Winner Round of 16 M2'
            }
        },
        'visitor': {
            'team': { '@ref': 'FRANCE' },
            'score': { 'score': 2, 'notes': null },
            'seed': {
                'sourceGame': RoundOf16_M1,
                'sourcePool': { '@ref': '12' },
                'rank': 1,
                'displayName': 'Winner Round of 16 M1'
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
            'team': { '@ref': 'BRAZIL' },
            'score': { 'score': 1, 'notes': null },
            'seed': {
                'sourceGame': RoundOf16_M3,
                'sourcePool': { '@ref': '14' },
                'rank': 1,
                'displayName': 'Winner Round of 16 M3'
            }
        },
        'visitor': {
            'team': { '@ref': 'BELGIUM' },
            'score': { 'score': 2, 'notes': null },
            'seed': {
                'sourceGame': RoundOf16_M4,
                'sourcePool': { '@ref': '12' },
                'rank': 1,
                'displayName': 'Winner Round of 16 M4'
            }
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
            'team': { '@ref': 'RUSSIA' },
            'score': { 'score': 3, 'notes': '(3)' },
            'seed': {
                'sourceGame': RoundOf16_M5,
                'sourcePool': { '@ref': '14' },
                'rank': 1,
                'displayName': 'Winner Round of 16 M5'
            }
        },
        'visitor': {
            'team': { '@ref': 'CROATIA' },
            'score': { 'score': 4, 'notes': '(4)' },
            'seed': {
                'sourceGame': RoundOf16_M6,
                'sourcePool': { '@ref': '12' },
                'rank': 1,
                'displayName': 'Winner Round of 16 M6'
            }
        }
    }
}


export const QuarterFinals4 = {
    '@id': 'QF4',
    'id': 'b669ccad-41-5df82458-poj07wy',
    'name': 'QF4',
    'scheduled': 1499547600000,
    'court': { '@ref': '16' },
    'sides': {
        'home': {
            'team': { '@ref': 'SWEDEN' },
            'score': { 'score': 0, 'notes': null },
            'seed': {
                'sourceGame': RoundOf16_M7,
                'sourcePool': { '@ref': '14' },
                'rank': 1,
                'displayName': 'Winner Round of 16 M7'
            }
        },
        'visitor': {
            'team': { '@ref': 'ENGLAND' },
            'score': { 'score': 2, 'notes': null },
            'seed': {
                'sourceGame': RoundOf16_M8,
                'sourcePool': { '@ref': '12' },
                'rank': 1,
                'displayName': 'Winner Round of 16 M8'
            }
        }
    }
}
