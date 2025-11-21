import './App.css'
import React, { useState } from 'react';
import { Search, Settings, ArrowDownUp } from 'lucide-react';

const R2_BUCKET_URL = "https://r2bucketgoeshere.com"
const API_ENDPOINT = "https://downloader.something.something.dev/"

function App() {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [gridCols, setGridCols] = useState(5);

    // State for filters
    const [isCameo, setIsCameo] = useState(false);
    const [isTrainer, setIsTrainer] = useState(false);
    const [isIllustrator, setIsIllustrator] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setImages([]);

        const params = new URLSearchParams({
            query: query,
            cameo: String(isCameo),
            trainer: String(isTrainer),
            illustrator: String(isIllustrator),
            sort: sortOrder,
        });

        try {
            // MOCK LOGIC
            console.log("Searching with params:", params.toString());
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

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const toggleGridCols = () => {
        setGridCols(prev => {
            if (prev === 3) return 5;
            if (prev === 5) return 7;
            return 3; // Cycle from 7 back to 3
        });
    };

    return (
        <>
            <div className="app-wrapper">
                <div className="main-container">

                    <div className="header-container">
                        <div className="title">NottAnotherMasterSetTracker</div>
                        <div className="titleSubtext">Find all the cards you need!</div>
                    </div>

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
                    </div>

                    {/* Filters appear only after a search has returned results */}
                    {images.length > 0 && (
                        <div className="filters-container">
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={isCameo} onChange={(e) => setIsCameo(e.target.checked)} />
                                    Cameo
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={isTrainer} onChange={(e) => setIsTrainer(e.target.checked)} />
                                    Trainer
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={isIllustrator} onChange={(e) => setIsIllustrator(e.target.checked)} />
                                    Illustrator
                                </label>
                            </div>
                            <div className="filter-buttons-group">
                                <button onClick={toggleSortOrder} className="sort-button">
                                    <ArrowDownUp size={16} />
                                    {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                                </button>
                                <button onClick={toggleGridCols} className="grid-toggle-button">
                                    <Settings size={16} />
                                    {gridCols} Columns
                                </button>
                            </div>
                        </div>
                    )}

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