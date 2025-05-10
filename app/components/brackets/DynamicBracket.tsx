import React from 'react';
import { Region } from '@/widgets';
import type { DynamicBracketProps } from '@/types';
import {
    nbaPlayoffsData,
    teamsData as nbaTeams
} from '@/data/nbaPlayoffsData';
import {
    ncaaTournamentData,
} from '@/data/marchMadnessData';
import {
    teamsData as ncaaTeams
} from '@/data/ncaaTeamsData';
import { resolveSeeds } from '@/helpers';

interface Props extends DynamicBracketProps {
    tournamentType?: 'nba' | 'ncaa';
    regionsPerRow?: number;
}

const DynamicBracket: React.FC<Props> = ({
                                             tournamentType = 'nba',
                                             regionsPerRow = 2 // default to 2 per row
                                         }) => {
    const data = tournamentType === 'ncaa' ? ncaaTournamentData : nbaPlayoffsData;
    const teams = tournamentType === 'ncaa' ? ncaaTeams : nbaTeams;

    const regionNames = Object.keys(data.regions);

    return (
        <div className="tournament container py-4">
            {Array.from({ length: Math.ceil(regionNames.length / regionsPerRow) }, (_, rowIdx) => {
                const group = regionNames.slice(rowIdx * regionsPerRow, rowIdx * regionsPerRow + regionsPerRow);
                return (
                    <div className="row gx-4 mb-4" key={`row-${rowIdx}`}>
                        {group.map((regionName, idx) => {
                            const type: 'left' | 'right' = (idx % 2 === 0) ? 'left' : 'right';

                            const { seeds, rounds, games: regionGames } = data.regions[regionName];
                            const enrichedSeeds = resolveSeeds(seeds, teams);

                            return (
                                <div key={regionName} className={`col-12 col-lg-${12 / regionsPerRow} h-100`}>
                                    <Region
                                        name={regionName}
                                        type={type}
                                        seeds={enrichedSeeds}
                                        rounds={rounds}
                                        games={regionGames}
                                    />
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default DynamicBracket;
