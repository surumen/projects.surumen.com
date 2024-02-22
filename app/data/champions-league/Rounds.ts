import { v4 as uuid } from 'uuid';
import { TournamentRound } from '@/types/Tournament';

export const TOURNAMENT_ROUNDS_MAP = [
    { name: 'Final', sourceGame: null },

    { name: 'SF1', sourceGame: 'Final' },
    { name: 'SF2', sourceGame: 'Final' },

    { name: 'QF1', sourceGame: 'SF1' },
    { name: 'QF2', sourceGame: 'SF1' },
    { name: 'QF3', sourceGame: 'SF2' },
    { name: 'QF4', sourceGame: 'SF2' },

    { name: 'M1', sourceGame: 'QF1' },
    { name: 'M2', sourceGame: 'QF1' },
    { name: 'M3', sourceGame: 'QF2' },
    { name: 'M4', sourceGame: 'QF2' },
    { name: 'M5', sourceGame: 'QF3' },
    { name: 'M6', sourceGame: 'QF3' },
    { name: 'M7', sourceGame: 'QF4' },
    { name: 'M8', sourceGame: 'QF4' },
];