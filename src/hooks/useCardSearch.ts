import { useState } from 'react';
import type { CardImage } from '../lib/types';
import { API_ENDPOINT } from '../lib/constants';

export const useCardSearch = () => {
    const [images, setImages] = useState<CardImage[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (
        query: string,
        isCameo: boolean,
        isTrainer: boolean,
        isIllustrator: boolean,
        sortOrder: 'asc' | 'desc'
    ) => {
        if (!query.trim()) return;
        setLoading(true);
        setImages([]);
        const processedQuery = query.split(',').map(part => part.trim().toLowerCase().replace(/\s+/g, '-')).join(',');
        const params = new URLSearchParams({ q: processedQuery });
        if (isCameo) params.append('cameo', '1');
        if (isTrainer) params.append('trainer', '1');
        if (isIllustrator) params.append('illustrator', '1');
        if (sortOrder === 'desc') params.append('descending', '1');
        try {
            const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const data = await response.json();
            setImages(data.image_rows || []);
        } catch (error) {
            console.error("Error fetching images:", error);
            alert("Failed to fetch images. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return { images, setImages, loading, handleSearch };
};
