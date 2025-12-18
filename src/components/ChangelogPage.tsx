import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ChangelogData } from '../lib/types';
import '../styles/ChangelogPage.css';

const ChangelogPage: React.FC = () => {
    const [changelogData, setChangelogData] = useState<ChangelogData | null>(null);

    useEffect(() => {
        fetch('/changelog.json')
            .then(response => response.json())
            .then(data => setChangelogData(data));
    }, []);

    return (
        <div className="changelog-page">
            <div className="changelog-container">
                <h1 className="changelog-title">Changelog</h1>
                {changelogData ? (
                    Object.entries(changelogData).map(([version, details]) => (
                        <div key={version} className="version-section">
                            <h2 className="version-title">Version {version}</h2>
                            <p className="release-date">Released on: {details.date}</p>
                            <div className="changes-container">
                                {details.new && details.new.length > 0 && (
                                    <div className="change-category">
                                        <h3 className="category-title new">New Features</h3>
                                        <ul className="changes-list">
                                            {details.new.map((item, index) => (
                                                <li key={index} className="change-item">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {details.improvements && details.improvements.length > 0 && (
                                    <div className="change-category">
                                        <h3 className="category-title improvements">Improvements</h3>
                                        <ul className="changes-list">
                                            {details.improvements.map((item, index) => (
                                                <li key={index} className="change-item">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {details.fixes && details.fixes.length > 0 && (
                                    <div className="change-category">
                                        <h3 className="category-title fixes">Bug Fixes</h3>
                                        <ul className="changes-list">
                                            {details.fixes.map((item, index) => (
                                                <li key={index} className="change-item">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading changelog...</p>
                )}
                <Link to="/" className="back-link">Back to Search</Link>
            </div>
        </div>
    );
};

export default ChangelogPage;
