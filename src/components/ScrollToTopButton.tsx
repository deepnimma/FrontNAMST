import React from 'react';
import { ArrowUp } from 'lucide-react';
import '../styles/ScrollToTopButton.css';

interface ScrollToTopButtonProps {
    show: boolean;
    scrollToTop: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ show, scrollToTop }) => {
    return (
        <button
            className={`scroll-to-top-button ${show ? 'visible' : ''}`}
            onClick={scrollToTop}
        >
            <ArrowUp size={24} />
        </button>
    );
};

export default ScrollToTopButton;
