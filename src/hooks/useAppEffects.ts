import { useState, useEffect, useCallback } from 'react';
import type { ChangelogEntry } from '../lib/types';
import { placeholderWords } from '../lib/constants';

const CACHE_KEY = 'changelogData';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export const useAppEffects = (query: string) => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isChangelogOpen, setIsChangelogOpen] = useState(false);
    const [changelogData, setChangelogData] = useState<ChangelogEntry[]>([]);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const fetchChangelog = useCallback(async () => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_DURATION) {
                setChangelogData(data);
                return;
            }
        }

        try {
            const response = await fetch('/changelog.json');
            const data = await response.json();
            setChangelogData(data);
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (error) {
            console.error("Error fetching changelog:", error);
        }
    }, []);

    useEffect(() => {
        if (isChangelogOpen && changelogData.length === 0) {
            fetchChangelog();
        }
    }, [isChangelogOpen, changelogData, fetchChangelog]);

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
