import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { ChangelogEntry } from '../lib/types';
import '../styles/ChangelogPage.css';

const getVersionType = (version: string): 'major' | 'minor' | 'patch' => {
    const parts = version.split('.').map(Number);
    if (parts[2] > 0) return 'patch';
    if (parts[1] > 0) return 'minor';
    return 'major';
};

const ChangelogPage: React.FC = () => {
    const [changelogData, setChangelogData] = useState<ChangelogEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeVersion, setActiveVersion] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const versionRefs = useRef<Record<string, HTMLDivElement>>({});

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
                if (data.length > 0) {
                    setActiveVersion(data[0].version);
                }
            })
            .catch(err => {
                console.error("Error fetching changelog:", err);
                setError("Could not load the changelog. Please try again later.");
            });
    }, []);

    useEffect(() => {
        const topMargin = -80;
        observer.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveVersion(entry.target.id);
                    }
                });
            },
            { rootMargin: `${topMargin}px 0px -50% 0px`, threshold: 0 }
        );

        Object.values(versionRefs.current).forEach((ref) => {
            if (ref) {
                observer.current?.observe(ref);
            }
        });

        return () => {
            observer.current?.disconnect();
        };
    }, [changelogData]);

    const handleJumpToVersion = (version: string) => {
        versionRefs.current[version]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div className="changelog-page-wrapper">
            <header className="changelog-header">
                <Link to="/" className="home-link-button">
                    NottAnotherMasterSetTracker
                </Link>
            </header>
            <div className="changelog-page">
                <div className="changelog-container">
                    <h1 className="changelog-title">Changelog</h1>
                    {error && <p className="error-message">{error}</p>}
                    {changelogData.length > 0 ? (
                        changelogData.map(entry => {
                            const versionType = getVersionType(entry.version);
                            const categorizedChanges = {
                                new: entry.changes.filter(c => c.category === 'new'),
                                improvements: entry.changes.filter(c => c.category === 'improvements'),
                                fixes: entry.changes.filter(c => c.category === 'fixes'),
                                cards: entry.changes.filter(c => c.category === 'cards'),
                            };

                            return (
                                <div
                                    key={entry.version}
                                    id={entry.version}
                                    ref={el => {
                                        if (el) versionRefs.current[entry.version] = el;
                                    }}
                                    className={`version-section ${versionType}`}
                                >
                                    <div className="version-header">
                                        <h2 className="version-title">Version {entry.version}</h2>
                                        {entry.title && <p className="version-subtitle">{entry.title}</p>}
                                    </div>
                                    <p className="release-date">Released on: {entry.date}</p>
                                    <div className="changes-container">
                                        {categorizedChanges.new.length > 0 && (
                                            <div className="change-category new">
                                                <h3 className="category-title">New Features</h3>
                                                <ul className="changes-list">
                                                    {categorizedChanges.new.map((item, index) => (
                                                        <li key={index} className="change-item">{item.description}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {categorizedChanges.improvements.length > 0 && (
                                            <div className="change-category improvements">
                                                <h3 className="category-title">Improvements</h3>
                                                <ul className="changes-list">
                                                    {categorizedChanges.improvements.map((item, index) => (
                                                        <li key={index} className="change-item">{item.description}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {categorizedChanges.fixes.length > 0 && (
                                            <div className="change-category fixes">
                                                <h3 className="category-title">Bug Fixes</h3>
                                                <ul className="changes-list">
                                                    {categorizedChanges.fixes.map((item, index) => (
                                                        <li key={index} className="change-item">{item.description}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {categorizedChanges.cards.length > 0 && (
                                            <div className="change-category cards">
                                                <h3 className="category-title">Card Updates</h3>
                                                <ul className="changes-list">
                                                    {categorizedChanges.cards.map((item, index) => (
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
            <nav className="version-tree">
                <h3 className="tree-title">Versions</h3>
                <ul>
                    {changelogData.map(entry => (
                        <li
                            key={entry.version}
                            className={activeVersion === entry.version ? 'active' : ''}
                        >
                            <button onClick={() => handleJumpToVersion(entry.version)}>
                                {entry.version}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default ChangelogPage;
