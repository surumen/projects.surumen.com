// components/DynamicBracket.tsx

import React from 'react'
import { Region } from '@/widgets'
import type { DynamicBracketProps, SeedMeta, FinalRegion, GameData } from '@/types'
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
    const hasFinal = Boolean(finalData.games)

    // Helper to group GameData[] by roundNumber
    const groupByRound = (games: GameData[]) => {
        const map = new Map<number, GameData[]>()
        games.forEach(g => {
            const arr = map.get(g.roundNumber) || []
            arr.push(g)
            map.set(g.roundNumber, arr)
        })
        return Array.from(map.entries())
            .sort(([a], [b]) => a - b)
            .map(([, roundGames]) => roundGames)
    }

    const renderRow = (regions: string[], key: string, isTop: boolean) => (
        <div className={`row gx-4 ${isTop ? 'mb-4' : 'mt-4'}`} key={key}>
            {regions.map((region, i) => {
                const { seeds: seedsMap, games } = data.regions[region]
                const colLg = 12 / regionsPerRow

                return (
                    <div key={region} className={`col-12 col-lg-${colLg} h-100`}>
                        <Region
                            name={region}
                            type={i % 2 === 0 ? 'left' : 'right'}
                            seeds={resolveSeeds(seedsMap, rawTeams)}
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

    // Final four + championship
    const finalBr = hasFinal
        ? computeFinalBracket(finalData)
        : { seeds: {} as Record<string, SeedMeta>, games: [] as GameData[] }

    const finalColClass = allRegions.length === 2 ? 'col-2' : 'col-4'
    const finalStyle = hasFinal
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
                games={finalBr.games}
                onAdvanceTeam={(round, gameIdx, seed) =>
                    dispatch(
                        advanceTeam({
                            tournamentType,
                            region: 'Final',
                            round,
                            gameIdx,
                            seed,
                        })
                    )
                }
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
