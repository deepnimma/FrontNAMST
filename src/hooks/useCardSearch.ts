import { useState, useCallback } from 'react';
import type { CardImage } from '../lib/types';
import { API_ENDPOINT } from '../lib/constants';

const PAGE_SIZE_INITIAL = 30;
const PAGE_SIZE_MORE = 20;

export const useCardSearch = () => {
    const [images, setImages] = useState<CardImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [currentQuery, setCurrentQuery] = useState({});
    const [isNewSearch, setIsNewSearch] = useState(false);

    const fetchImages = useCallback(async (searchParams: any, isNew: boolean) => {
        if (isNew) {
            setLoading(true);
            setIsNewSearch(true);
        } else {
            setLoadingMore(true);
        }

        const params = new URLSearchParams(searchParams);
        try {
            const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const data = await response.json();
            const newImages = data.image_rows || [];

            setImages(prev => (isNew ? newImages : [...prev, ...newImages]));
            setHasMore(newImages.length === (isNew ? PAGE_SIZE_INITIAL : PAGE_SIZE_MORE));
        } catch (error) {
            console.error("Error fetching images:", error);
            alert("Failed to fetch images. Check console for details.");
            if (isNew) {
                setImages([]); // On error, clear the grid for a new search.
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setIsNewSearch(false);
        }
    }, []);

    const handleSearch = useCallback((query: string, isCameo: boolean, isTrainer: boolean, isIllustrator: boolean, sortOrder: 'asc' | 'desc', isSet: boolean) => {
        if (!query.trim()) return;

        const newQuery = {
            q: query.split(',').map(part => part.trim().toLowerCase().replace(/\s+/g, '-')).join(','),
            limit: PAGE_SIZE_INITIAL,
            offset: 0,
            ...(isCameo && { cameo: '1' }),
            ...(isTrainer && { trainer: '1' }),
            ...(isIllustrator && { illustrator: '1' }),
            ...(sortOrder === 'desc' && { descending: '1' }),
            ...(isSet && { set: '1' }),
        };

        setCurrentQuery(newQuery);
        setPage(1);
        fetchImages(newQuery, true);
    }, [fetchImages]);

    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        const nextPage = page + 1;
        const newOffset = (page * PAGE_SIZE_MORE) + (PAGE_SIZE_INITIAL - PAGE_SIZE_MORE);
        
        const newQuery = {
            ...currentQuery,
            limit: PAGE_SIZE_MORE,
            offset: newOffset,
        };

        setPage(nextPage);
        fetchImages(newQuery, false);
    }, [loadingMore, hasMore, page, currentQuery, fetchImages]);

    return { images, setImages, loading, loadingMore, hasMore, handleSearch, loadMore, isNewSearch };
};
