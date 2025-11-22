import React from 'react';
import kofiImage from '../assets/support_me_on_kofi_beige.png';
import kofiSymbol from '../assets/kofi_symbol.svg';
import '../styles/KofiButton.css';

interface KofiButtonProps {
    showScrollButton: boolean;
    showMissingCardButton: boolean;
}

const KofiButton: React.FC<KofiButtonProps> = ({ showScrollButton, showMissingCardButton }) => {
    return (
        <a
            href="https://ko-fi.com/nottcurious"
            target="_blank"
            rel="noopener noreferrer"
            className={`kofi-button ${showScrollButton ? 'scroll-visible' : ''} ${showMissingCardButton ? 'missing-card-visible' : ''}`}
        >
            <img src={kofiImage} alt="Support me on Ko-fi" className="kofi-full-image" />
            <img src={kofiSymbol} alt="Ko-fi" className="kofi-symbol-image" />
        </a>
    );
};

export default KofiButton;
