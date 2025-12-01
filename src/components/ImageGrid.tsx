import React, { useRef, useCallback, useState, useEffect } from 'react';
import type { CardImage } from '../lib/types';
import { R2_BUCKET_URL } from '../lib/constants';
import { capitalizeWords } from '../lib/utils';
import LazyImage from './LazyImage';

interface ImageGridProps {
    loading: boolean;
    images: CardImage[];
    gridCols: number;
    openModal: (image: CardImage) => void;
    showSetNames: boolean;
    query: string;
    showReverseHolos: boolean;
    searchPerformed: boolean;
    loadMore: () => void;
    hasMore: boolean;
    loadingMore: boolean;
    isNewSearch: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = React.memo(({
    loading,
    images,
    gridCols,
    openModal,
    showSetNames,
    query,
    showReverseHolos,
    searchPerformed,
    loadMore,
    hasMore,
    loadingMore,
    isNewSearch,
}) => {
    const observer = useRef<IntersectionObserver | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Animate initial images on mount
        if (images.length > 0) {
            const timer = setTimeout(() => {
                setLoadedImages(new Set(images.map(img => img.imageKey)));
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [images]);

    const handleImageLoad = (imageKey: string) => {
        setLoadedImages(prev => {
            if (prev.has(imageKey)) {
                return prev;
            }
            const newSet = new Set(prev);
            newSet.add(imageKey);
            return newSet;
        });
    };

    const lastImageElementRef = useCallback((node: HTMLDivElement) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, loadMore]);

    const filteredImages = showReverseHolos ? images : images.filter(image => image.isReverseHolo !== 1);

    if (loading && isNewSearch) {
        return <div className="loading-spinner"></div>;
    }

    if (images.length === 0 && query && !loading) {
        return (
            <div className="no-results">
                {searchPerformed ? (
                    <p>No cards found. Try searching for something else.</p>
                ) : (
                    <p>Did you know you can search for multiple pokemon at once? Try searching for 'Pikachu, Blastoise'</p>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="image-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                {filteredImages.map((image, index) => {
                    const isLastElement = index === filteredImages.length - 1;
                    const isLoaded = loadedImages.has(image.imageKey);
                    return (
                        <div
                            key={image.imageKey}
                            ref={isLastElement ? lastImageElementRef : null}
                            className={`image-card ${isLoaded ? 'loaded' : ''}`}
                        >
                            <LazyImage
                                src={`${R2_BUCKET_URL}/${image.imageKey}`}
                                alt={image.cardTitle}
                                className="grid-image"
                                onClick={() => openModal(image)}
                                onImageLoad={() => handleImageLoad(image.imageKey)}
                            />
                            <div className={`badge-container ${isLoaded ? 'loaded' : ''}`}>
                                {image.tags.includes('1st-edition') && (
                                    <div className="first-edition-badge">1st</div>
                                )}
                                {image.isReverseHolo === 1 && (
                                    <div className="reverse-holo-badge">RH</div>
                                )}
                            </div>
                            {showSetNames && (
                                <div className="set-name-overlay">
                                    <span>{capitalizeWords(image.setName)}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {loadingMore && <div className="loading-spinner"></div>}
        </>
    );
});

export default ImageGrid;
