import { useState, useEffect } from 'react';

export function useGridLayout() {
    const [gridCols, setGridCols] = useState(5);

    useEffect(() => {
        const handleResize = () => {
            setGridCols(window.innerWidth <= 768 ? 3 : 5);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { gridCols, setGridCols };
}
