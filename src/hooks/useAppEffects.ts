import { useState, useEffect } from 'react';
import type { ChangelogEntry } from '../lib/types';
import { placeholderWords } from '../lib/constants';

export const useAppEffects = (query: string) => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isChangelogOpen, setIsChangelogOpen] = useState(false);
    const [changelogData, setChangelogData] = useState<ChangelogEntry[]>([]);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
        const fetchChangelog = async () => {
            try {
                const response = await fetch('/changelog.json');
                const data = await response.json();
                setChangelogData(data);
            } catch (error) {
                console.error("Error fetching changelog:", error);
            }
        };

        fetchChangelog();

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
        isChangelogOpen,
        setIsChangelogOpen,
        changelogData,
        placeholderIndex,
    };
};
