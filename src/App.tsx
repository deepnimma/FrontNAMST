import './App.css'
import React, { useState, useEffect } from 'react';
import { Search, Settings, ArrowDownUp, X, Github } from 'lucide-react';

// --- Interfaces ---
interface CardImage {
    key: string;
    setName: string;
    cardNumber: string;
    illustrator: string;
    releaseDate: string;
    description: string;
}

const R2_BUCKET_URL = "https://r2bucketgoeshere.com"
const API_ENDPOINT = "https://downloader.something.something.dev/"

const placeholderWords = ["Pokemon", "Trainer", "Illustrator"];

function App() {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState<CardImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [gridCols, setGridCols] = useState(5);
    const [selectedImage, setSelectedImage] = useState<CardImage | null>(null);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    // State for filters
    const [isCameo, setIsCameo] = useState(false);
    const [isTrainer, setIsTrainer] = useState(false);
    const [isIllustrator, setIsIllustrator] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Effect for cycling placeholder text
    useEffect(() => {
        if (query.length > 0) return;

        const intervalId = setInterval(() => {
            setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholderWords.length);
        }, 2000); // Change every 2 seconds

        return () => clearInterval(intervalId);
    }, [query]);

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
            const mockImages: CardImage[] = Array.from({ length: 15 }).map((_, i) => ({
                key: `mock-image-${i}`,
                setName: `Awesome Set ${i % 3 + 1}`,
                cardNumber: `${i + 1}/100`,
                illustrator: `Artist #${i % 5 + 1}`,
                releaseDate: `2023-10-2${i}`,
                description: i % 4 === 0 ? `This is a special card with a very long description to see how the text wraps and fits into the container.` : '',
            }));
            setImages(mockImages);

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

    const handleReset = () => {
        setQuery('');
        setImages([]);
        setIsCameo(false);
        setIsTrainer(false);
        setIsIllustrator(false);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const toggleGridCols = () => {
        setGridCols(prev => {
            if (prev === 3) return 5;
            if (prev === 5) return 7;
            return 3;
        });
    };

    const openModal = (image: CardImage) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    // --- Checkbox Logic ---
    const handleCameoChange = (checked: boolean) => {
        setIsCameo(checked);
        if (checked) setIsIllustrator(false);
    };

    const handleTrainerChange = (checked: boolean) => {
        setIsTrainer(checked);
        if (checked) setIsIllustrator(false);
    };

    const handleIllustratorChange = (checked: boolean) => {
        setIsIllustrator(checked);
        if (checked) {
            setIsCameo(false);
            setIsTrainer(false);
        }
    };

    return (
        <>
            <div className="github-links">
                <a href="https://github.com/deepnimma/FrontNAMST" target="_blank" rel="noopener noreferrer" title="Frontend Repo">
                    <Github size={24} />
                </a>
                <a href="https://github.com/deepnimma/NottAnotherMasterSetTrackerBackend" target="_blank" rel="noopener noreferrer" title="Backend Repo">
                    <Github size={24} />
                </a>
            </div>

            <div className={`app-wrapper ${query.length === 0 ? 'initial-state' : ''}`}>
                <div className="main-container">

                    <div className="header-container">
                        <button className="title-button" onClick={handleReset}>
                            <h1 className="title">
                                <span className="title-desktop">NottAnotherMasterSetTracker</span>
                                <span className="title-mobile">NottDex</span>
                            </h1>
                        </button>
                        <div className="titleSubtext">Find all the cards you need!</div>
                    </div>

                    <div className="search-and-controls-container">
                        <div className="search-input-container">
                            <input
                                type="text"
                                className="search-input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            {query.length === 0 && (
                                <div className="custom-placeholder">
                                    <span>Search for your favorite </span>
                                    <span className="placeholder-word" key={placeholderIndex}>
                                        {placeholderWords[placeholderIndex]}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            className="search-button"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : <><Search size={18} /> Search</>}
                        </button>
                    </div>

                    {query.length > 0 && (
                        <div className="filters-container">
                            <div className="checkbox-group">
                                <label
                                    className={`checkbox-label ${isIllustrator ? 'disabled' : ''}`}
                                    title="Enable this if you also want cameo appearances of the particular pokemon/trainer you are searching for to be displayed."
                                >
                                    <input type="checkbox" checked={isCameo} onChange={(e) => handleCameoChange(e.target.checked)} disabled={isIllustrator} />
                                    Cameo
                                </label>
                                <label
                                    className={`checkbox-label ${isIllustrator ? 'disabled' : ''}`}
                                    title="Enable this if you are trying to search for a particular Pokemon series trainer."
                                >
                                    <input type="checkbox" checked={isTrainer} onChange={(e) => handleTrainerChange(e.target.checked)} disabled={isIllustrator} />
                                    Trainer
                                </label>
                                <label
                                    className={`checkbox-label ${isCameo || isTrainer ? 'disabled' : ''}`}
                                    title="Enable this if you are trying to search for all cards from a particular illustrator."
                                >
                                    <input type="checkbox" checked={isIllustrator} onChange={(e) => handleIllustratorChange(e.target.checked)} disabled={isCameo || isTrainer} />
                                    Illustrator
                                </label>
                            </div>
                            <div className="filter-buttons-group">
                                <button onClick={toggleSortOrder} className="sort-button">
                                    <ArrowDownUp size={16} />
                                    {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                                </button>
                                {images.length > 0 && (
                                    <button onClick={toggleGridCols} className="grid-toggle-button">
                                        <Settings size={16} />
                                        {gridCols} Columns
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {loading && <div className="loading-spinner"></div>}

                    {!loading && images.length > 0 && (
                        <div
                            className="image-grid"
                            style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
                        >
                            {images.map((image) => (
                                <div key={image.key} className="image-card" onClick={() => openModal(image)}>
                                    <img
                                        src={`https://placehold.co/400x600/2d2d2d/FFF?text=${image.key}`}
                                        alt={image.key}
                                        className="grid-image"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && images.length === 0 && query && !loading && (
                        <div className="no-results">
                            <p>No cards found. Try searching for something else.</p>
                        </div>
                    )}

                </div>
            </div>

            {selectedImage && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-button" onClick={closeModal}><X size={24} /></button>
                        <img
                            src={`https://placehold.co/600x840/2d2d2d/FFF?text=${selectedImage.key}`}
                            alt={selectedImage.key}
                            className="modal-image"
                        />
                        <div className="modal-metadata">
                            <h2>{selectedImage.setName}</h2>
                            <p><strong>Card Number:</strong> {selectedImage.cardNumber}</p>
                            <p><strong>Illustrator:</strong> {selectedImage.illustrator}</p>
                            <p><strong>Release Date:</strong> {selectedImage.releaseDate}</p>
                            {selectedImage.description && (
                                <div className="metadata-description">
                                    <h3>Description</h3>
                                    <p>{selectedImage.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;