import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import { CursorFill } from 'react-bootstrap-icons';

import { useAppDispatch } from '@/store/hooks';
import {
    fetchManagerData,
    fetchManagerTeam,
} from '@/store/fplSlice';
import { premierLeagueTeams } from '@/data/premier-league/Teams';
import useFPL from '@/hooks/useFPL';
import { DynamicForm, MatchLineupFormation } from '@/widgets';
import { FieldConfig } from '@/widgets/forms/DynamicForm';
import { PremierLeaguePlayer } from '@/types/PremierLeaguePlayer';


const Assistant = () => {
    const dispatch = useAppDispatch();
    const [managerId, setManagerId] = useState<number | null>(6888211);
    const [leagueId, setLeagueId] = useState<number>();
    const [activeGameweek, setActiveGameweek] = useState<number>(35);
    const weeks = useMemo(() => [...Array(36).keys()].map(i => i + 1), []);
    const weekOptions = weeks.map(w => ({ value: w, label: `GW ${w}` }));

    const {
        managerTeam,
        allPlayers,
        loading,
        error,
    } = useFPL();

    useEffect(() => {
        if (managerId !== null) {
            dispatch(fetchManagerData(managerId));
            dispatch(fetchManagerTeam({ managerId, gameweek: activeGameweek }));
        }
    }, [dispatch, managerId, activeGameweek]);

    const handleFormSubmit = (vals: Record<string, any>) => {
        setManagerId(parseInt(vals.managerId, 10));
        setLeagueId(vals.leagueId ? parseInt(vals.leagueId, 10) : undefined);
        setActiveGameweek(parseInt(vals.gameweek, 10));
    };

    const formFields: FieldConfig[] = [
        { name: 'competition', label: 'Competition', type: 'select',
            options: [{ value: 'Premier League', label: 'Premier League' }],
            initialValue: 'Premier League', readOnly: true,
        },
        { name: 'managerId', label: 'Manager ID', type: 'input', inputType: 'text',
            required: true, validate: v => /^\d+$/.test(v),
            initialValue: managerId?.toString() ?? '',
        },
        {
          name: 'showTransferRecommendations',
          label: 'Show transfer recommendations',
          type: 'switch',
          initialValue: true,
        },
        {
            name: 'showDreamTeam',
            label: 'Show me my dream team',
            type: 'switch',
            initialValue: false,
        },
        { name: 'gameweek', label: 'Gameweek', type: 'select',
            options: weekOptions, required: true,
            initialValue: activeGameweek,
        },
    ];

    if (error) {
        return (
            <Row>
                <Col sm={12}>
                    <Alert variant={'danger'} className="alert-soft-danger text-center mt-4">
                        Error: {error}
                    </Alert>
                </Col>
            </Row>
        );
    }

    if (!managerTeam || !Array.isArray(managerTeam.picks) || !Array.isArray(allPlayers)) {
        return (
            <Row>
                <Col sm={12}>
                    <p className="text-center mt-4">
                        Waiting for team and player data...
                    </p>
                </Col>
            </Row>
        );
    }

    // Build players for the pitch...
    const playersOnPitch: PremierLeaguePlayer[] = managerTeam.picks
        .map(pick => {
            const player = allPlayers.find(p => p.id === pick.element);
            if (!player) return null;
            const teamData = premierLeagueTeams.find(t => t.id === player.team);
            const kit = teamData
                ? (player.element_type === 1 ? teamData.goalkeeper_kit : teamData.kit)
                : undefined;
            return { ...player, kit };
        })
        .filter(Boolean) as PremierLeaguePlayer[];

    return (
        <Fragment>
            <Row>
                <Col lg={9} className="order-2 order-lg-1 ps-lg-0 pt-4">
                    <Row className="align-items-center pb-4">
                        <Col>
                            <MatchLineupFormation players={playersOnPitch} />
                        </Col>
                    </Row>

                    {/* Scout Recommendations */}
                    <Row className="align-items-center justify-content-end py-4">
                        <Col>

                        </Col>
                    </Row>
                </Col>

                <Col lg={3} className="order-1 order-lg-2">
                    <div className="sticky-top pt-4" style={{ top: '5%' }}>
                        <DynamicForm
                            fields={formFields}
                            submitLabel={<><CursorFill className="me-1" /> Start</>}
                            onSubmit={handleFormSubmit}
                        />
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Assistant;
