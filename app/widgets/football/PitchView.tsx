import React, { useMemo } from 'react';
import { Image } from 'react-bootstrap';
import { InfoCircle } from 'react-bootstrap-icons';
import { PremierLeaguePlayer } from '@/types/PremierLeaguePlayer';

interface PitchViewProps {
    players: PremierLeaguePlayer[];
    className: string;
}

const pitchBackground: string = '/images/svg/pitch.svg'

const PitchView: React.FC<PitchViewProps> = ({ players, className  }) => {
    console.log(players)
    const startingPlayers = players.slice(0, 11);
    const substitutes = players.slice(11);

    const goalkeeper = startingPlayers.find(p => p.element_type === 1);
    const defenders = startingPlayers.filter(p => p.element_type === 2);
    const midfielders = startingPlayers.filter(p => p.element_type === 3);
    const forwards = startingPlayers.filter(p => p.element_type === 4);

    const maxWidth = useMemo(() => 18, []);

    const renderRow = (group: PremierLeaguePlayer[], rowLabel: string, maxWidth: number = 15) => (
        <div className='row justify-content-center mt-3 text-center gx-1'>
            {group.map((player) => (
                <div key={player.id} className='col-auto px-1' style={{ flex: '0 0 auto', maxWidth: `${maxWidth}%` }}>
                    <div className='card card-sm w-100 border-0 bg-transparent'>
                        <div className="card-img-top border-0">
                            <Image
                                src={player.kit}
                                className="card-img-top img-fluid w-50"
                                alt={`${player.web_name} shirt`}
                            />
                            <div className="group-item rounded-top d-flex flex-column p-1 position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-opacity-10">
                                <div className="d-flex justify-content-end">
                                    <InfoCircle size={12} className='text-white me-1' />
                                </div>
                            </div>
                        </div>
                        <div className='alert alert-secondary card-alert rounded-top-0 rounded-1 mt-n2 py-1 px-1'>
                            <span className='alert-link text-xs fw-normal'>{player.web_name}
                                <span className='ms-1'>{player.is_captain ? 'ⓒ' : player.is_vice_captain ? 'ⓥ' : ''}</span>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className={`w-100 position-relative bg-light ${className}`}>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '90%',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${pitchBackground})`,
                        backgroundRepeat:  'no-repeat',
                        backgroundPosition: 'top center',
                        backgroundSize:     'contain',
                        backgroundBlendMode: 'multiply',
                        zIndex: 0,
                        maxHeight: '120vh',
                        opacity: 0.3
                    }}
                />
                <div className="px-3" style={{ position: 'absolute', top: '-1.5%', left: 0, right: 0, zIndex: 1 }}>
                    {goalkeeper && renderRow([goalkeeper], 'GK', maxWidth)}
                    {renderRow(defenders, 'DEF', maxWidth)}
                    {renderRow(midfielders, 'MID', maxWidth)}
                    {renderRow(forwards, 'FWD', maxWidth)}
                </div>
                <div className='px-3' style={{ marginTop: '-25%' }}>
                    {renderRow(substitutes, 'SUB', maxWidth)}
                </div>
            </div>
        </div>

    );
};

export default PitchView;
