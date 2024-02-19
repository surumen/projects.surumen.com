// import node module libraries
import React from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';


export const Clipped = (props) => {
    const _id = v4();
    const { path, children } = props;
    return (
        <g>
            <defs>
                <clipPath id={_id}>
                    {path}
                </clipPath>
            </defs>

            <g clipPath={`url(#${_id})`}>
                {children}
            </g>
        </g>
    );
};

// Typechecking With PropTypes
Clipped.propTypes = {
    path: PropTypes.object
};

export const ClippedRect = ({ x, y, width, height, children }) => {

    return (
        // @ts-ignore
        <Clipped path={<rect x={x} y={y} width={width} height={height}/>}>
            {children}
        </Clipped>
    );
};

// Specifies the default values for props

// Typechecking With PropTypes
ClippedRect.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
};
