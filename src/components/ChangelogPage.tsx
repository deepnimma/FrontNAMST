import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ChangelogEntry } from '../lib/types';
import '../styles/ChangelogPage.css';

const ChangelogPage: React.FC = () => {
    const [changelogData, setChangelogData] = useState<ChangelogEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/changelog.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load changelog data.');
                }
                return response.json();
            })
            .then(data => {
                setChangelogData(data);
            })
            .catch(err => {
                console.error("Error fetching changelog:", err);
                setError("Could not load the changelog. Please try again later.");
            });
    }, []);

    return (
        <div className="changelog-page">
            <header className="changelog-header">
                <Link to="/" className="home-link-button">
                    NottAnotherMasterSetTracker
                </Link>
            </header>
            <div className="changelog-container">
                <h1 className="changelog-title">Changelog</h1>
                {error && <p className="error-message">{error}</p>}
                {changelogData.length > 0 ? (
                    changelogData.map(entry => {
                        const categorizedChanges = {
                            new: entry.changes.filter(c => c.category === 'new'),
                            improvements: entry.changes.filter(c => c.category === 'improvements'),
                            fixes: entry.changes.filter(c => c.category === 'fixes'),
                        };

                        return (
                            <div key={entry.version} className="version-section">
                                <h2 className="version-title">Version {entry.version}</h2>
                                <p className="release-date">Released on: {entry.date}</p>
                                <div className="changes-container">
                                    {categorizedChanges.new.length > 0 && (
                                        <div className="change-category">
                                            <h3 className="category-title new">New Features</h3>
                                            <ul className="changes-list">
                                                {categorizedChanges.new.map((item, index) => (
                                                    <li key={index} className="change-item">{item.description}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {categorizedChanges.improvements.length > 0 && (
                                        <div className="change-category">
                                            <h3 className="category-title improvements">Improvements</h3>
                                            <ul className="changes-list">
                                                {categorizedChanges.improvements.map((item, index) => (
                                                    <li key={index} className="change-item">{item.description}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {categorizedChanges.fixes.length > 0 && (
                                        <div className="change-category">
                                            <h3 className="category-title fixes">Bug Fixes</h3>
                                            <ul className="changes-list">
                                                {categorizedChanges.fixes.map((item, index) => (
                                                    <li key={index} className="change-item">{item.description}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !error && <p>Loading changelog...</p>
                )}
            </div>
        </div>
    );
};

export default ChangelogPage;
