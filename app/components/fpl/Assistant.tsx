import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useAppDispatch } from '@/store/hooks';
import {
    fetchManagerData,
    fetchManagerTeam,
} from '@/store/fplSlice';
import useFPL from '@/hooks/useFPL';
import { PitchView } from '@/widgets';
import { Player } from '@/types/Player';

const Assistant = () => {
    const dispatch = useAppDispatch();
    const managerId = 6888211;
    const gameweek = 34;

    const {
        managerTeam,
        allPlayers,
        loading,
        error
    } = useFPL();

    useEffect(() => {
        dispatch(fetchManagerData(managerId));
        dispatch(fetchManagerTeam({ managerId, gameweek }));
    }, [dispatch, managerId, gameweek]);

    if (loading) {
        return <p className="text-center mt-4">Loading team data...</p>;
    }

    if (error) {
        return <p className="text-center text-danger mt-4">Error: {error}</p>;
    }

    if (!managerTeam || !Array.isArray(managerTeam.picks) || !Array.isArray(allPlayers)) {
        return <p className="text-center mt-4">Waiting for team and player data...</p>;
    }

    const playersOnPitch: Player[] = managerTeam.picks
        .map((pick: any) => allPlayers.find((p: Player) => p.id === pick.element))
        .filter(Boolean); // remove any nulls

    return (
        <Row className="justify-content-center mt-4">
            <Col xs={12}>
                <Row>
                    <Col xs={12}>
                        <div className="text-center mb-4">
                            <h4 className="fw-bold text-muted">Your Gameweek {gameweek} Team</h4>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <PitchView players={playersOnPitch} />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default Assistant;
