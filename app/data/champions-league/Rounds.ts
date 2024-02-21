import { v4 as uuid } from 'uuid';
import { TournamentRound } from '@/types/Tournament';

export const CLUB_FOOTBALL_ROUNDS: TournamentRound[] = [
    {
        name: 'Final',
        prefix: null,
        numOfGames: 1
    },
    {
        name: 'Semi Final',
        prefix: 'SF',
        numOfGames: 2
    },
    {
        name: 'Quarter Final',
        prefix: 'QF',
        numOfGames: 4
    },
    {
        name: 'Round of 16',
        prefix: 'M',
        numOfGames: 8
    },
]