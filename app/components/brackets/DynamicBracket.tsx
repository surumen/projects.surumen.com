// src/widgets/DynamicBracket.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Region } from '@/widgets';
import type { DynamicBracketProps } from '@/types';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { advanceTeam } from '@/store/bracketSlice';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import { TOURNEY_REGISTRY } from '@/data/tournaments';

const DynamicBracket: React.FC<DynamicBracketProps> = ({
                                                           tournamentType = 'ncaa',
                                                           year = 2025,
                                                           regionsPerRow = 2,
                                                       }) => {
    const instanceKey = `${tournamentType}-${year}`;

    // force tear-down/remount only on tournamentType/year change
    return (
        <Container
            key={instanceKey}
            fluid
            className="tournament py-4 position-relative"
        >
            <InnerBracket
                tournamentType={tournamentType}
                year={year}
                regionsPerRow={regionsPerRow}
            />
        </Container>
    );
};

const InnerBracket: React.FC<DynamicBracketProps> = ({
                                                         tournamentType = 'ncaa',
                                                         year = 2025,
                                                         regionsPerRow = 2,
                                                     }) => {
    const dispatch = useAppDispatch();
    const keyString = `${tournamentType}-${year}`;
    const config = TOURNEY_REGISTRY[tournamentType]!;
    const data = config.getData(year);
    const userRegs = useAppSelector(
        (s: RootState) => s.bracket.regions[keyString]
    );
    const hasMounted = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile = hasMounted && isMobileQuery;

    const allRegions = Object.keys(data.regions);
    const topRegions = allRegions.slice(0, regionsPerRow);
    const bottomRegions = allRegions.slice(regionsPerRow);

    const renderRow = (regions: string[]) => (
        <Row className="gy-md-5 mb-md-5" key={regions.join('-')}>
            {regions.map((r, idx) => {
                const { games } = data.regions[r];
                const seedsMap: Record<number, any> = {};
                games.filter((g) => g.roundNumber === 0).forEach((g) => {
                    if (g.firstSeed?.seed != null)
                        seedsMap[g.firstSeed.seed] = g.firstSeed;
                    if (g.secondSeed?.seed != null)
                        seedsMap[g.secondSeed.seed] = g.secondSeed;
                });
                const isLeft = idx % 2 === 0;
                return (
                    <Col xs={12} md={12 / regionsPerRow} className="px-0 h-100" key={r}>
                        <Region
                            name={r}
                            type={isLeft ? 'left' : 'right'}
                            seeds={seedsMap}
                            games={games}
                            userData={userRegs[r]}
                            onAdvanceTeam={(game, round, gameIdx, seed) =>
                                dispatch(
                                    advanceTeam({
                                        tournamentKey: keyString,
                                        region: r,
                                        game,
                                        round,
                                        gameIdx,
                                        seed,
                                    })
                                )
                            }
                        />
                    </Col>
                );
            })}
        </Row>
    );

    return (
        <>
            {renderRow(topRegions)}
            {bottomRegions.length > 0 && renderRow(bottomRegions)}

            {/* desktop final, centered absolutely */}
            {!isMobile && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: `${(100 / regionsPerRow) / 2}%`,
                        width: `${100 / regionsPerRow}%`,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none', // <-- allow clicks through except on inner
                        zIndex: 1,
                    }}
                >
                    <div style={{ pointerEvents: 'auto' }}>
                        <Region
                            name="Final"
                            type="left"
                            seeds={data.final.seeds}
                            games={data.final.games}
                            userData={userRegs.final}
                            isFinal
                            onAdvanceTeam={(game, round, gameIdx, seed) =>
                                dispatch(
                                    advanceTeam({
                                        tournamentKey: keyString,
                                        region: 'Final',
                                        game,
                                        round,
                                        gameIdx,
                                        seed,
                                    })
                                )
                            }
                        />
                    </div>
                </div>
            )}

            {/* mobile final row */}
            {isMobile && (
                <Row className="gy-md-5 mb-md-5">
                    <Col xs={12} className="px-0 h-100">
                        <Region
                            name="Final"
                            type="left"
                            seeds={data.final.seeds}
                            games={data.final.games}
                            userData={userRegs.final}
                            isFinal
                            onAdvanceTeam={(game, round, gameIdx, seed) =>
                                dispatch(
                                    advanceTeam({
                                        tournamentKey: keyString,
                                        region: 'Final',
                                        game,
                                        round,
                                        gameIdx,
                                        seed,
                                    })
                                )
                            }
                        />
                    </Col>
                </Row>
            )}
        </>
    );
};

export default DynamicBracket;
