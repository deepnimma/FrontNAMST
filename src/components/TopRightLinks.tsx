import React from 'react';
import { Github, ScrollText } from 'lucide-react';

interface TopRightLinksProps {
    setIsChangelogOpen: (isOpen: boolean) => void;
}

const TopRightLinks: React.FC<TopRightLinksProps> = ({ setIsChangelogOpen }) => {
    return (
        <div className="top-right-links">
            <button onClick={() => setIsChangelogOpen(true)} className="changelog-button" title="Changelog">
                <ScrollText size={24} />
            </button>
            <a href="https://github.com/deepnimma/FrontNAMST" target="_blank" rel="noopener noreferrer" className="github-link-item" title="Frontend Repo">
                <Github size={24} />
                <span>FE</span>
            </a>
            <a href="https://github.com/deepnimma/NottAnotherMasterSetTrackerBackend" target="_blank" rel="noopener noreferrer" className="github-link-item" title="Backend Repo">
                <Github size={24} />
                <span>BE</span>
            </a>
        </div>
    );
};

export default TopRightLinks;
