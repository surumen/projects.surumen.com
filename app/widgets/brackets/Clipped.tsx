// import node module libraries
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { v4 } from 'uuid';


export const Clipped = (props) => {
    const { path, children } = props;
    const id = useMemo(() => v4(), []);

    return (
        <g>
            <defs>
                <clipPath id={id}>
                    {path}
                </clipPath>
            </defs>

            <g clipPath={`url(#${id})`}>
                {children}
            </g>
        </g>
    );
};


Clipped.propTypes = {
    path: PropTypes.oneOfType([
        PropTypes.element, PropTypes.arrayOf(PropTypes.element)
    ]),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
}


export const RectClipped = (props) => {
    const { x, y, width, height, children } = props;

    return (
        <Clipped path={<rect x={x} y={y} width={width} height={height}/>}>
            {children}
        </Clipped>
    );
};

RectClipped.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
}

