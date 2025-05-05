import React from 'react';
import { Player } from '@/types/Player';

import { ArrowUpCircleFill, ChevronDown, InfoCircle } from 'react-bootstrap-icons';

interface PitchViewProps {
    players: Player[];
}

const defaultShirt: string = 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_1-220.webp';

const PitchView: React.FC<PitchViewProps> = ({ players }) => {
    const startingPlayers = players.slice(0, 11);
    const substitutes = players.slice(11);

    const goalkeeper = startingPlayers.find(p => p.element_type === 1);
    const defenders = startingPlayers.filter(p => p.element_type === 2);
    const midfielders = startingPlayers.filter(p => p.element_type === 3);
    const forwards = startingPlayers.filter(p => p.element_type === 4);

    const renderRow = (group: Player[], rowLabel: string) => (
        <div className="row justify-content-center mt-3 text-center">
            {group.map((player) => (
                <div key={player.id} className="col-auto">
                    <div className="card bg-transparent border-0 rounded position-relative" style={{ width: '120px' }}>
                        <div className="card-body rounded bg-transparent">
                            <img
                                src={defaultShirt}
                                className="card-img-top"
                                alt={`${player.web_name} shirt`}
                            />
                            <div className="group-item rounded-top d-flex flex-column p-2 position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-opacity-10">
                                <div className="d-flex justify-content-between">
                                    <ArrowUpCircleFill size={12} className='text-danger me-1'/>
                                    <InfoCircle size={12} className='text-white me-1'/>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-center border-0 rounded-bottom p-2 bg-secondary bg-opacity-75">
                            <p className="mb-0 text-xs text-light fw-bold">{player.web_name}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div
            className="container py-4"
            style={{
                backgroundImage: 'url("https://fantasy.premierleague.com/static/media/pitch-default.dab51b01.svg")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top center',
                backgroundSize: 'cover',
                borderRadius: '8px'
            }}
        >
            {goalkeeper && renderRow([goalkeeper], 'GK')}
            {renderRow(defenders, 'DEF')}
            {renderRow(midfielders, 'MID')}
            {renderRow(forwards, 'FWD')}
            {renderRow(substitutes, 'SUB')}
        </div>
    );
};

export default PitchView;
