import React, { useMemo, useEffect } from 'react';
import { Card, Image } from 'react-bootstrap';
import { DynamicForm } from '@/widgets';
import type { FieldConfig } from '@/types';
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

const TournamentAssistantModern: React.FC = () => {
    const { activeTournament, switchTo, currentLeague, currentYear } = useTournamentController();
    const { advanceTeam } = useBracketController();
    
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

    const formFields: FieldConfig[] = [
        {
            name: 'league',
            label: 'League',
            type: 'select',
            options: leagueOptions,
            required: true,
            initialValue: currentLeague,
        },
        {
            name: 'year',
            label: 'Year',
            type: 'select',
            options: yearOptions,
            required: true,
            initialValue: currentYear,
        },
    ];

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
                    <div>Loading tournament data...</div>
                </Card.Header>
            </Card>
        );
    }

    // Error state - if bracket loaded but has no regions
    if (!bracketView.regionNames || bracketView.regionNames.length === 0) {
        return (
            <Card className="border-0 shadow-none">
                <Card.Header className="border-0 card-header-content-sm-between mb-4 px-0 px-md-2">
                    <Image className="avatar avatar-lg" src={logoSrc} alt={currentLeague} />
                    <div className="text-danger">Failed to load tournament data</div>
                </Card.Header>
                <Card.Body>
                    <p>No tournament data available for {currentLeague.toUpperCase()} {currentYear}</p>
                    <p>Available tournaments:</p>
                    <ul>
                        {allTournaments.map(t => (
                            <li key={t.id}>{t.league.toUpperCase()} {t.year}</li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>
        );
    }

    const instanceKey = `${activeTournament}-bracket`;

    return (
        <Card className="border-0 shadow-none">
            <Card.Header className="border-0 card-header-content-sm-between mb-4 px-0 px-md-2">
                <Image className="avatar avatar-lg" src={logoSrc} alt={currentLeague} />

                <DynamicForm
                    formClassName="d-flex gap-3 align-items-end"
                    fields={formFields}
                    onFieldChange={handleFormChange}
                    submitLabel={null}
                    onSubmit={() => {}}
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

export default TournamentAssistantModern;