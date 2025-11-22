import React from 'react';
import kofiImage from '../assets/support_me_on_kofi_beige.png';
import '../styles/KofiButton.css';

interface KofiButtonProps {
    showScrollButton: boolean;
}

const KofiButton: React.FC<KofiButtonProps> = ({ showScrollButton }) => {
    return (
        <a
            href="https://ko-fi.com/nottcurious"
            target="_blank"
            rel="noopener noreferrer"
            className={`kofi-button ${showScrollButton ? 'scroll-visible' : 'scroll-hidden'}`}
        >
            <img src={kofiImage} alt="Support me on Ko-fi" />
        </a>
    );
};

export default KofiButton;
