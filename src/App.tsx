import './App.css'
import React, { useState } from 'react';
import { Search, Settings } from 'lucide-react';

const R2_BUCKET_URL = "https://r2bucketgoeshere.com"
const API_ENDPOINT = "https://downloader.something.something.dev/"

function App() {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [gridCols, setGridCols] = useState(5); // Default columns
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setImages([]);

        try {
            // MOCK LOGIC
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockKeys = Array.from({ length: 15 }).map((_, i) => `mock-image-${i}`);
            setImages(mockKeys);

        } catch (error) {
            console.error("Error fetching images:", error);
            alert("Failed to fetch images. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleColumnChange = (cols: number) => {
        setGridCols(cols);
        setIsDropdownOpen(false);
    };

    return (
        <>
            <div className="app-wrapper">
                <div className="main-container">

                    {/* Header */}
                    <div className="header-container">
                        <div className="title">NottAnotherMasterSetTracker</div>
                        <div className="titleSubtext">Find all the cards you need!</div>
                    </div>

                    {/* Search Bar & Controls */}
                    <div className="search-and-controls-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for cards (e.g., 'Dragon')..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="search-button"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : <><Search size={18} /> Search</>}
                        </button>

                        {/* Grid Columns Dropdown */}
                        {images.length > 0 && (
                            <div className="dropdown">
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="dropdown-button">
                                    <Settings size={16} />
                                    <span>{gridCols}</span>
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => handleColumnChange(3)}>3 Columns</button>
                                        <button onClick={() => handleColumnChange(5)}>5 Columns</button>
                                        <button onClick={() => handleColumnChange(7)}>7 Columns</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Results Grid */}
                    {loading && <div className="loading-spinner"></div>}

                    {!loading && images.length > 0 && (
                        <div
                            className="image-grid"
                            style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
                        >
                            {images.map((key, index) => (
                                <div key={index} className="image-card">
                                    <img
                                        src={`https://placehold.co/400x600/2d2d2d/FFF?text=${key}`}
                                        alt={key}
                                        className="grid-image"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && images.length === 0 && query && (
                        <div className="no-results">
                            <p>No cards found. Try searching for something else.</p>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default App;