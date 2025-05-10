import React, { useEffect, useState, useRef } from 'react';

interface ConnectorProps {
    gameRefs: Array<Array<React.RefObject<HTMLDivElement>>>;
    containerRef: React.RefObject<HTMLDivElement>;
    type: 'left' | 'right';
}

const Connector: React.FC<ConnectorProps> = ({ gameRefs, containerRef, type }) => {
    const [paths, setPaths] = useState<JSX.Element[]>([]);
    const observerRef = useRef<ResizeObserver | null>(null);

    const draw = () => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newPaths: JSX.Element[] = [];

        const totalRounds = gameRefs.length;
        const roundIndexes = type === 'left'
            ? [...Array(totalRounds - 1).keys()]
            : [...Array(totalRounds - 1).keys()].map(i => totalRounds - 1 - i);

        for (const round of roundIndexes) {
            const current = gameRefs[round];
            const nextRoundIndex = type === 'left' ? round + 1 : round - 1;
            const next = gameRefs[nextRoundIndex];

            for (let i = 0; i < current.length; i++) {
                const outerDiv = current[i]?.current;
                if (!outerDiv) continue;
                const button = outerDiv.querySelector('button');
                if (!button) continue;

                const buttonRect = button.getBoundingClientRect();
                const fromY = (buttonRect.top + buttonRect.bottom) / 2 - containerRect.top;
                const fromX = type === 'left'
                    ? buttonRect.right - containerRect.left
                    : buttonRect.left - containerRect.left;
                const toX = type === 'left'
                    ? fromX + buttonRect.width * 0.5
                    : fromX - buttonRect.width * 0.5;

                const nextIndex = Math.floor(i / 2);
                const nextDiv = next?.[nextIndex]?.current;
                if (!nextDiv) continue;
                const nextButton = nextDiv.querySelector('button');
                if (!nextButton) continue;

                const nextRect = nextButton.getBoundingClientRect();
                const toY = (nextRect.top + nextRect.bottom) / 2 - containerRect.top;

                const radius = 15;
                const curveDown = toY > fromY;
                const verticalOffset = curveDown ? radius : -radius;
                const horizontalOffset = type === 'left' ? radius : -radius;
                const arcSweep = type === 'left'
                    ? (curveDown ? 1 : 0)
                    : (curveDown ? 0 : 1);

                newPaths.push(
                    <path
                        key={`hv-${round}-${i}`}
                        d={`
                            M${fromX},${fromY}
                            L${toX - horizontalOffset},${fromY}
                            A${radius},${radius} 0 0,${arcSweep} ${toX},${fromY + verticalOffset}
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

        setPaths(newPaths);
    };

    useEffect(() => {
        if (!containerRef.current) return;
        draw();

        const observer = new ResizeObserver(draw);
        observer.observe(containerRef.current);
        observerRef.current = observer;

        return () => {
            observer.disconnect();
        };
    }, [gameRefs, containerRef, type]);

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
