import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    onClick: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px', // Load images 100px before they enter the viewport
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div className={`lazy-image-container ${isLoaded ? 'loaded' : ''}`} ref={imgRef} onClick={onClick}>
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
