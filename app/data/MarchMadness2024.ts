export const WEST_SEEDS = [
    {
        name: 'Gonzaga',
        seed: '1',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21408.svg'
    },
    {
        name: 'Duke',
        seed: '2',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21130.svg'
    },
    {
        name: 'TXTECH',
        seed: '3',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    },
    {
        name: 'ARK',
        seed: '4',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21353.svg'
    },
    {
        name: 'UCONN',
        seed: '5',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21161.svg'
    },
    {
        name: 'BAMA',
        seed: '6',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    },{
        name: 'MICHST',
        seed: '7',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'BOISE',
        seed: '8',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'MEMP',
        seed: '9',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'DAV',
        seed: '10',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'ND',
        seed: '11',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'NMEXST',
        seed: '12',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'UVM',
        seed: '13',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'MONST',
        seed: '14',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'CSFULL',
        seed: '15',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }, {
        name: 'GAST',
        seed: '16',
        logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21212.svg'
    }
]

export const getMatchups = (seeds: any[], start: number, end: number) => {
  return [seeds[start], seeds[end]];
}

export const getInitialMatches = (seeds: any[]) => {
    let start = 0;
    let end = seeds.length - 1;

    const matches: any[] = [];
    while (matches.length < 16) {
        const [firstSeed, secondSeed] = getMatchups(seeds, start, end);
        matches.push({
            scheduled: 'March 16',
            isFinal: false,
            topSeed: {
                name: firstSeed.name,
                logo: firstSeed.logo,
                seed: firstSeed.seed,
                isWinner: false,
                score: ''
            },
            bottomSeed: {
                name: secondSeed.name,
                logo: secondSeed.logo,
                seed: secondSeed.seed,
                isWinner: false,
                score: ''
            }
        });
        start = start + 1;
        end = end - 1;
    }
    return matches;
}


export const initFutureMatches = (num: number, isFinal: boolean) => {
    const matches: any[] = [];
    while (num > 0) {
        matches.push({
            scheduled: '',
            isFinal: isFinal,
            topSeed: {
                name: 'TBC',
                logo: '',
                seed: '',
                isWinner: false,
                score: ''
            },
            bottomSeed: {
                name: 'TBC',
                logo: '',
                seed: '',
                isWinner: false,
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
            order: '1',
            matches: getInitialMatches(WEST_SEEDS)
        },
        {
            order: '2',
            matches: initFutureMatches(8, false)
        },
        {
            order: '3',
            matches: initFutureMatches(4, false)
        },
        {
            order: '4',
            matches: initFutureMatches(2, false)
        },
        {
            order: '5',
            matches: initFutureMatches(1, true)
        },
        {
            order: '6',
            matches: initFutureMatches(1, false)
        },
        {
            order: '7',
            matches: initFutureMatches(1, false)
        },
        {
            order: '8',
            matches: initFutureMatches(2, false)
        },
        {
            order: '9',
            matches: initFutureMatches(4, false)
        },
        {
            order: '10',
            matches: initFutureMatches(8, false)
        },
        {
            order: '11',
            matches: getInitialMatches(WEST_SEEDS)
        },
    ]
}