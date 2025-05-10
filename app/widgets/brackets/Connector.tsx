// widgets/brackets/Connector.tsx
import React, { useEffect, useState, useRef } from 'react';

interface ConnectorProps {
    gameRefs: React.RefObject<HTMLDivElement>[][];
    containerRef: React.RefObject<HTMLDivElement>;
    type?: 'left' | 'right';
    isFinalRegion?: boolean;
}

const Connector: React.FC<ConnectorProps> = ({
                                                 gameRefs,
                                                 containerRef,
                                                 isFinalRegion = false,
                                                 type = 'left',
                                             }) => {
    // If it's the final region and there's only one game, draw nothing
    if (isFinalRegion && gameRefs.length < 2) {
        return null;
    }

    const [paths, setPaths] = useState<JSX.Element[]>([]);
    const observerRef = useRef<ResizeObserver | null>(null);

    const draw = () => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newPaths: JSX.Element[] = [];

        if (isFinalRegion) {
            // ─── FinalRegion: straight horizontal lines from each semi to final ───
            const [semis, finals] = gameRefs;
            const semiButtons = semis.map(ref => ref.current?.querySelector('button'));
            const finalBtn = finals[0].current?.querySelector('button');
            if (!finalBtn) return;

            const finalRect = finalBtn.getBoundingClientRect();
            const finalX = (finalRect.left + finalRect.right) / 2 - containerRect.left;

            semiButtons.forEach((btn, i) => {
                if (!btn) return;
                const r = btn.getBoundingClientRect();
                const fromY = (r.top + r.bottom) / 2 - containerRect.top;
                const fromX = type === 'left'
                    ? r.right - containerRect.left
                    : r.left  - containerRect.left;

                newPaths.push(
                    <path
                        key={`final-h-${i}`}
                        d={`M${fromX},${fromY} L${finalX},${fromY}`}
                        stroke="var(--bs-border-color)"
                        strokeWidth="var(--bs-border-width)"
                        fill="none"
                        strokeLinecap="round"
                    />
                );
            });

        } else {
            // ─── Non-final regions: your original HV connector logic ───
            const totalRounds = gameRefs.length;
            const roundIndexes = type === 'left'
                ? [...Array(totalRounds - 1).keys()]
                : [...Array(totalRounds - 1).keys()].map(i => totalRounds - 1 - i);

            for (const round of roundIndexes) {
                const current = gameRefs[round];
                const nextIdx = type === 'left' ? round + 1 : round - 1;
                const next = gameRefs[nextIdx];

                for (let i = 0; i < current.length; i++) {
                    const outerDiv = current[i]?.current;
                    if (!outerDiv) continue;
                    const button = outerDiv.querySelector('button');
                    if (!button) continue;

                    const bRect = button.getBoundingClientRect();
                    const fromY = (bRect.top + bRect.bottom) / 2 - containerRect.top;
                    const fromX = type === 'left'
                        ? bRect.right - containerRect.left
                        : bRect.left  - containerRect.left;

                    const toX = type === 'left'
                        ? fromX + bRect.width * 0.5
                        : fromX - bRect.width * 0.5;

                    const nextIndex = Math.floor(i / 2);
                    const nextDiv = next?.[nextIndex]?.current;
                    if (!nextDiv) continue;
                    const nextBtn = nextDiv.querySelector('button');
                    if (!nextBtn) continue;

                    const nRect = nextBtn.getBoundingClientRect();
                    const toY = (nRect.top + nRect.bottom) / 2 - containerRect.top;

                    const radius = 15;
                    const curveDown = toY > fromY;
                    const vOffset = curveDown ? radius : -radius;
                    const hOffset = type === 'left' ? radius : -radius;
                    const arcSweep = type === 'left'
                        ? (curveDown ? 1 : 0)
                        : (curveDown ? 0 : 1);

                    newPaths.push(
                        <path
                            key={`hv-${round}-${i}`}
                            d={`
                M${fromX},${fromY}
                L${toX - hOffset},${fromY}
                A${radius},${radius} 0 0,${arcSweep} ${toX},${fromY + vOffset}
                L${toX},${toY}
              `}
                            stroke="var(--bs-border-color)"
                            strokeWidth="var(--bs-border-width)"
                            fill="none"
                            strokeLinecap="round"
                        />
                    );
                }
            }
        }

        setPaths(newPaths);
    };

    useEffect(() => {
        if (!containerRef.current) return;
        draw();
        const obs = new ResizeObserver(draw);
        obs.observe(containerRef.current);
        observerRef.current = obs;
        return () => { obs.disconnect(); };
    }, [gameRefs, containerRef, isFinalRegion, type]);

    return (
        <svg
            className="position-absolute"
            style={{
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'visible',
            }}
        >
            <g>{paths}</g>
        </svg>
    );
};

export default Connector;
