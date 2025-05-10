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

        const roundIndexes = type === 'left'
            ? [...Array(gameRefs.length - 1).keys()]
            : [...Array(gameRefs.length - 1).keys()].map(i => gameRefs.length - 1 - i);

        for (const round of roundIndexes) {
            const current = gameRefs[round];

            for (let i = 0; i < current.length; i++) {
                const outerDiv = current[i]?.current;
                if (!outerDiv) continue;

                // 🔍 Try to find the actual button inside the container
                const button = outerDiv.querySelector('button');
                if (!button) continue;

                const buttonRect = button.getBoundingClientRect();

                const fromY = (buttonRect.top + buttonRect.bottom) / 2 - containerRect.top;

                const fromX = type === 'left'
                    ? buttonRect.right - containerRect.left
                    : buttonRect.left - containerRect.left;

                const toX = type === 'left'
                    ? fromX + buttonRect.width * 0.5 // go right
                    : fromX - buttonRect.width * 0.5; // go left

                newPaths.push(
                    <path
                        key={`h-${round}-${i}`}
                        d={`M${fromX},${fromY} L${toX},${fromY}`}
                        stroke="var(--bs-secondary)"
                        strokeWidth="1"
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

        draw(); // initial draw

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
