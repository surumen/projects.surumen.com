import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { CursorFill, QuestionCircle } from 'react-bootstrap-icons';

import { useAppDispatch } from '@/store/hooks';
import {
    fetchManagerData,
    fetchManagerTeam,
} from '@/store/fplSlice';
import { premierLeagueTeams } from '@/data/premier-league/Teams';
import useFPL from '@/hooks/useFPL';
import { PitchView, DynamicForm} from '@/widgets';
import { FieldConfig } from '@/widgets/forms/DynamicForm';
import { DropdownItem } from '@/widgets/components/Dropdown';
import { PremierLeaguePlayer } from '@/types/PremierLeaguePlayer';

const Assistant = () => {
    const dispatch = useAppDispatch();
    const [managerId, setManagerId] = useState<number | null>(6888211);
    const [leagueId, setLeagueId] = useState<number>();
    const [activeGameweek, setActiveGameweek] = useState<number>(35);
    const weeks = useMemo(() => [...Array(35).keys()].map(i => i + 1), []);
    const weekItems: DropdownItem[] = weeks.map(w => ({ value: w, label: `GW ${w}` }));
    const weekOptions = weeks.map(w => ({ value: w, label: `GW ${w}` }));

    const {
        managerTeam,
        allPlayers,
        loading,
        error
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
        {
            name: 'competition',
            label: 'Competition',
            type: 'select',
            options: [{ value: 'Premier League', label: 'Premier League' }],
            initialValue: 'Premier League',
            readOnly: true,
        },
        {
            name: 'managerId',
            label: 'Manager ID',
            type: 'input',
            inputType: 'text',
            required: true,
            validate: v => /^\d+$/.test(v),
            initialValue: managerId?.toString() ?? '',
        },
        {
            name: 'leagueId',
            label: 'League ID',
            type: 'input',
            inputType: 'text',
            required: false,
            validate: v => v === '' || /^\d+$/.test(v),
            initialValue: leagueId?.toString() ?? '',
        },
        {
            name: 'gameweek',
            label: 'Gameweek',
            type: 'select',
            options: weekOptions,
            required: true,
            initialValue: activeGameweek,
        },
        // example switch:
        // {
        //   name: 'showProbabilities',
        //   label: 'Show Probabilities',
        //   type: 'switch',
        //   initialValue: false,
        // },
    ];

    if (loading) {
        return <p className="text-center mt-4">Loading team data...</p>;
    }

    if (error) {
        return <p className="text-center text-danger mt-4">Error: {error}</p>;
    }

    if (!managerTeam || !Array.isArray(managerTeam.picks) || !Array.isArray(allPlayers)) {
        return <p className="text-center mt-4">Waiting for team and player data...</p>;
    }

    const playersOnPitch: PremierLeaguePlayer[] = managerTeam.picks
        .map((pick: any) => {
            const player = allPlayers.find((p: PremierLeaguePlayer) => p.id === pick.element);
            if (!player) return null;

            const teamData = premierLeagueTeams.find(team => team.id === player.team);
            const kit = teamData
                ? player.element_type === 1
                    ? teamData.goalkeeper_kit
                    : teamData.kit
                : undefined;

            return {
                ...player,
                kit
            };
        })
        .filter(Boolean) as PremierLeaguePlayer[];

    return (
        <Fragment>
            <Row>
                <Col lg={9} className='order-2 order-lg-1 ps-lg-0 pt-4'>
                    <div className='card card-lg shadow-none rounded-2'>
                        <div className='card-body'>
                            <PitchView players={playersOnPitch} className={'p-0 pt-4'} />
                        </div>
                    </div>
                </Col>
                <Col lg={3} className="order-1 order-lg-2">
                    <div className='sticky-top pt-4' style={{ top: '5%' }}>
                        <DynamicForm
                            fields={formFields}
                            submitLabel={<><CursorFill className="me-1"/> Start</>}
                            onSubmit={handleFormSubmit}
                        />
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Assistant;
