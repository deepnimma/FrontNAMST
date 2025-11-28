import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    onClick: () => void;
    style?: React.CSSProperties;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, onClick, style }) => {
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
                rootMargin: '200px', // Start loading images 200px before they enter the viewport
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

    useEffect(() => {
        if (isInView) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setIsLoaded(true);
            };
        }
    }, [isInView, src]);

    return (
        <div
            className={`lazy-image-container ${isLoaded ? 'loaded' : ''}`}
            ref={containerRef}
            onClick={onClick}
            style={style}
        >
            {isLoaded && (
                <img
                    src={src}
                    alt={alt}
                    className={className}
                />
            )}
        </div>
    );
};

export default LazyImage;
