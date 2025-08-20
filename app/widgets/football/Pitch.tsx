import React, { FC } from 'react';

const Pitch: FC = () => (
    <div
        className="p-0 w-100"
        style={{
            transform: 'perspective(26.25rem) rotateX(17deg) translateY(-2rem)',
            padding: '0 .625rem .625rem',
            background: '#2d7a02',
            // filter: 'drop-shadow(0 0 1rem rgba(0, 0, 0, .2))',
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
);

export default Pitch;
