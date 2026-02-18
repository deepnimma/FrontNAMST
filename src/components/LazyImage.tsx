import React, { useState, useEffect, useRef } from 'react';

// Single shared IntersectionObserver for all LazyImage instances
const visibilityCallbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function observeElement(el: Element, onVisible: () => void) {
    if (!sharedObserver) {
        sharedObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const cb = visibilityCallbacks.get(entry.target);
                        if (cb) {
                            cb();
                            sharedObserver!.unobserve(entry.target);
                            visibilityCallbacks.delete(entry.target);
                        }
                    }
                });
            },
            { rootMargin: '600px' }
        );
    }
    visibilityCallbacks.set(el, onVisible);
    sharedObserver.observe(el);
}

function unobserveElement(el: Element) {
    sharedObserver?.unobserve(el);
    visibilityCallbacks.delete(el);
}

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    onClick: () => void;
    style?: React.CSSProperties;
    onImageLoad?: () => void;
    isPriority?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
    src, alt, className, onClick, style, onImageLoad, isPriority = false,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(isPriority);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isPriority || !containerRef.current) return;
        const el = containerRef.current;
        observeElement(el, () => setIsInView(true));
        return () => unobserveElement(el);
    }, [isPriority]);

    const handleImageLoad = () => {
        setIsLoaded(true);
        onImageLoad?.();
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
                    decoding="async"
                    loading={isPriority ? 'eager' : 'lazy'}
                    fetchPriority={isPriority ? 'high' : 'auto'}
                />
            )}
        </div>
    );
};

export default LazyImage;
