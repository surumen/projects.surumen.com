import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Alert, Card, Col, Row, Spinner, Table, Image } from 'react-bootstrap';
import { CursorFill } from 'react-bootstrap-icons';

import { premierLeagueTeams } from '@/data/teams/premierLeague';
import useFPL from '@/hooks/useFPL';
import { 
    Form, 
    Field, 
    SelectField,
    SwitchField,
    validationRules,
    useFormContext,
    PlayerFormation 
} from '@/widgets';
import type { 
    Option,
    TransferOutCandidate,
    TransferInCandidate,
    PremierLeaguePlayer,
    UpcomingFixture 
} from '@/types';

const positionMap = {
    1: 'Goalkeeper',
    2: 'Defender',
    3: 'Midfielder',
    4: 'Forward',
} as const;

const findPlayerKit = (teamId: number, elementType: number) => {
    const team = premierLeagueTeams.find(t => t.id === teamId);
    if (!team) return '';
    return elementType === 1 ? team.goalkeeper_kit : team.kit ?? '';
};

type TransferCandidate = TransferOutCandidate | TransferInCandidate;

interface TransferTableProps {
    title: string;
    candidates: TransferCandidate[];
    recommendation: 'in' | 'out';
}

const TransferTable: React.FC<TransferTableProps> = ({ title, candidates, recommendation = 'in' }) => (
    <Card className="border-0 rounded-0 my-5">
        <Alert variant="dark" className="alert-soft-dark card-alert text-center border-0">
            <span className="fw-semibold">{title}</span>
        </Alert>
        <div className="table-responsive">
            <Table className="table-nowrap table-align-middle">
                <thead className="thead-light">
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Form</th>
                    <th>Expected (Simple)</th>
                    <th>Expected (Monte Carlo)</th>
                    <th>Upcoming</th>
                </tr>
                </thead>
                <tbody>
                {candidates.map((c, idx) => {
                    const next: UpcomingFixture | undefined = c.upcoming[0];
                    // Determine avatar color based on difficulty
                    let avatarColor = '';
                    if (next) {
                        const { difficulty } = next;
                        if (difficulty <= 2) avatarColor = 'avatar-success';
                        else if (difficulty === 3) avatarColor = 'avatar-soft-secondary';
                        else if (difficulty === 4) avatarColor = 'avatar-warning';
                        else avatarColor = 'avatar-danger';
                    }
                    return (
                        <tr key={c.id}>
                            <td>
                                <Row className="align-items-center">
                                    <Col xs="auto" className="pe-0">
                                        <div className="avatar bg-transparent avatar-centered avatar-circle">
                                            <Image
                                                src={findPlayerKit(c.team, c.element_type)}
                                                alt={c.web_name ?? c.full_name}
                                                className="avatar-img"
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <h5 className="mb-0">{c.web_name ?? c.full_name}</h5>
                                    </Col>
                                </Row>
                            </td>
                            <td>{positionMap[c.element_type]}</td>
                            <td>
                                    <span
                                        className={
                                            recommendation === 'out'
                                                ? 'text-danger'
                                                : idx < 2
                                                    ? 'fw-bold text-success'
                                                    : ''
                                        }
                                    >
                                        {c.form}
                                    </span>
                            </td>
                            <td>{c.expected_points.simple.toFixed(1)} pts</td>
                            <td>{c.expected_points.mc.toFixed(1)} pts</td>
                            <td>
                                {next ? (
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                                <span className={`avatar avatar-xs ${avatarColor} avatar-circle`}>
                                                    <span className="avatar-initials">{next.difficulty}</span>
                                                </span>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            {next.opponent_short_name} <span className='text-muted fw-light'>({next.turf === 'Home' ? 'H' : 'A'})</span>
                                        </div>
                                    </div>
                                ) : (
                                    '—'
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        </div>
    </Card>
);

// Submit button component that uses form context
const SubmitButton = () => {
    const { isValid, isSubmitting } = useFormContext();
    
    return (
        <div className="d-grid gap-2">
            <button
                type="submit"
                className="btn btn-primary"
                disabled={!isValid || isSubmitting}
            >
                <CursorFill className="me-1" /> Start
            </button>
        </div>
    );
};

const FantasyAssistant: React.FC = () => {
    const [managerId, setManagerId] = useState<number>(8025532);
    const [activeGameweek, setActiveGameweek] = useState<number>(1);
    const [showRecs, setShowRecs] = useState<boolean>(true);

    const weekOptions = useMemo<Option[]>(
        () =>
            Array.from({ length: 38 }, (_, i) => ({
                value: i + 1,
                label: `GW ${i + 1}`,
            })),
        []
    );

    const {
        managerTeam,
        allPlayers,
        error,
        loading,
        strategy,
        strategyLoading,
        strategyError,
        fetchManagerTeam,
        planManagerStrategy,
    } = useFPL();

    // Load initial data on component mount
    useEffect(() => {
        const loadInitialData = async () => {
            await fetchManagerTeam(managerId, activeGameweek);
            
            // Also fetch recommendations if enabled
            if (showRecs) {
                await planManagerStrategy(managerId);
            }
        };
        
        loadInitialData();
    }, [fetchManagerTeam, planManagerStrategy, managerId, activeGameweek, showRecs]);

    const handleFormSubmit = useCallback(async (vals: Record<string, any>) => {
        const newManagerId = Number(vals.managerId);
        const newGameweek = Number(vals.gameweek);
        const newShowRecs = Boolean(vals.showTransferRecommendations);
        
        setManagerId(newManagerId);
        setActiveGameweek(newGameweek);
        setShowRecs(newShowRecs);
        
        // Fetch manager team data for the selected gameweek
        await fetchManagerTeam(newManagerId, newGameweek);
        
        // Fetch transfer recommendations if requested
        if (newShowRecs) {
            await planManagerStrategy(newManagerId);
        }
    }, [fetchManagerTeam, planManagerStrategy]);

    // Render the form component
    const renderFantasyForm = () => (
        <Form
            onSubmit={handleFormSubmit}
            initialValues={{
                competition: 'Premier League',
                managerId: String(managerId),
                showTransferRecommendations: showRecs,
                gameweek: activeGameweek
            }}
        >
            {/* Competition - Read-only select */}
            <SelectField
                name="competition"
                label="Competition"
                options={[{ value: 'Premier League', label: 'Premier League' }]}
                readOnly={true}
            />

            {/* Manager ID - Text input with validation */}
            <Field
                name="managerId"
                label="Manager ID"
                type="text"
                required
                validators={[
                    validationRules.required('Manager ID'),
                    validationRules.pattern(
                        /^\d+$/, 
                        'Manager ID must be a number'
                    )
                ]}
            />

            {/* Show Transfer Recommendations - Switch */}
            <SwitchField
                name="showTransferRecommendations"
                label="Show transfer recommendations"
                inline={true}
            />

            {/* Gameweek - Select dropdown */}
            <SelectField
                name="gameweek"
                label="Gameweek"
                options={weekOptions}
                required
                validators={[
                    validationRules.required('Gameweek')
                ]}
            />

            <SubmitButton />
        </Form>
    );

    if (loading) {
        return (
            <Row>
                <Col>
                    <div className="text-center mt-4">
                        <Spinner animation="border" className="me-2" />
                        <span>Loading team and player data…</span>
                    </div>
                </Col>
            </Row>
        );
    }

    if (error) {
        return (
            <>
                <Row>
                    <Col lg={9} className="order-2 order-lg-1 ps-lg-0 pt-4">
                        <Alert variant="danger" className="alert-soft-danger text-center mt-4">
                            <strong>Error:</strong> {error}
                        </Alert>
                        <div className="text-center">
                            <button 
                                className="btn btn-primary" 
                                onClick={() => fetchManagerTeam(managerId, activeGameweek)}
                            >
                                Retry
                            </button>
                        </div>
                    </Col>

                    <Col lg={3} className="order-1 order-lg-2">
                        <div className="sticky-top pt-4" style={{ top: '5%' }}>
                            {renderFantasyForm()}
                        </div>
                    </Col>
                </Row>
            </>
        );
    }

    if (!managerTeam?.picks || !allPlayers || allPlayers.length === 0) {
        // Always render the form in the right column, even when there's no data
        return (
            <>
                <Row>
                    <Col lg={9} className="order-2 order-lg-1 ps-lg-0 pt-4">
                        <div className="text-center mt-4">
                            {managerTeam && managerTeam.picks && managerTeam.picks.length === 0 ? (
                                <Alert variant="warning" className="alert-soft-warning">
                                    <strong>No team data found</strong> for Manager {managerId} in Gameweek {activeGameweek}.
                                    <br />
                                    <small className="text-muted">
                                        This could mean the manager hasn&apos;t set a team for this gameweek, 
                                        or the gameweek data isn&apos;t available yet.
                                    </small>
                                    <br />
                                    <small className="text-muted">
                                        Try a different manager ID or gameweek using the form on the right.
                                    </small>
                                </Alert>
                            ) : (
                                <Alert variant="info" className="alert-soft-info">
                                    <strong>Ready to start</strong>
                                    <br />
                                    <small className="text-muted">
                                        Use the form on the right to enter a Manager ID and Gameweek to load team data.
                                    </small>
                                </Alert>
                            )}
                        </div>
                    </Col>

                    <Col lg={3} className="order-1 order-lg-2">
                        <div className="sticky-top pt-4" style={{ top: '5%' }}>
                            {renderFantasyForm()}
                        </div>
                    </Col>
                </Row>
            </>
        );
    }

    const playersOnPitch = managerTeam.picks
        .map(p => allPlayers.find(pl => pl.id === p.element))
        .filter(Boolean)
        .map((player: PremierLeaguePlayer) => ({
            ...player,
            kit: findPlayerKit(player.team, player.element_type),
        }));

    return (
        <>
            <Row>
                <Col lg={9} className="order-2 order-lg-1 ps-lg-0 pt-4">
                    <Row className="align-items-center pb-4">
                        <Col>
                            <PlayerFormation players={playersOnPitch} />
                        </Col>
                    </Row>

                    {showRecs && (
                        <>
                            {strategyLoading === 'pending' && <Spinner animation="border" />}
                            {strategyError && <Alert variant="danger">{strategyError}</Alert>}
                            {strategy && (
                                <>
                                    <TransferTable
                                        title="Transfer Out"
                                        candidates={strategy.transfer_out_candidates}
                                        recommendation={'out'}
                                    />
                                    <TransferTable
                                        title="Transfer In"
                                        candidates={strategy.transfer_in_candidates}
                                        recommendation={'in'}
                                    />
                                </>
                            )}
                        </>
                    )}
                </Col>

                <Col lg={3} className="order-1 order-lg-2">
                    <div className="sticky-top pt-4" style={{ top: '5%' }}>
                        {renderFantasyForm()}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default FantasyAssistant;