import { useState, useCallback } from 'react';
import type { CardImage } from '../lib/types';
import { API_ENDPOINT } from '../lib/constants';

const PAGE_SIZE_INITIAL = 30;
const PAGE_SIZE_MORE = 20;

type SearchParams = Record<string, string>;

export const useCardSearch = () => {
    const [images, setImages] = useState<CardImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [currentQuery, setCurrentQuery] = useState<SearchParams>({});
    const [isNewSearch, setIsNewSearch] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = useCallback(async (searchParams: SearchParams, isNew: boolean) => {
        if (isNew) {
            setLoading(true);
            setIsNewSearch(true);
        } else {
            setLoadingMore(true);
        }

        const params = new URLSearchParams(searchParams);
        setError(null);
        try {
            const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const data = await response.json();
            const newImages: CardImage[] = data.image_rows || [];

            if (isNew) {
                setImages(newImages);
            } else {
                setImages(prev => {
                    const existingKeys = new Set(prev.map(img => img.imageKey));
                    const uniqueNewImages = newImages.filter(img => !existingKeys.has(img.imageKey));
                    return [...prev, ...uniqueNewImages];
                });
            }
            setHasMore(newImages.length === (isNew ? PAGE_SIZE_INITIAL : PAGE_SIZE_MORE));
        } catch (err) {
            console.error("Error fetching images:", err);
            setError("Failed to load cards. Please try again.");
            if (isNew) {
                setImages([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setIsNewSearch(false);
        }
    }, []);

    const handleSearch = useCallback((query: string, isCameo: boolean, isTrainer: boolean, isIllustrator: boolean, sortOrder: 'asc' | 'desc', isSet: boolean) => {
        if (!query.trim()) return;

        setImages([]); // Clear images for new search
        const newQuery: SearchParams = {
            q: query.split(',').map(part => part.trim().toLowerCase().replace(/\s+/g, '-')).join(','),
            limit: String(PAGE_SIZE_INITIAL),
            offset: '0',
        };

        if (isCameo) newQuery.cameo = '1';
        if (isTrainer) newQuery.trainer = '1';
        if (isIllustrator) newQuery.illustrator = '1';
        if (isSet) newQuery.set = '1';
        if (sortOrder === 'desc') newQuery.descending = '1';

        setCurrentQuery(newQuery);
        setPage(1);
        fetchImages(newQuery, true);
    }, [fetchImages]);

    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        const nextPage = page + 1;
        const newOffset = (page * PAGE_SIZE_MORE) + (PAGE_SIZE_INITIAL - PAGE_SIZE_MORE);
        
        const newQuery: SearchParams = {
            ...currentQuery,
            limit: String(PAGE_SIZE_MORE),
            offset: String(newOffset),
        };

        setPage(nextPage);
        fetchImages(newQuery, false);
    }, [loadingMore, hasMore, page, currentQuery, fetchImages]);

    return { images, setImages, loading, loadingMore, hasMore, handleSearch, loadMore, isNewSearch, error };
};
