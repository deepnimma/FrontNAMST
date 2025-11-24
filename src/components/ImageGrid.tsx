import React from 'react';
import type { CardImage } from '../lib/types';
import { R2_BUCKET_URL } from '../lib/constants';
import { capitalizeWords } from '../lib/utils';
import LazyImage from './LazyImage'; // Import the LazyImage component

interface ImageGridProps {
    loading: boolean;
    images: CardImage[];
    gridCols: number;
    openModal: (image: CardImage) => void;
    showSetNames: boolean;
    query: string;
    showReverseHolos: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({
    loading,
    images,
    gridCols,
    openModal,
    showSetNames,
    query,
    showReverseHolos,
}) => {
    const filteredImages = showReverseHolos ? images : images.filter(image => image.isReverseHolo !== 1);

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (images.length === 0 && query && !loading) {
        return (
            <div className="no-results">
                <p>No cards found. Try searching for something else.</p>
            </div>
        );
    }

    return (
        <div className="image-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
            {filteredImages.map((image) => (
                <div key={image.imageKey} className="image-card">
                    <LazyImage
                        src={`${R2_BUCKET_URL}/${image.imageKey}`}
                        alt={image.cardTitle}
                        className="grid-image"
                        onClick={() => openModal(image)}
                    />
                    {showSetNames && (
                        <div className="set-name-overlay">
                            <span>{capitalizeWords(image.setName)}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
