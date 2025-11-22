import React from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
    showScrollButton: boolean;
    scrollToTop: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ showScrollButton, scrollToTop }) => {
    return (
        <button
            className={`scroll-to-top-button ${showScrollButton ? 'visible' : ''}`}
            onClick={scrollToTop}
        >
            <ArrowUp size={24} />
        </button>
    );
};

export default ScrollToTopButton;
