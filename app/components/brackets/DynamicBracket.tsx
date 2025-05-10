import React from 'react'
import { Region } from '@/widgets'
import type { DynamicBracketProps, SeedMeta, FinalRegion } from '@/types'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import type { RootState } from '@/store/store'
import { advanceTeam } from '@/store/bracketSlice'
import { ncaaTournamentData } from '@/data/marchMadnessData'
import { nbaPlayoffsData } from '@/data/nbaPlayoffsData'
import { teamsData as ncaaTeams } from '@/data/ncaaTeamsData'
import { teamsData as nbaTeams } from '@/data/nbaPlayoffsData'
import { resolveSeeds, computeFinalBracket } from '@/helpers'

const DynamicBracket: React.FC<DynamicBracketProps> = ({
                                                           tournamentType = 'ncaa',
                                                           regionsPerRow = 2,
                                                       }) => {
    const dispatch = useAppDispatch()
    const bracketRegions = useAppSelector(
        (state: RootState) => state.bracket.regions[tournamentType]
    )

    const data = tournamentType === 'ncaa' ? ncaaTournamentData : nbaPlayoffsData
    const rawTeams = tournamentType === 'ncaa' ? ncaaTeams : nbaTeams

    const allRegions = Object.keys(data.regions)
    const finalData = data.final as FinalRegion
    const hasFinal = Boolean(finalData.finalGame)

    const finalBr = hasFinal
        ? computeFinalBracket(
            finalData,
            rawTeams.reduce(
                (m, tm) => ({ ...m, [tm.name]: tm }),
                {} as Record<string, SeedMeta>
            )
        )
        : { seeds: {}, rounds: [], games: [] }

    const renderRow = (regions: string[], key: string, isTop: boolean) => (
        <div className={`row gx-4 ${isTop ? 'mb-4' : 'mt-4'}`} key={key}>
            {regions.map((region, i) => {
                const { seeds, rounds, games } = data.regions[region]
                const colLg = 12 / regionsPerRow

                return (
                    <div key={region} className={`col-12 col-lg-${colLg} h-100`}>
                        <Region
                            name={region}
                            type={i % 2 === 0 ? 'left' : 'right'}
                            seeds={resolveSeeds(seeds, rawTeams)}
                            rounds={rounds}
                            games={games}
                            userData={bracketRegions[region]}
                            onAdvanceTeam={(round, gameIdx, seed) =>
                                dispatch(
                                    advanceTeam({
                                        tournamentType,
                                        region,
                                        round,
                                        gameIdx,
                                        seed,
                                    })
                                )
                            }
                        />
                    </div>
                )
            })}
        </div>
    )

    const finalColClass = allRegions.length === 2 ? 'col-2' : 'col-4'
    const finalStyle = finalData.semiFinals
        ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        : { bottom: '10%', left: '50%', transform: 'translateX(-50%)' }

    const renderFinal = hasFinal && (
        <div
            className={`position-absolute ${finalColClass}`}
            style={{ ...finalStyle, zIndex: 10 }}
        >
            <Region
                name="Final"
                isFinal
                seeds={finalBr.seeds}
                rounds={finalBr.rounds}
                games={finalBr.games}
            />
        </div>
    )

    if (allRegions.length === 2) {
        return (
            <div className="tournament container py-4 position-relative">
                {renderRow(allRegions, 'two', true)}
                {renderFinal}
            </div>
        )
    }

    const mid = Math.ceil(allRegions.length / 2)
    const top = allRegions.slice(0, mid)
    const bottom = allRegions.slice(mid)

    return (
        <div className="tournament container py-4">
            <div className="position-relative">
                {renderRow(top, 'top', true)}
                {renderFinal}
                {renderRow(bottom, 'bottom', false)}
            </div>
        </div>
    )
}

export default DynamicBracket
