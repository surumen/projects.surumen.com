import React, { FC } from 'react'
import { PremierLeaguePlayer } from '@/types/PremierLeaguePlayer'
import { Image } from 'react-bootstrap'

interface MatchLineupFormationProps {
    players: PremierLeaguePlayer[]
    className?: string
}

const TOTAL_COLS = 5

const Pitch: FC = () => (
    <div
        className="p-0 w-100"
        style={{
            transform: 'perspective(26.25rem) rotateX(17deg) translateY(-2rem)',
            padding: '0 .625rem .625rem',
            background: '#67a633',
            filter: 'drop-shadow(0 0 1rem rgba(0, 0, 0, .2))',
            borderBottomLeftRadius: 'var(--rounded-corner)',
            borderBottomRightRadius: 'var(--rounded-corner)',
        }}
    >
        <div
            className="d-flex flex-column justify-content-between align-items-center position-relative"
            style={{
                '--pitch-line-color': '#b7db92',
                minHeight: '35rem',
                color: 'var(--gray-0)',
                backgroundImage: 'url(/images/icons/pitch-tile.jpg)',
                backgroundSize: '29%',
                border: '2px solid var(--pitch-line-color)',
                borderTop: 'none',
            } as React.CSSProperties}
        >
            {/* Penalty area */}
            <svg
                viewBox="0 0 200 89"
                style={{ fill: 'none', stroke: 'var(--pitch-line-color)', width: '40%' }}
            >
                <g transform="matrix(1 0 0 -1 0 89)">
                    <path d="M199 89V18.986H1V89" strokeWidth="2px" />
                    <path
                        d="M144.401 89V65.234H54.865V89M145.132 18.875c-14.802-13.489-53.577-32.374-90.265 0"
                        strokeWidth="2px"
                    />
                </g>
            </svg>

            {/* Centre circle */}
            <svg
                viewBox="0 0 160 82"
                style={{
                    fill: 'none',
                    stroke: 'var(--pitch-line-color)',
                    width: '8rem',
                    minWidth: '35%',
                    maxWidth: '50%',
                }}
            >
                <g transform="matrix(1 0 0 -1 0 82)">
                    <path
                        d="M159.404 1.584c0 44.07-35.46 79.796-79.202 79.796S1 45.654 1 1.584"
                        strokeWidth="2px"
                    />
                </g>
            </svg>
        </div>
    </div>
)

const MatchLineupFormation: FC<MatchLineupFormationProps> = ({
                                                                 players,
                                                                 className = '',
                                                             }) => {
    // split out starters and subs
    const starters = players.slice(0, 11)
    const gk   = starters.filter(p => p.element_type === 1)
    const defs = starters.filter(p => p.element_type === 2)
    const mids = starters.filter(p => p.element_type === 3)
    const fwds = starters.filter(p => p.element_type === 4)
    const subs = players.slice(11)

    // renders a centered row of up to 5 slots
    const makeOnPitchRow = (group: PremierLeaguePlayer[], key: string) => (
        <li
            key={key}
            className="d-flex justify-content-center gap-4"
            style={{ listStyle: 'none' }}
        >
            {group.map(player => (
                <div key={player.id} style={{ width: `${100 / TOTAL_COLS}%` }}>
                    <button
                        type="button"
                        className="btn btn-light bg-transparent border-0 rounded-0 btn-xs p-0 w-100"
                    >
                        <div className="avatar avatar-lg w-auto h-auto bg-transparent">
                            <Image
                                className="avatar-img rounded-0"
                                src={player.kit}
                                alt={`${player.web_name} kit`}
                            />
                        </div>
                        <ul className="list-group list-group-sm text-center mt-n3 m-0">
                            <li className="list-group-item rounded-0 bg-secondary text-light border-0 px-4 py-1">
                                {player.web_name}
                            </li>
                            <li className="list-group-item rounded-0 border-0 bg-light text-body p-1">
                                {`£${(player.now_cost).toFixed(1)}m`}
                            </li>
                        </ul>
                    </button>
                </div>
            ))}
        </li>
    )

    return (
        <div className={`bg-success rounded bg-opacity-10 pb-3 ${className}`}>
            {/* —— Pitch + on-pitch overlay —— */}
            <div className="position-relative w-100 overflow-hidden">
                <Pitch />
                <ul
                    className="position-absolute top-0 start-0 bottom-0 w-100 h-100 d-flex flex-column justify-content-between py-5 px-4 m-0"
                >
                    {makeOnPitchRow(gk,   'gk')}
                    {makeOnPitchRow(defs, 'defs')}
                    {makeOnPitchRow(mids, 'mids')}
                    {makeOnPitchRow(fwds, 'fwds')}
                </ul>
            </div>

            <div className="align-items-center justify-content-center pt-4 pb-2 text-center">
                <h5 className="text-muted display-6 mb-0 fw-semibold opacity-50">
                    Substitutes
                </h5>
            </div>

            {/* —— Substitutes —— */}
            <ul className="d-flex justify-content-center gap-4 mt-2 px-3" style={{ listStyle: 'none', padding: 0 }}>
                {subs.map(player => (
                    <li key={player.id} style={{ width: `${100 / TOTAL_COLS}%` }}>
                        <button
                            type="button"
                            className="btn btn-light bg-transparent border-0 shadow rounded-0 btn-xs p-0 w-100"
                        >
                            <div className="avatar avatar-lg w-auto h-auto bg-transparent">
                                <Image
                                    className="avatar-img rounded-0"
                                    src={player.kit}
                                    alt={`${player.web_name} kit`}
                                />
                            </div>
                            <ul className="list-group list-group-sm text-center mt-n3 m-0">
                                <li className="list-group-item rounded-0 bg-secondary text-light border-0 px-4 py-1">
                                    {player.web_name}
                                </li>
                                <li className="list-group-item rounded-0 border-0 text-body bg-light p-1">
                                    {`£${(player.now_cost).toFixed(1)}m`}
                                </li>
                            </ul>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MatchLineupFormation
