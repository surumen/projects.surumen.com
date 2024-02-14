import { useState, useEffect } from 'react';

const useScroll = () => {
    const [scrollPosition, setScrollPosition] = useState(() => {
        return {x: 0, y: 0};
    });

    const handleScroll = () => {
        setScrollPosition({
            x: window.scrollX,
            y: window.scrollY,
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return scrollPosition;
}

export default useScroll;
