// widgets/brackets/Connector.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';

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
    const [paths, setPaths] = useState<JSX.Element[]>([]);
    const observerRef = useRef<ResizeObserver | null>(null);

    const draw = useCallback(() => {
        const cont = containerRef.current;
        if (!cont) return;
        const { left: cL, top: cT } = cont.getBoundingClientRect();
        const newPaths: JSX.Element[] = [];

        // nothing to draw in edge‐case
        if (isFinalRegion && gameRefs.length < 2) {
            setPaths([]);
            return;
        }

        if (isFinalRegion) {
            // finals: just straight horizontals into the championship button
            const [semis, finals] = gameRefs;
            const finalBtn = finals[0].current?.querySelector('button');
            if (!finalBtn) {
                setPaths([]);
                return;
            }
            const fR = finalBtn.getBoundingClientRect();
            const finalX = ((fR.left + fR.right) / 2) - cL;
            semis.forEach((refObj, i) => {
                const btn = refObj.current?.querySelector('button');
                if (!btn) return;
                const bR = btn.getBoundingClientRect();
                const fromY = ((bR.top + bR.bottom) / 2) - cT;
                const fromX = type === 'left'
                    ? bR.right - cL
                    : bR.left  - cL;
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
            // normal connectors with a quarter-circle elbow of radius R
            const R = 15;
            const rounds = gameRefs.length;

            for (let r = 0; r < rounds - 1; r++) {
                const curr = gameRefs[r];
                const nxt  = gameRefs[r + 1];

                curr.forEach((refObj, i) => {
                    const btn     = refObj.current?.querySelector('button');
                    const nextBtn = nxt[Math.floor(i / 2)]?.current?.querySelector('button');
                    if (!btn || !nextBtn) return;

                    const bR = btn.getBoundingClientRect();
                    const nR = nextBtn.getBoundingClientRect();

                    // source in the middle of its side
                    const fromY = ((bR.top + bR.bottom) / 2) - cT;
                    const fromX = type === 'left'
                        ? bR.right - cL
                        : bR.left  - cL;

                    // target at top or bottom center
                    const toCX = ((nR.left + nR.right) / 2) - cL;
                    const down = (((nR.top + nR.bottom) / 2) > (bR.top + bR.bottom) / 2) ? 1 : -1;
                    const toY  = down === 1
                        ? nR.top  - cT
                        : nR.bottom - cT;
                    const toX  = toCX;

                    // compute where straight horizontal ends and arc begins
                    const elbowX = type === 'left'
                        ? toX - R
                        : toX + R;

                    // arc sweep flag: for left‐side elbows we sweep down=1→1,up=0→0; right side flips
                    const sweep = type === 'left'
                        ? (down === 1 ? 1 : 0)
                        : (down === 1 ? 0 : 1);

                    newPaths.push(
                        <path
                            key={`hv-${r}-${i}`}
                            d={`
                M${fromX},${fromY}
                L${elbowX},${fromY}
                A${R},${R} 0 0,${sweep} ${elbowX + (type==='left'?R:-R)},${fromY + down*R}
                L${toX},${toY}
              `}
                            stroke="var(--bs-border-color)"
                            strokeWidth="var(--bs-border-width)"
                            fill="none"
                            strokeLinecap="round"
                        />
                    );
                });
            }
        }

        setPaths(newPaths);
    }, [gameRefs, containerRef, isFinalRegion, type]);

    useEffect(() => {
        if (!containerRef.current) return;
        draw();
        const obs = new ResizeObserver(draw);
        obs.observe(containerRef.current);
        observerRef.current = obs;
        return () => { obs.disconnect(); };
    }, [containerRef, draw]);

    if (isFinalRegion && gameRefs.length < 2) return null;

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
