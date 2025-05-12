import { SeedMeta, TournamentStructure } from '@/types';

import { getNcaaTournamentData } from './marchMadness';
import { getNbaTournamentData  } from './nbaPlayoffs';
import { getUclTournamentData  } from './uefaChampionsLeague';
import { teamsData as ncaaTeams   } from './teams/ncaaBasketball';
import { teamsData as nbaTeams    } from './teams/nba';
import { teamsData as uclTeams    } from './teams/ucl';

export interface TourneyConfig {
    /** builds the full bracket structure for a given year */
    getData: (year: number) => TournamentStructure;
    /** optional flat teams list for resolving raw seed maps */
    teamsData?: SeedMeta[];
}

export const TOURNEY_REGISTRY: Record<string, TourneyConfig> = {
    ncaa: { getData: getNcaaTournamentData, teamsData: ncaaTeams },
    nba:  { getData: getNbaTournamentData,  teamsData: nbaTeams  },
    ucl:  { getData: getUclTournamentData,  teamsData: uclTeams  },
};
