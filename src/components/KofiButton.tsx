import React from 'react';
import kofiImage from '../assets/support_me_on_kofi_beige.png';
import '../styles/KofiButton.css';

const KofiButton: React.FC = () => {
    return (
        <a
            href="https://ko-fi.com/nottcurious"
            target="_blank"
            rel="noopener noreferrer"
            className="kofi-button"
        >
            <img src={kofiImage} alt="Support me on Ko-fi" />
        </a>
    );
};

export default KofiButton;
