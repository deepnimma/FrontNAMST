import { useState, useEffect } from 'react';
import { placeholderWords } from '../lib/constants';

export const useAppEffects = (query: string) => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);

        if (query.length > 0) {
            return () => window.removeEventListener('scroll', handleScroll);
        }

        const intervalId = setInterval(() => {
            setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholderWords.length);
        }, 2000);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [query]);

    return {
        showScrollButton,
        placeholderIndex,
    };
};
