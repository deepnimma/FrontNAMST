import React from 'react';
import '../styles/MissingCardLink.css';

interface MissingCardLinkProps {
    show: boolean;
    showScrollButton: boolean;
}

const MissingCardLink: React.FC<MissingCardLinkProps> = ({ show, showScrollButton }) => {
    return (
        <a
            href="https://github.com/deepnimma/FrontNAMST/issues/new?template=missing_image.md"
            target="_blank"
            rel="noopener noreferrer"
            className={`missing-card-button ${show ? 'visible' : ''} ${showScrollButton ? 'scroll-visible' : ''}`}
        >
            <span>Missing Card?</span>
        </a>
    );
};

export default MissingCardLink;
