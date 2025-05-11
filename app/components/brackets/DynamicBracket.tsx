import React, { useMemo } from 'react'
import { Region } from '@/widgets'
import type { DynamicBracketProps, SeedMeta, FinalRegion, GameData } from '@/types'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import type { RootState } from '@/store/store'
import { advanceTeam } from '@/store/bracketSlice'
import { ncaaTournamentData } from '@/data/tournaments/marchMadness'
import { nbaTournamentData } from '@/data/tournaments/nbaPlayoffs'
import { teamsData as ncaaTeams } from '@/data/tournaments/teams/ncaaBasketball'
import { teamsData as nbaTeams } from '@/data/tournaments/teams/nba'
import { resolveSeeds, computeFinalBracket } from '@/helpers'

const DynamicBracket: React.FC<DynamicBracketProps> = ({
                                                           tournamentType = 'ncaa',
                                                           regionsPerRow = 2,
                                                       }) => {
    const dispatch = useAppDispatch()
    const userRegions = useAppSelector(
        (state: RootState) => state.bracket.regions[tournamentType]
    )

    const { data, teams } = useMemo(() => {
        return tournamentType === 'ncaa'
            ? { data: ncaaTournamentData, teams: ncaaTeams }
            : { data: nbaTournamentData,  teams: nbaTeams }
    }, [tournamentType])

    const regions = Object.keys(data.regions)
    const finalInfo = data.final as FinalRegion
    const hasFinal = finalInfo.games.length > 0

    const onAdvance = (
        game: GameData,
        region: string,
        round: number,
        gameIdx: number,
        seed: number
    ) => {
        dispatch(
            advanceTeam({
                tournamentType,
                region,
                round,
                gameIdx,
                seed,
                game,            // pass the GameData into the action
            })
        )
    }

    const renderRow = (regionKeys: string[], isTop: boolean) => (
        <div className={`row gx-4 ${isTop ? 'mb-4' : 'mt-4'}`} key={isTop ? 'top' : 'bottom'}>
            {regionKeys.map((region, idx) => {
                const { seeds, games } = data.regions[region]
                const colSize = Math.floor(12 / regionsPerRow)

                return (
                    <div key={region} className={`col-12 col-lg-${colSize} h-100`}>
                        <Region
                            name={region}
                            type={idx % 2 === 0 ? 'left' : 'right'}
                            seeds={resolveSeeds(seeds, teams)}
                            games={games}
                            userData={userRegions[region]}
                            onAdvanceTeam={(game, round, gameIdx, seed) =>
                                onAdvance(game, region, round, gameIdx, seed)
                            }
                        />
                    </div>
                )
            })}
        </div>
    )

    const finalBracket = hasFinal
        ? computeFinalBracket(finalInfo)
        : { seeds: {} as Record<string, SeedMeta>, games: [] as GameData[] }

    const finalColClass = regions.length === 2 ? 'col-2' : 'col-4'
    const finalStyle = hasFinal
        ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        : { bottom: '10%', left: '50%', transform: 'translateX(-50%)' }

    const renderFinal = hasFinal && (
        <div className={`position-absolute ${finalColClass}`} style={{ ...finalStyle, zIndex: 10 }}>
            <Region
                name="Final"
                isFinal
                seeds={finalBracket.seeds}
                games={finalBracket.games}
                onAdvanceTeam={(game, round, gameIdx, seed) =>
                    onAdvance(game, 'Final', round, gameIdx, seed)
                }
            />
        </div>
    )

    if (regions.length === 2) {
        return (
            <div className="tournament container py-4 position-relative">
                {renderRow(regions, true)}
                {renderFinal}
            </div>
        )
    }

    const mid = Math.ceil(regions.length / 2)
    const topRegions = regions.slice(0, mid)
    const bottomRegions = regions.slice(mid)

    return (
        <div className="tournament container py-4">
            <div className="position-relative">
                {renderRow(topRegions, true)}
                {renderFinal}
                {renderRow(bottomRegions, false)}
            </div>
        </div>
    )
}

export default DynamicBracket
