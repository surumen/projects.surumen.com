// data/tournamentData.ts
import type { TournamentStructure, BracketData } from '@/types';

/** The tournament structure (dynamic regions + final) */
export const tournamentData: TournamentStructure = {
    regions: {
        West: {
            seeds: { 1: "golden-state", 2: "san-antonio", 3: "houston", 4: "la-clippers", 5: "utah", 6: "oklahoma-city", 7: "memphis", 8: "portland" },
            rounds: [[1,8,4,5,2,7,3,6], [1,5,2,3], [0,0]],
            games: [
                [ [1,1,1,1], [5,4,4,5,5,4,5], [2,2,7,7,2,2], [3,3,6,3,3] ],
                [ [1], [3] ],
                []
            ]
        },
        East: {
            seeds: { 1: "boston", 2: "cleveland", 3: "toronto", 4: "washington", 5: "atlanta", 6: "milwaukee", 7: "indiana", 8: "chicago" },
            rounds: [[1,8,4,5,2,7,3,6], [1,4,2,3], [0,0]],
            games: [
                [ [8,8,1,1,1,1], [4,4,5,5,4,4], [2,2,2,2], [6,3,6,3,3,3] ],
                [ [1,1], [2] ],
                []
            ]
        }
        // …add as many regions as you like
    },
    final: {
        seeds: {
            east: { 1:"boston",2:"cleveland",3:"toronto",4:"washington",5:"atlanta",6:"milwaukee",7:"indiana",8:"chicago" },
            west: { 1:"golden-state",2:"san-antonio",3:"houston",4:"la-clippers",5:"utah",6:"oklahoma-city",7:"memphis",8:"portland" }
        },
        rounds: [[0,0]],
        games: [[]]
    }
};

/** Each user’s bracket picks, now nested under `regions` */
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
            winner: "Golden State"
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
            winner: "Cleveland"
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
            winner: "Cleveland"
        }
    }
};
