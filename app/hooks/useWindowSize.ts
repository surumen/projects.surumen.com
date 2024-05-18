// import node module libraries
import { useState, useLayoutEffect, useEffect } from 'react';
import { useMediaQuery } from "react-responsive";

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const useWindowSize = () => {

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const getSize = () => ({
        width: window.innerWidth - 200,
        height: window.innerHeight - 200
    });

    const [windowSize, setWindowSize] = useState(getSize);

    useIsomorphicLayoutEffect(() => {
        if (typeof window === 'undefined') return;

        const onResize = () => {
            setWindowSize(getSize);
        };
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
        }, []);
    return windowSize;
};

export default useWindowSize;
