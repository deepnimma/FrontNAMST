import React from 'react';
import { X } from 'lucide-react';
import type { ChangelogEntry } from '../lib/types';

interface ChangelogProps {
    isChangelogOpen: boolean;
    setIsChangelogOpen: (isOpen: boolean) => void;
    changelogData: ChangelogEntry[];
}

const Changelog: React.FC<ChangelogProps> = ({ isChangelogOpen, setIsChangelogOpen, changelogData }) => {
    if (!isChangelogOpen) return null;

    return (
        <div className="modal-backdrop" onClick={() => setIsChangelogOpen(false)}>
            <div className="changelog-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={() => setIsChangelogOpen(false)}><X size={24} /></button>
                <h2>Changelog</h2>
                <div className="changelog-entries">
                    {changelogData.map(entry => (
                        <div key={entry.version} className="changelog-entry">
                            <div className="changelog-header">
                                <span className="changelog-version">v{entry.version}</span>
                                <span className="changelog-date">{entry.date}</span>
                            </div>
                            <ul className="changelog-changes">
                                {entry.changes.map((change, index) => (
                                    <li key={index}>{change}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Changelog;
