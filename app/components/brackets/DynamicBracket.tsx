import React from 'react';
import { Region } from '@/widgets';
import type { DynamicBracketProps } from '@/types';
import {
    tournamentData,
    bracketData,
    teamsData,
} from '@/data/tournamentData';
import { resolveSeeds, resolveMatchups } from '@/helpers';

const DynamicBracket: React.FC<DynamicBracketProps> = ({ managerKey = 'moses' }) => {
    const regionNames = Object.keys(tournamentData.regions);

    const enrichedFinalSeeds: Record<string, Record<number, any>> = Object.entries(
        tournamentData.final.seeds
    ).reduce((acc, [region, seedMap]) => {
        acc[region] = resolveSeeds(seedMap, teamsData);
        return acc;
    }, {} as Record<string, Record<number, any>>);

    return (
        <div className="tournament container py-4">
            <div className="row gx-4">
                {regionNames.map(regionName => {
                    const leftFacing = regionName.toLowerCase() === 'west';
                    const type = leftFacing ? 'left' : 'right';

                    const { seeds, rounds, games: regionGames } = tournamentData.regions[regionName];
                    const enrichedSeeds = resolveSeeds(seeds, teamsData);

                    return (
                        <div key={regionName} className="col-12 col-lg-6 mb-4 h-100">
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

                {/* Optional Final Region Rendering */}
                {/*
                <div className="col-12">
                    <Region
                        name="Final"
                        type="right"
                        seeds={enrichedFinalSeeds}
                        rounds={tournamentData.final.rounds}
                        games={tournamentData.final.games}
                        userData={{
                            matchups: bracketData[managerKey].final.matchups,
                            games: bracketData[managerKey].final.games,
                        }}
                        champion={bracketData[managerKey].final.winner}
                    />
                </div>
                */}
            </div>
        </div>
    );
};

export default DynamicBracket;
