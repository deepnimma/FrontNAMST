import React from 'react';
import { FileQuestion } from 'lucide-react';
import '../styles/MissingCardLink.css';

interface MissingCardLinkProps {
    show: boolean;
}

const MissingCardLink: React.FC<MissingCardLinkProps> = ({ show }) => {
    return (
        <a
            href="https://github.com/deepnimma/FrontNAMST/issues/new?template=missing_image.md"
            target="_blank"
            rel="noopener noreferrer"
            className={`missing-card-button ${show ? 'visible' : ''}`}
        >
            <FileQuestion size={18} />
            <span>Missing Card?</span>
        </a>
    );
};

export default MissingCardLink;
