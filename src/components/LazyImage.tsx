import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    onClick: () => void;
    style?: React.CSSProperties;
    onImageLoad?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, onClick, style, onImageLoad }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px',
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    const handleImageLoad = () => {
        setIsLoaded(true);
        if (onImageLoad) {
            onImageLoad();
        }
    };

    return (
        <div
            className={`lazy-image-container ${isLoaded ? 'loaded' : ''}`}
            ref={containerRef}
            onClick={onClick}
            style={style}
        >
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={className}
                    onLoad={handleImageLoad}
                />
            )}
        </div>
    );
};

export default LazyImage;
