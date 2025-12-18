import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ScrollText } from 'lucide-react';

const TopRightLinks: React.FC = () => {
    return (
        <div className="top-right-links">
            <Link to="/changelog" className="changelog-button" title="Changelog">
                <ScrollText size={24} />
            </Link>
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
