import React from 'react';
import { Image } from 'react-bootstrap';
import { ArrowDownCircleFill, ArrowUpCircleFill, InfoCircle } from 'react-bootstrap-icons';
import { PremierLeaguePlayer } from '@/types/PremierLeaguePlayer';

interface PitchViewProps {
    players: PremierLeaguePlayer[];
}

const pitchBackground: string = '/images/svg/pitch.svg'

const PitchView: React.FC<PitchViewProps> = ({ players }) => {
    const startingPlayers = players.slice(0, 11);
    const substitutes = players.slice(11);

    const goalkeeper = startingPlayers.find(p => p.element_type === 1);
    const defenders = startingPlayers.filter(p => p.element_type === 2);
    const midfielders = startingPlayers.filter(p => p.element_type === 3);
    const forwards = startingPlayers.filter(p => p.element_type === 4);

    const renderRow = (group: PremierLeaguePlayer[], rowLabel: string, maxWidth: number = 20) => (
        <div className="row justify-content-center mt-3 text-center gx-1">
            {group.map((player) => (
                <div key={player.id} className="col-auto px-1" style={{ flex: '0 0 auto', maxWidth: `${maxWidth}%` }}>
                    <div className="card bg-transparent border-0 rounded position-relative w-100">
                        <div className="card-body rounded bg-transparent p-0">
                            <Image
                                src={player.kit}
                                className="card-img-top img-fluid w-50"
                                alt={`${player.web_name} shirt`}
                            />
                            <div className="group-item rounded-top d-flex flex-column p-1 position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-opacity-10">
                                <div className="d-flex justify-content-between">
                                    <ArrowDownCircleFill size={12} className='text-danger me-1' />
                                    <InfoCircle size={12} className='text-white me-1' />
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-center border-0 rounded-bottom p-1 bg-secondary">
                            <p className="mb-0 text-xs text-light fw-semibold">{player.web_name}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const aspectRatio = (1790 / 2232) * 100;

    return (
        <div className="w-100 position-relative">
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '90%',
                    borderRadius: '8px',
                    overflow: 'visible',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url("${pitchBackground}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top center',
                        backgroundSize:  'contain',
                        opacity: 0.9,
                        zIndex: 0,
                    }}
                />
                <div className="px-3" style={{ position: 'absolute', top: '-2.5%', left: 0, right: 0, zIndex: 1 }}>
                    {goalkeeper && renderRow([goalkeeper], 'GK')}
                    {renderRow(defenders, 'DEF')}
                    {renderRow(midfielders, 'MID')}
                    {renderRow(forwards, 'FWD')}
                </div>
            </div>
            <div className="px-3" style={{ marginTop: '-18%' }}>
                {renderRow(substitutes, 'SUB', 18)}
            </div>
        </div>

    );
};

export default PitchView;
