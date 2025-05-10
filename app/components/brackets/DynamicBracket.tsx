// components/DynamicBracket.tsx
import React from 'react';
import { Region } from '@/widgets';
import type { DynamicBracketProps } from '@/types';
import { tournamentData, bracketData } from '@/data/tournamentData';

const DynamicBracket: React.FC<DynamicBracketProps> = ({ managerKey = 'moses' }) => {
    // only the actual bracket regions, e.g. East and West
    const regionNames = Object.keys(tournamentData.regions);

    return (
        <div className="tournament container py-4">
            <div className="row gx-4">
                {regionNames.map(regionName => {
                    // Decide facing direction by region name
                    // Regions that should have their “first round” on the right:
                    const leftFacing = regionName.toLowerCase() === 'west';
                    const type = leftFacing ? 'left' : 'right';

                    const { matchups, games } = bracketData[managerKey].regions[regionName];
                    const { seeds, rounds, games: regionGames } = tournamentData.regions[regionName];

                    return (
                        <div key={regionName} className="col-12 col-lg-6 mb-4 h-100">
                            <Region
                                name={regionName}
                                type={type}
                                seeds={seeds}
                                rounds={rounds}
                                games={regionGames}
                                userData={{ matchups, games }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DynamicBracket;
