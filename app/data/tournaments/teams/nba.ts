import type { TournamentStructure, SeedMeta } from '@/types';

// 2022 NBA Playoffs teams
export const teamsData: SeedMeta[] = [
    // West
    { name: 'phoenix',           abbreviation: 'PHX', shortName: 'Suns',        logo: '/logos/phoenix.png',           color: 'sunset'    },
    { name: 'memphis',           abbreviation: 'MEM', shortName: 'Grizzlies',   logo: '/logos/memphis.png',           color: 'navy'      },
    { name: 'golden-state',      abbreviation: 'GSW', shortName: 'Warriors',    logo: '/logos/golden-state.png',      color: 'gold'      },
    { name: 'denver',            abbreviation: 'DEN', shortName: 'Nuggets',     logo: '/logos/denver.png',            color: 'cloud'     },
    { name: 'minnesota',         abbreviation: 'MIN', shortName: 'Timberwolves',logo: '/logos/minnesota.png',         color: 'plum'      },
    { name: 'new-orleans',       abbreviation: 'NOP', shortName: 'Pelicans',    logo: '/logos/new-orleans.png',       color: 'crimson'   },
    { name: 'los-angeles-lakers',abbreviation: 'LAL', shortName: 'Lakers',      logo: '/logos/los-angeles-lakers.png',color: 'primary'   },
    { name: 'los-angeles-clippers',abbreviation:'LAC', shortName: 'Clippers',   logo: '/logos/los-angeles-clippers.png',color:'tangerine' },

    // East
    { name: 'miami',             abbreviation: 'MIA', shortName: 'Heat',        logo: '/logos/miami.png',             color: 'danger'    },
    { name: 'boston',            abbreviation: 'BOS', shortName: 'Celtics',     logo: '/logos/boston.png',            color: 'secondary' },
    { name: 'milwaukee',         abbreviation: 'MIL', shortName: 'Bucks',       logo: '/logos/milwaukee.png',         color: 'warning'   },
    { name: 'cleveland',         abbreviation: 'CLE', shortName: 'Cavaliers',   logo: '/logos/cleveland.png',         color: 'crimson'   },
    { name: 'new-york-knicks',   abbreviation: 'NYK', shortName: 'Knicks',      logo: '/logos/new-york-knicks.png',   color: 'orange'    },
    { name: 'atlanta',           abbreviation: 'ATL', shortName: 'Hawks',       logo: '/logos/atlanta.png',           color: 'graphite'  },
    { name: 'philadelphia',      abbreviation: 'PHI', shortName: 'Sixers',      logo: '/logos/philadelphia.png',      color: 'orchid'    },
    { name: 'brooklyn',          abbreviation: 'BKN', shortName: 'Nets',        logo: '/logos/brooklyn.png',          color: 'cloud'     },
];

