// import node module libraries
import { useState, useEffect } from 'react';

const useWindowSize = () => {
    const getSize = () => ({
        width: window.innerWidth - 200,
        height: window.innerHeight - 200,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 80,
        marginBottom: 0,
        marginTimeAxis: 30
    });
    const [windowSize, setWindowSize] = useState(getSize);
    useEffect(() => {
        const onResize = () => {
            setWindowSize(getSize);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
        }, []);
    return windowSize;
};

export default useWindowSize;
