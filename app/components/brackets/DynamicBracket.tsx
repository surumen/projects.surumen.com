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

const DynamicBracket: React.FC<DynamicBracketProps> = ({
                                                           tournamentType = 'ncaa',
                                                           year = 2023,
                                                           regionsPerRow = 2,
                                                       }) => {
    const instanceKey = `${tournamentType}-${year}`;
    return (
        <Container key={instanceKey} fluid className="tournament py-4 px-sm-0 px-md-2 position-relative">
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
    const config    = TOURNEY_REGISTRY[tournamentType]!;
    const data      = config.getData(year);
    const userRegs  = useAppSelector((s: RootState) => s.bracket.regions[keyString]);
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

    // flip to “any multi‐region (2 or 4)”
    const isMultiRegion = regionKeys.length > 1;
    const isFourRegion = regionKeys.length === 4;
    const semiSeedsMaps: Record<number, Record<string, SeedMeta>> = {};

    if (isMultiRegion) {
        data.final.games
            .filter(g => g.roundNumber === 0)  // only the two semis
            .forEach(semi => {
                const { gameNumber, sourceGame1, sourceGame2 } = semi;
                if (!sourceGame1 || !sourceGame2) return;

                const regionA = sourceGame1.region;
                const regionB = sourceGame2.region;

                // look up the very last picks array for each region
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
                <Col xs={12} md={12/regionsPerRow} className="px-0 h-100" key={r}>
                    <Region
                        name={r}
                        type={idx % 2 === 0 ? 'left' : 'right'}
                        seeds={regionSeedsMaps[r]}
                        games={data.regions[r].games}
                        userData={userRegs[r]}
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
                    />
                </Col>
            ))}
        </Row>
    );

    return (
        <>
            {renderRow(regionKeys.slice(0, regionsPerRow))}
            {regionKeys.length > regionsPerRow && renderRow(regionKeys.slice(regionsPerRow))}

            {/* Final Four – desktop */}
            {!isMobile && isMultiRegion && (() => {
                // 1) decide if it's a single final (2-region) or full Final Four (4-region)
                const firstRoundGames = data.final.games.filter(g => g.roundNumber === 0);
                const isSingleFinal   = firstRoundGames.length === 1;

                // 2) pick which games to render
                const gamesForFinal = isSingleFinal
                    ? firstRoundGames     // just the one final
                    : data.final.games;   // semis + final

                // 3) pick the positioning style
                const positionStyle: React.CSSProperties = isSingleFinal
                    ? { top: '20%', left: '50%', transform: 'translateX(-50%)' }
                    : { top: 0, left: `${(100/regionsPerRow)/2}%`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' };

                // 4) render the single wrapper + Region
                return (
                    <div
                        style={{
                            position:     'absolute',
                            width:        `${100/regionsPerRow}%`,
                            pointerEvents:'none',
                            zIndex:       1,
                            ...positionStyle,
                        }}
                    >
                        <div style={{ pointerEvents: 'auto' }}>
                            <Region
                                name="Final"
                                type="left"
                                seeds={{}}
                                games={gamesForFinal}
                                userData={userRegs['Final']}
                                isFinal
                                semiSeedsMaps={semiSeedsMaps}
                                onAdvanceTeam={(game, round, gameIdx, pick: SeedMeta) =>
                                    dispatch(advanceTeam({
                                        tournamentKey: keyString,
                                        region:        'Final',
                                        game,
                                        round,
                                        gameIdx,
                                        pick,
                                    }))
                                }
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
                            seeds={{}}
                            games={data.final.games}
                            userData={userRegs['Final']}
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
                        />
                    </Col>
                </Row>
            )}
        </>
    );
};

export default DynamicBracket;
