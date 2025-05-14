import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Region } from '@/widgets';
import type { DynamicBracketProps, GameData, SeedMeta } from '@/types';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { advanceTeam } from '@/store/bracketSlice';
import useMounted from '@/hooks/useMounted';
import { useMediaQuery } from 'react-responsive';
import { TOURNEY_REGISTRY } from '@/data/tournaments';

const DynamicBracket: React.FC<DynamicBracketProps> = props => {
    const instanceKey = `${props.tournamentType}-${props.year}`;
    return (
        <Container
            key={instanceKey}
            className="tournament py-4 px-0 position-relative"
        >
            <InnerBracket {...props} />
        </Container>
    );
};

const InnerBracket: React.FC<DynamicBracketProps> = ({
                                                         tournamentType = 'ncaa',
                                                         year = 2025,
                                                         regionsPerRow = 2,
                                                         renderRegionHeader,
                                                         renderGameHeader,
                                                         renderGameFooter,
                                                     }) => {
    const dispatch    = useAppDispatch();
    const keyString   = `${tournamentType}-${year}`;
    const config      = TOURNEY_REGISTRY[tournamentType]!;
    const data        = config.getData(year);
    const userRegs    = useAppSelector((s: RootState) => s.bracket.regions[keyString]);
    const hasMounted    = useMounted();
    const isMobileQuery = useMediaQuery({ query: '(max-width: 767px)' });
    const isMobile      = hasMounted && isMobileQuery;

    // 1) map regionName → (seed → SeedMeta)
    const regionKeys = Object.keys(data.regions);
    const regionSeedsMaps: Record<string, Record<number, SeedMeta>> = {};
    regionKeys.forEach(regionName => {
        const m: Record<number, SeedMeta> = {};
        data.regions[regionName].games
            .filter(g => g.roundNumber === 0)
            .forEach(g => {
                if (g.firstSeed)  m[g.firstSeed.seed!]  = g.firstSeed;
                if (g.secondSeed) m[g.secondSeed.seed!] = g.secondSeed;
            });
        regionSeedsMaps[regionName] = m;
    });

    // 2) build semiSeedsMaps keyed by gameNumber → regionName → SeedMeta
    const isMultiRegion = regionKeys.length > 1;
    const semiSeedsMaps: Record<number, Record<string, SeedMeta>> = {};

    if (isMultiRegion) {
        // pull from state so we get winnerSeed too
        userRegs['Final']?.matchups; // just ensure Final exists
        data.final.games
            .filter(g => g.roundNumber === 0)
            .forEach(semi => {
                const { gameNumber, sourceGame1, sourceGame2 } = semi;
                if (!sourceGame1 || !sourceGame2) return;

                const regionA = sourceGame1.region;
                const regionB = sourceGame2.region;
                const lastA = userRegs[regionA].matchups;
                const champMetaA = lastA[lastA.length - 1][sourceGame1.gameNumber].find(
                    (m): m is SeedMeta => m != null
                );
                if (!champMetaA) return;

                const lastB = userRegs[regionB].matchups;
                const champMetaB = lastB[lastB.length - 1][sourceGame2.gameNumber].find(
                    (m): m is SeedMeta => m != null
                );
                if (!champMetaB) return;

                semiSeedsMaps[gameNumber] = {
                    [regionA]: champMetaA,
                    [regionB]: champMetaB,
                };
            });
    }

    const renderRow = (regions: string[]) => (
        <Row className="gy-md-5 mb-md-5 mx-0 mx-md-auto" key={regions.join('-')}>
            {regions.map((r, idx) => (
                <Col xs={12} md={12 / regionsPerRow} className="px-0 h-100" key={r}>
                    <Region
                        name={r}
                        type={idx % 2 === 0 ? 'left' : 'right'}
                        games={userRegs[r].games.flat()}
                        userData={{
                            matchups: userRegs[r].matchups,
                            games:    userRegs[r].scores,
                        }}
                        onAdvanceTeam={(game, round, gameIdx, pick: SeedMeta) =>
                            dispatch(
                                advanceTeam({
                                    tournamentKey: keyString,
                                    region:        r,
                                    game,
                                    round,
                                    gameIdx,
                                    pick,
                                })
                            )
                        }
                        renderRegionHeader={renderRegionHeader}
                        renderGameHeader={renderGameHeader}
                        renderGameFooter={renderGameFooter}
                    />
                </Col>
            ))}
        </Row>
    );

    return (
        <>
            {renderRow(regionKeys.slice(0, regionsPerRow))}
            {regionKeys.length > regionsPerRow &&
                renderRow(regionKeys.slice(regionsPerRow))}

            {/* Final Four – desktop */}
            {!isMobile && isMultiRegion && (() => {
                const finalGamesFlat = userRegs['Final'].games.flat();
                const semis = finalGamesFlat.filter(g => g.roundNumber === 0);
                const isSingleFinal = semis.length === 1;
                const gamesForFinal = isSingleFinal ? semis : finalGamesFlat;

                const positionStyle: React.CSSProperties = isSingleFinal
                    ? { top: '20%', left: '50%', transform: 'translateX(-50%)' }
                    : {
                        top: 0,
                        left: `${(100 / regionsPerRow) / 2}%`,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    };

                return (
                    <div
                        style={{
                            position:      'absolute',
                            width:         `${100 / regionsPerRow}%`,
                            pointerEvents: 'none',
                            zIndex:        1,
                            ...positionStyle,
                        }}
                    >
                        <div style={{ pointerEvents: 'auto' }}>
                            <Region
                                name="Final"
                                type="left"
                                games={gamesForFinal}
                                userData={{
                                    matchups: userRegs['Final'].matchups,
                                    games:    userRegs['Final'].scores,
                                }}
                                isFinal
                                semiSeedsMaps={semiSeedsMaps}
                                onAdvanceTeam={(game, round, gameIdx, pick: SeedMeta) =>
                                    dispatch(
                                        advanceTeam({
                                            tournamentKey: keyString,
                                            region:        'Final',
                                            game,
                                            round,
                                            gameIdx,
                                            pick,
                                        })
                                    )
                                }
                                renderRegionHeader={renderRegionHeader}
                                renderGameHeader={renderGameHeader}
                                renderGameFooter={renderGameFooter}
                            />
                        </div>
                    </div>
                );
            })()}

            {/* Final Four – mobile */}
            {isMobile && isMultiRegion && (
                <Row className="gy-md-5 mb-md-5">
                    <Col xs={12} className="px-0 h-100">
                        <Region
                            name="Final"
                            type="left"
                            games={userRegs['Final'].games.flat()}
                            userData={{
                                matchups: userRegs['Final'].matchups,
                                games:    userRegs['Final'].scores,
                            }}
                            isFinal
                            semiSeedsMaps={semiSeedsMaps}
                            onAdvanceTeam={(game, round, gameIdx, pick: SeedMeta) =>
                                dispatch(
                                    advanceTeam({
                                        tournamentKey: keyString,
                                        region:        'Final',
                                        game,
                                        round,
                                        gameIdx,
                                        pick,
                                    })
                                )
                            }
                            renderRegionHeader={renderRegionHeader}
                            renderGameHeader={renderGameHeader}
                            renderGameFooter={renderGameFooter}
                        />
                    </Col>
                </Row>
            )}
        </>
    );
};

export default DynamicBracket;
