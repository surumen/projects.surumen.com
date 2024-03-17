import { EAST_SEEDS, MIDWEST_SEEDS, SOUTH_SEEDS, WEST_SEEDS } from "@/data/march-madness/Seeds";


export const getMatchUps = (seeds: any[], start: number, end: number) => {
  return [seeds[start], seeds[end]];
}

export const getInitialMatches = (topRegionSeeds: any[], bottomRegionSeeds: any[]) => {
    const pairingOrder = [
        [1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]
    ];

    const matches: any = [];

    pairingOrder.forEach(pair => {
        const firstSeed = topRegionSeeds[pair[0] - 1];
        const secondSeed = topRegionSeeds[pair[1] - 1];
        matches.push({
            scheduled: 'March 16',
            isFinal: false,
            topSeed: {
                name: firstSeed.name,
                logo: firstSeed.logo,
                seed: firstSeed.seed,
                isMatchWinner: false,
                isChampion: false,
                isRunnerUp: false,
                isSecondRunnerUp: false,
                score: ''
            },
            bottomSeed: {
                name: secondSeed.name,
                logo: secondSeed.logo,
                seed: secondSeed.seed,
                isMatchWinner: false,
                isChampion: false,
                isRunnerUp: false,
                isSecondRunnerUp: false,
                score: ''
            }
        });
    });

    pairingOrder.forEach(pair => {
        const firstSeed = bottomRegionSeeds[pair[0] - 1];
        const secondSeed = bottomRegionSeeds[pair[1] - 1];
        matches.push({
            scheduled: 'March 16',
            isFinal: false,
            topSeed: {
                name: firstSeed.name,
                logo: firstSeed.logo,
                seed: firstSeed.seed,
                isMatchWinner: false,
                isChampion: false,
                isRunnerUp: false,
                isSecondRunnerUp: false,
                score: ''
            },
            bottomSeed: {
                name: secondSeed.name,
                logo: secondSeed.logo,
                seed: secondSeed.seed,
                isMatchWinner: false,
                isChampion: false,
                isRunnerUp: false,
                isSecondRunnerUp: false,
                score: ''
            }
        });
    });

    return matches;
}


export const initFutureMatches = (num: number, isFinal: boolean) => {
    const matches: any[] = [];
    while (num > 0) {
        matches.push({
            scheduled: 'March 28',
            isFinal: isFinal,
            topSeed: {
                name: 'TBC',
                logo: '',
                seed: '',
                isMatchWinner: false,
                isChampion: false,
                isRunnerUp: false,
                isSecondRunnerUp: false,
                score: ''
            },
            bottomSeed: {
                name: 'TBC',
                logo: '',
                seed: '',
                isMatchWinner: false,
                isChampion: false,
                isRunnerUp: false,
                isSecondRunnerUp: false,
                score: ''
            }
        });
        num = num - 1;
    }
    return matches;
}


export const MARCH_MADNESS_2024 = {
    regions: [
        'West', 'South', 'East', 'Midwest'
    ],
    rounds: [
        {
            order: 1,
            isFinal: false,
            matches: getInitialMatches(MIDWEST_SEEDS, EAST_SEEDS)
        },
        {
            order: 2,
            isFinal: false,
            matches: initFutureMatches(8, false)
        },
        {
            order: 3,
            isFinal: false,
            matches: initFutureMatches(4, false)
        },
        {
            order: 4,
            isFinal: false,
            matches: initFutureMatches(2, false)
        },
        {
            order: 5,
            isFinal: false,
            matches: initFutureMatches(1, false)
        },
        {
            order: 6,
            isFinal: true,
            matches: initFutureMatches(1, true)
        },
        {
            order: 7,
            isFinal: false,
            matches: initFutureMatches(1, false)
        },
        {
            order: 8,
            isFinal: false,
            matches: initFutureMatches(2, false)
        },
        {
            order: 9,
            isFinal: false,
            matches: initFutureMatches(4, false)
        },
        {
            order: 10,
            isFinal: false,
            matches: initFutureMatches(8, false)
        },
        {
            order: 11,
            isFinal: false,
            matches: getInitialMatches(WEST_SEEDS, SOUTH_SEEDS)
        },
    ]
}