import { QuarterFinals1, QuarterFinals2, QuarterFinals3, QuarterFinals4 } from "./qf";

export const SemiFinal1 = {
    '@id': 'SF1',
    'id': 'b6e869cc-e6ad-4151-9186-5df828b4580',
    'name': 'SF1',
    'scheduled': 1499547600000,
    'court': { '@ref': '16' },
    'sides': {
        'home': {
            'team': { '@ref': 'FRANCE' },
            'score': { 'score': 1, 'notes': null },
            'seed': {
                'sourceGame': QuarterFinals1,
                'sourcePool': { '@ref': '14' },
                'rank': 1,
                'displayName': 'Winner of QF1'
            }
        },
        'visitor': {
            'team': { '@ref': 'BELGIUM' },
            'score': { 'score': 0, 'notes': null },
            'seed': {
                'sourceGame': QuarterFinals2,
                'sourcePool': { '@ref': '12' },
                'rank': 1,
                'displayName': 'Winner of QF2'
            }
        },
    }
};

export const SemiFinal2 = {
    '@id': 'SF2',
    'id': 'b6e869cc-e6ad-4151-9186-5df82458',
    'name': 'SF2',
    'scheduled': 1499547600000,
    'court': { '@ref': '16' },
    'sides': {
        'home': {
            'team': { '@ref': 'CROATIA' },
            'score': { 'score': 2, 'notes': null },
            'seed': {
                'sourceGame': QuarterFinals3,
                'sourcePool': { '@ref': '14' },
                'rank': 1,
                'displayName': 'Winner of QF3'
            }
        },
        'visitor': {
            'team': { '@ref': 'ENGLAND' },
            'score': { 'score': 1, 'notes': null },
            'seed': {
                'sourceGame': QuarterFinals4,
                'sourcePool': { '@ref': '12' },
                'rank': 1,
                'displayName': 'Winner of QF4'
            }
        }
    }
};

