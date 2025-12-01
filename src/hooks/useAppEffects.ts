import { useState, useEffect, useCallback } from 'react';
import type { ChangelogEntry } from '../lib/types';
import { placeholderWords } from '../lib/constants';

export const useAppEffects = (query: string) => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isChangelogOpen, setIsChangelogOpen] = useState(false);
    const [changelogData, setChangelogData] = useState<ChangelogEntry[]>([]);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const fetchChangelog = useCallback(async () => {
        try {
            const response = await fetch('/changelog.json');
            const data = await response.json();
            setChangelogData(data);
        } catch (error) {
            console.error("Error fetching changelog:", error);
        }
    }, []);

    useEffect(() => {
        if (isChangelogOpen) {
            fetchChangelog();
        }
    }, [isChangelogOpen, fetchChangelog]);

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
        isChangelogOpen,
        setIsChangelogOpen,
        changelogData,
        placeholderIndex,
    };
};
