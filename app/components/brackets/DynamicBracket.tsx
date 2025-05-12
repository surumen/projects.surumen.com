import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Region } from '@/widgets';
import type {
    DynamicBracketProps,
    SeedMeta,
    GameData,
    TournamentStructure,
} from '@/types';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { advanceTeam } from '@/store/bracketSlice';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import { TOURNEY_REGISTRY } from '@/data/tournaments';

const DynamicBracket: React.FC<DynamicBracketProps> = ({
                                                           tournamentType = 'ucl',
                                                           year = 2025,
                                                           regionsPerRow = 2,
                                                       }) => {
    const dispatch = useAppDispatch();
    const key = `${tournamentType}-${year}`;

    // 1) lookup data
    const config = TOURNEY_REGISTRY[tournamentType];
    if (!config) throw new Error(`Unknown tournament type "${tournamentType}"`);
    const data: TournamentStructure = config.getData(year);

    // 2) user state
    const userRegions = useAppSelector(
        (state: RootState) => state.bracket.regions[key]
    );

    // 3) responsiveness
    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;

    // advance callback
    const onAdvance = (
        game: GameData,
        region: string,
        round: number,
        gameIdx: number,
        seed: number
    ) => {
        dispatch(
            advanceTeam({ tournamentKey: key, region, game, round, gameIdx, seed })
        );
    };

    // split region keys into top/bottom rows
    const allRegions = Object.keys(data.regions);
    const topRegions = allRegions.slice(0, regionsPerRow);
    const bottomRegions = allRegions.slice(regionsPerRow);

    const renderRow = (regions: string[]) => (
        <Row className="gy-md-5 mb-md-5" key={regions.join('-')}>
            {regions.map((regionName, idx) => {
                const { games } = data.regions[regionName];

                // extract Round 0 seeds
                const seedsMap: Record<number, SeedMeta> = {};
                games
                    .filter(g => g.roundNumber === 0)
                    .forEach(g => {
                        if (g.firstSeed?.seed != null)
                            seedsMap[g.firstSeed.seed] = g.firstSeed;
                        if (g.secondSeed?.seed != null)
                            seedsMap[g.secondSeed.seed] = g.secondSeed;
                    });

                // left/right based on column index
                const isLeft = idx % 2 === 0;

                return (
                    <Col
                        key={regionName}
                        xs={12}
                        md={12 / regionsPerRow}
                        className="px-0 h-100"
                    >
                        <Region
                            name={regionName}
                            type={isLeft ? 'left' : 'right'}
                            seeds={seedsMap}
                            games={games}
                            userData={userRegions[regionName]}
                            onAdvanceTeam={(game, round, gameIdx, seed) =>
                                dispatch(advanceTeam({ tournamentKey: key,
                                    region: regionName,
                                    game, round, gameIdx, seed }))
                            }
                        />
                    </Col>
                );
            })}
        </Row>
    );

    return (
        <Container fluid className="tournament py-4">
            {renderRow(topRegions)}
            {bottomRegions.length > 0 && renderRow(bottomRegions)}
        </Container>
    );
};

export default DynamicBracket;
