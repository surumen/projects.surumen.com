import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useAppDispatch } from '@/store/hooks';
import {
    fetchManagerData,
    fetchManagerTeam,
} from '@/store/fplSlice';
import { premierLeagueTeams } from '@/data/premier-league/Teams';
import useFPL from '@/hooks/useFPL';
import { PitchView } from '@/widgets';
import { PremierLeaguePlayer } from '@/types/PremierLeaguePlayer';
import { ChevronDown } from 'react-bootstrap-icons';
import Link from 'next/link';

const Assistant = () => {
    const dispatch = useAppDispatch();
    const managerId = 6888211;
    const [activeGameweek, setActiveGameweek] = useState<number>(35);
    const weeks = useMemo(() => [...Array(35).keys()].map(i => i + 1), []);

    const {
        managerTeam,
        allPlayers,
        loading,
        error
    } = useFPL();

    useEffect(() => {
        dispatch(fetchManagerData(managerId));
        dispatch(fetchManagerTeam({ managerId, gameweek: activeGameweek }));
    }, [dispatch, managerId, activeGameweek]);

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

    const handleYearFilter = (year: number) => {
        setActiveGameweek(year);
    };

    const ToggleYear: any = forwardRef((props: any, ref: any) => (
        <Link
            href='#'
            ref={ref}
            onClick={(e: any) => {
                e.preventDefault();
                props.onClick(e);
            }}
        >
            {props.children}
        </Link>
    ));
    ToggleYear.displayName = 'ToggleFilter';

    return (
        <div>
            <div className='row align-items-center g-6 mt-0'>
                <div className='col-3 mt-0'>
                    <div className='d-flex gap-2'>
                        <Dropdown>
                            <Dropdown.Toggle
                                as={ToggleYear}
                                id='toggle-data-year'
                            >
                                <button className='btn btn-xs btn-outline-info opacity-75 rounded-pill d-flex align-items-center gap-2'>
                                    <span className='mx-2'>GW {activeGameweek}</span>
                                    <ChevronDown size={8} className='text-xs me-1'/>
                                </button>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as='ul'>
                                {weeks.map((item, index) => {
                                    return (
                                        <Dropdown.Item eventKey={index}
                                                       as='li' bsPrefix=' ' key={index}
                                                       onClick={() => handleYearFilter(item)}
                                        >
                                            <Link href='#' className={`dropdown-item ${activeGameweek === item ? 'active text-info' : 'text-muted'}`}>
                                                GW {item}
                                            </Link>
                                        </Dropdown.Item>
                                    );
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className='col-6 mt-0'>
                    <div className='d-flex align-items-end justify-content-center'>
                        <span className='fs-3 fw-bolder text-opacity-50 text-info'>Gameweek {activeGameweek} Team Selection</span>
                    </div>
                </div>
                <div className='col-3 mt-0'>
                    <div className='d-flex align-items-center justify-content-end'>
                        <ul className='nav nav-segment bg-body rounded-pill shadow-none p-0'>
                            <li className='nav-item'>
                                <span className='nav-link bg-info-subtle text-xs text-info rounded-pill px-5'>Predicted</span>
                            </li>
                            <li className='nav-item'>
                                <span className='nav-link text-xs text-muted rounded-pill px-5'>Actual</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className='my-6'/>
            <Row className="justify-content-center mt-4">
                <Col xs={12} md={6}>
                    <PitchView players={playersOnPitch} />
                </Col>
            </Row>
        </div>
    );
};

export default Assistant;
