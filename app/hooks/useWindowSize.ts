// import node module libraries
import { useState, useEffect } from 'react';

const useWindowSize = () => {
    const getSize = () => ({
        width: window.innerWidth - 200,
        height: window.innerHeight - 200
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
