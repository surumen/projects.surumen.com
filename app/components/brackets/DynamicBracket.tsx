import React from 'react';
import { Row } from 'react-bootstrap';
import { Region } from '@/widgets';
import type {
    DynamicBracketProps,
    SeedMeta,
    FinalRegion,
    GameData,
} from '@/types';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { advanceTeam } from '@/store/bracketSlice';
import { ncaaTournamentData } from '@/data/tournaments/marchMadness';
import { nbaTournamentData } from '@/data/tournaments/nbaPlayoffs';
import { teamsData as ncaaTeams } from '@/data/tournaments/teams/ncaaBasketball';
import { resolveSeeds, computeFinalBracket } from '@/helpers';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';

const DynamicBracket: React.FC<DynamicBracketProps> = ({
                                                           tournamentType = 'nba',
                                                           regionsPerRow = 2,
                                                       }) => {
    const dispatch = useAppDispatch();
    const userRegions = useAppSelector(
        (state: RootState) => state.bracket.regions[tournamentType]
    );

    const data = tournamentType === 'nba'
        ? nbaTournamentData
        : ncaaTournamentData;

    const teams = tournamentType === 'nba'
        ? undefined
        : ncaaTeams;

    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;
    const colsPerRow = isMobile ? 1 : regionsPerRow;
    const colSize = Math.floor(12 / colsPerRow);

    const onAdvance = (
        game: GameData,
        region: string,
        round: number,
        gameIdx: number,
        seed: number
    ) => {
        dispatch(
            advanceTeam({ tournamentType, region, round, gameIdx: gameIdx, seed, game })
        );
    };

    const renderRow = (regionKeys: string[], isTop: boolean) => (
        <Row className={`gx-4 ${isTop ? 'mb-4' : 'mt-4'}`} key={isTop ? 'top' : 'bottom'}>
            {regionKeys.map((region, idx) => {
                const { seeds: rawSeeds, games } = data.regions[region];

                // build seed→SeedMeta map
                let seedsMap: Record<number, SeedMeta>;
                if (tournamentType === 'nba') {
                    seedsMap = {};
                    // round 0 games have full firstSeed/secondSeed metadata
                    games
                        .filter(g => g.roundNumber === 0)
                        .forEach(g => {
                            if (g.firstSeed?.seed != null) {
                                seedsMap[g.firstSeed.seed] = g.firstSeed;
                            }
                            if (g.secondSeed?.seed != null) {
                                seedsMap[g.secondSeed.seed] = g.secondSeed;
                            }
                        });
                } else {
                    seedsMap = resolveSeeds(rawSeeds, teams!);
                }

                const colClass = isMobile
                    ? 'col-12 px-0'
                    : `col-12 col-md-${colSize} col-lg-${colSize}`;

                return (
                    <div key={region} className={`${colClass} h-100`}>
                        <Region
                            name={region}
                            type={idx % 2 === 0 ? 'left' : 'right'}
                            seeds={seedsMap}
                            games={games}
                            userData={userRegions[region]}
                            onAdvanceTeam={(g, r, gi, s) => onAdvance(g, region, r, gi, s)}
                        />
                    </div>
                );
            })}
        </Row>
    );

    const regions = Object.keys(data.regions);
    const finalInfo = data.final as FinalRegion;
    const hasFinal = finalInfo.games.length > 0;
    const finalBracket = hasFinal
        ? computeFinalBracket(finalInfo)
        : { seeds: {} as Record<string, SeedMeta>, games: [] as GameData[] };

    const finalCols = regions.length === 2 ? 'col-2' : 'col-4';
    const finalStyle = hasFinal
        ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        : { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };

    const absoluteFinal =
        hasFinal && !isMobile && (
            <div className={`position-absolute ${finalCols}`} style={{ ...finalStyle, zIndex: 10 }}>
                <Region
                    name="Final"
                    isFinal
                    seeds={finalBracket.seeds}
                    games={finalBracket.games}
                    onAdvanceTeam={(g, r, gi, s) => onAdvance(g, 'Final', r, gi, s)}
                />
            </div>
        );

    const inlineFinal =
        hasFinal && isMobile && (
            <Row className="gx-4 mt-4">
                <div className="col-12 px-0">
                    <Region
                        name="Final"
                        isFinal
                        seeds={finalBracket.seeds}
                        games={finalBracket.games}
                        onAdvanceTeam={(g, r, gi, s) => onAdvance(g, 'Final', r, gi, s)}
                    />
                </div>
            </Row>
        );

    if (regions.length === 2) {
        return (
            <div className="tournament container py-4 position-relative">
                {renderRow(regions, true)}
                {absoluteFinal}
                {inlineFinal}
            </div>
        );
    }

    const mid = Math.ceil(regions.length / 2);
    return (
        <div className="tournament container py-4">
            <div className="position-relative">
                {renderRow(regions.slice(0, mid), true)}
                {absoluteFinal}
                {inlineFinal}
                {renderRow(regions.slice(mid), false)}
            </div>
        </div>
    );
};

export default DynamicBracket;
