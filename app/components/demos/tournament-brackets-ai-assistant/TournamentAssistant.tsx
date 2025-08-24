import React, { useMemo, useEffect } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { ArrowClockwise, Trash } from 'react-bootstrap-icons';
import { SmartForm } from '@/widgets';
import type { FieldConfig } from '@/types/forms/advanced';
import useMounted from '@/hooks/useMounted';
import { Bracket } from '@/widgets';

// Import modern bracket system
import { 
  useBracket,
  useBracketController, 
  useTournamentController
} from '@/utils';
import { getAllAvailableTournaments } from '../../../data/brackets/leagues';

import type { BracketView, TournamentDefinition, BracketRegionView, BracketGameView, Team } from '@/types';

const logos: Record<string, string> = {
    ncaa: '/images/svg/ncaa.svg',
    nba:  '/images/svg/nba.svg',
    ucl:  '/images/svg/ucl.svg',
};

const TournamentAssistant: React.FC = () => {
    const { activeTournament, switchTo, currentLeague, currentYear } = useTournamentController();
    const { advanceTeam, clearAllPicks, resetBracket } = useBracketController();
    
    const hasMounted = useMounted();

    // Use real tournament data instead of mock data
    const bracketView = useBracket();

    // Get all available tournaments
    const allTournaments = useMemo(() => {
        return getAllAvailableTournaments();
    }, []);
    
    // Available options
    const availableLeagues = useMemo(() => 
        [...new Set(allTournaments.map(t => t.league))], 
        [allTournaments]
    );
    const availableYears = useMemo(() => 
        [...new Set(allTournaments.map(t => t.year))].sort((a, b) => b - a), 
        [allTournaments]
    );
    
    const yearOptions = availableYears.map((y) => ({ value: y, label: `${y}` }));
    const leagueOptions = availableLeagues.map((l) => ({ value: l, label: l.toUpperCase() }));

    // Memoize form config with fields inside
    const formConfig = useMemo(() => {
        const formFields: FieldConfig[] = [
            {
                name: 'league',
                label: 'League',
                type: 'select',
                options: leagueOptions,
                required: true,
                initialValue: currentLeague
            },
            {
                name: 'year',
                label: 'Year',
                type: 'select',
                options: yearOptions,
                required: true,
                initialValue: currentYear
            },
        ];

        return {
            fields: formFields,
            onSubmit: () => {}
        };
    }, [leagueOptions, yearOptions, currentLeague, currentYear]);

    const logoSrc = logos[currentLeague] || logos.ncaa;

    const renderRegionHeader = (name: string) => {
        return (
            <h2
                className="position-absolute text-uppercase text-muted"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            >
                {name}
            </h2>
        );
    };

    const renderGameFooter = (game: BracketGameView) => {
        return (
            <div className="small text-center py-1 bg-light text-muted">
                <span>Click to pick winner</span>
            </div>
        );
    };

    // Handle form changes to switch tournaments
    const handleFormChange = (values: Record<string, any>) => {
        const { league, year } = values;
        if (typeof league === 'string' && typeof year === 'number') {
            const targetTournament = allTournaments.find(t => 
                t.league === league && t.year === year
            );
            if (targetTournament) {
                switchTo(targetTournament.id);
            }
        }
    };

    // Handle team advancement
    const handleTeamAdvance = (gameId: string, teamId: string) => {
        advanceTeam(gameId, teamId);
    };

    // Handle clearing all picks
    const handleClearPicks = () => {
        clearAllPicks();
    };

    // Handle resetting bracket to original state
    const handleResetBracket = () => {
        resetBracket();
    };

    // Loading state
    if (!hasMounted) {
        return (
            <Card className="border-0 shadow-none">
                <Card.Header className="border-0 card-header-content-sm-between mb-4 px-0 px-md-2">
                    <Image className="avatar avatar-lg" src={logoSrc} alt="tournament" />
                    <div>Loading...</div>
                </Card.Header>
            </Card>
        );
    }

    // Loading bracket data
    if (!bracketView) {
        return (
            <Card className="border-0 shadow-none">
                <Card.Header className="border-0 card-header-content-sm-between mb-4 px-0 px-md-2">
                    <Image className="avatar avatar-lg" src={logoSrc} alt={currentLeague} />

                    <SmartForm
                        config={formConfig}
                        className="d-flex gap-3 align-items-end"
                        onFieldChange={(name, value, allValues) => handleFormChange(allValues)}
                        renderSubmitButton={() => null}
                    />
                </Card.Header>
                <Card.Body>
                    <div className="text-center">
                        <div className="alert alert-info alert-soft-info">
                            <strong>Loading tournament data...</strong>
                            <br />
                            <small className="text-muted">
                                Please wait while we load the {currentLeague.toUpperCase()} {currentYear} tournament bracket.
                            </small>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    // Error state - if bracket loaded but has no regions
    if (!bracketView.regionNames || bracketView.regionNames.length === 0) {
        return (
            <Card className="border-0 shadow-none">
                <Card.Header className="border-0 card-header-content-sm-between mb-4 px-0 px-md-2">
                    <Image className="avatar avatar-lg" src={logoSrc} alt={currentLeague} />

                    <SmartForm
                        config={formConfig}
                        className="d-flex gap-3 align-items-end"
                        onFieldChange={(name, value, allValues) => handleFormChange(allValues)}
                        renderSubmitButton={() => null}
                    />
                </Card.Header>
                <Card.Body>
                    <div className="text-center">
                        <div className="alert alert-warning alert-soft-warning">
                            <strong>No tournament data available</strong> for {currentLeague.toUpperCase()} {currentYear}
                            <br />
                            <small className="text-muted">
                                Try selecting a different league and year combination using the form above.
                            </small>
                        </div>
                        <details className="mt-3">
                            <summary className="btn btn-link btn-sm">View available tournaments</summary>
                            <div className="mt-2 text-start">
                                <small className="text-muted">Available combinations:</small>
                                <ul className="list-unstyled mt-2">
                                    {allTournaments.map(t => (
                                        <li key={t.id} className="mb-1">
                                            <button 
                                                className="btn btn-link btn-sm p-0 text-decoration-underline"
                                                onClick={() => switchTo(t.id)}
                                            >
                                                {t.league.toUpperCase()} {t.year}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </details>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    const instanceKey = `${activeTournament}-bracket`;

    return (
        <Card className="border-0 shadow-none">
            <Card.Header className="border-0 card-header-content-sm-between mb-4 px-0 px-md-2">
                <div className="d-flex align-items-center gap-2">
                    <Image className="avatar avatar-lg" src={logoSrc} alt={currentLeague} />
                    
                    {/* Action buttons - only show when bracket is fully loaded */}
                    <div className="d-flex gap-2 ms-3">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleClearPicks}
                            className="d-flex align-items-center gap-1"
                            title="Clear all your picks"
                        >
                            <Trash size={14} />
                            <span className="d-none d-sm-inline">Clear Picks</span>
                        </Button>
                        
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={handleResetBracket}
                            className="d-flex align-items-center gap-1"
                            title="Reset bracket to original state"
                        >
                            <ArrowClockwise size={14} />
                            <span className="d-none d-sm-inline">Reset Bracket</span>
                        </Button>
                    </div>
                </div>

                <SmartForm
                    config={formConfig}
                    className="d-flex gap-3 align-items-end"
                    onFieldChange={(name, value, allValues) => handleFormChange(allValues)}
                    renderSubmitButton={() => null}
                />
            </Card.Header>

            <div key={instanceKey}>
                <h4 className="text-center mb-4">{bracketView.tournament.name}</h4>
                <Bracket
                    bracketView={bracketView}
                    regionsPerRow={2}
                    onTeamAdvance={handleTeamAdvance}
                    renderRegionHeader={renderRegionHeader}
                    renderGameFooter={renderGameFooter}
                />
            </div>
        </Card>
    );
};

export default TournamentAssistant;