import React from 'react';
import { Player } from '@/types/Player';
import 'bootstrap/dist/css/bootstrap.min.css';

interface PitchViewProps {
    players: Player[];
}

const PitchView: React.FC<PitchViewProps> = ({ players }) => {
    // Group players by element_type
    const goalkeeper = players.find(p => p.element_type === 1);
    const defenders = players.filter(p => p.element_type === 2);
    const midfielders = players.filter(p => p.element_type === 3);
    const forwards = players.filter(p => p.element_type === 4);
    const substitutes = players.slice(11); // assuming 15-man squad, subs start at index 11

    const renderRow = (group: Player[], rowLabel: string) => (
        <div className="row justify-content-center mt-3 text-center">
            {group.map((player) => (
                <div key={player.id} className="col-auto">
                    <div className="card p-2 shadow-sm">
                        <strong>{player.web_name}</strong><br />
                        <small className="text-muted">{rowLabel}</small>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container py-4 bg-success-subtle rounded">
            <h5 className="text-center mb-4">Pitch View</h5>

            {/* Row 1: Goalkeeper */}
            {goalkeeper && renderRow([goalkeeper], 'GK')}

            {/* Row 2: Defenders */}
            {renderRow(defenders, 'DEF')}

            {/* Row 3: Midfielders */}
            {renderRow(midfielders, 'MID')}

            {/* Row 4: Forwards */}
            {renderRow(forwards, 'FWD')}

            {/* Row 5: Substitutes */}
            {renderRow(substitutes, 'SUB')}
        </div>
    );
};

export default PitchView;
