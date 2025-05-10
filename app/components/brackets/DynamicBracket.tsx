import React from 'react'
import { Region } from '@/widgets'
import type { DynamicBracketProps, SeedMeta, FinalRegion } from '@/types'
import { ncaaTournamentData } from '@/data/marchMadnessData'
import { nbaPlayoffsData } from '@/data/nbaPlayoffsData'
import { teamsData as ncaaTeams } from '@/data/ncaaTeamsData'
import { teamsData as nbaTeams } from '@/data/nbaPlayoffsData'
import { resolveSeeds, computeFinalBracket } from '@/helpers'

const DynamicBracket: React.FC<DynamicBracketProps> = ({
                                                           tournamentType = 'ncaa',
                                                           regionsPerRow = 2,
                                                       }) => {
    // pick the right raw data & teams array
    const data = tournamentType === 'ncaa' ? ncaaTournamentData : nbaPlayoffsData
    const rawTeams = tournamentType === 'ncaa' ? ncaaTeams : nbaTeams

    const allRegions = Object.keys(data.regions)
    const finalData = data.final as FinalRegion
    const hasFinal = Boolean(finalData && finalData.finalGame)

    // compute the final‐bracket seeds, rounds & games
    const finalBr = hasFinal
        ? computeFinalBracket(
            finalData,
            rawTeams.reduce(
                (m, tm) => ({ ...m, [tm.name]: tm }),
                {} as Record<string, SeedMeta>
            )
        )
        : { seeds: {}, rounds: [], games: [] }

    // special layout if exactly 2 regions
    if (allRegions.length === 2) {
        return (
            <div className="tournament container py-4 position-relative">
                <div className="row gx-4">
                    {allRegions.map((region, i) => {
                        const { seeds, rounds, games } = data.regions[region]
                        return (
                            <div key={region} className={`col-12 col-lg-${12 / 2} h-100`}>
                                <Region
                                    name={region}
                                    type={i === 0 ? 'left' : 'right'}
                                    seeds={resolveSeeds(seeds, rawTeams)}
                                    rounds={rounds}
                                    games={games}
                                />
                            </div>
                        )
                    })}
                </div>

                {hasFinal && (
                    <div
                        className="position-absolute"
                        style={
                            finalData.semiFinals
                                // semis present → center between rows
                                ? {
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 10,
                                }
                                // no semis → two-region style, sit low
                                : {
                                    bottom: '10%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 10,
                                }
                        }
                    >
                        <Region
                            name="Final"
                            isFinal
                            seeds={finalBr.seeds}
                            rounds={finalBr.rounds}
                            games={finalBr.games}
                        />
                    </div>
                )}
            </div>
        )
    }

    // default: >2 regions, split top/bottom
    const mid = Math.ceil(allRegions.length / 2)
    const top = allRegions.slice(0, mid)
    const bottom = allRegions.slice(mid)

    return (
        <div className="tournament container py-4">
            <div className="position-relative">
                {/* top row */}
                <div className="row gx-4 mb-4">
                    {top.map((region, i) => {
                        const { seeds, rounds, games } = data.regions[region]
                        return (
                            <div key={region} className={`col-12 col-lg-${12 / regionsPerRow} h-100`}>
                                <Region
                                    name={region}
                                    type={i % 2 === 0 ? 'left' : 'right'}
                                    seeds={resolveSeeds(seeds, rawTeams)}
                                    rounds={rounds}
                                    games={games}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* floating final region */}
                {hasFinal && (
                    <div
                        className="position-absolute"
                        style={
                            // when semis exist, use top centering to straddle rows
                            finalData.semiFinals
                                ? {
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 10,
                                }
                                : {
                                    bottom: '10%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 10,
                                }
                        }
                    >
                        <Region
                            name="Final"
                            isFinal
                            seeds={finalBr.seeds}
                            rounds={finalBr.rounds}
                            games={finalBr.games}
                        />
                    </div>
                )}

                {/* bottom row */}
                <div className="row gx-4 mt-4">
                    {bottom.map((region, i) => {
                        const { seeds, rounds, games } = data.regions[region]
                        return (
                            <div key={region} className={`col-12 col-lg-${12 / regionsPerRow} h-100`}>
                                <Region
                                    name={region}
                                    type={i % 2 === 0 ? 'left' : 'right'}
                                    seeds={resolveSeeds(seeds, rawTeams)}
                                    rounds={rounds}
                                    games={games}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default DynamicBracket
