import './App.css'
import React, { useState, useEffect } from 'react';
import { Search, Settings, ArrowDownUp, X, Github } from 'lucide-react';

// --- Interfaces ---
interface CardImage {
    imageKey: string;
    setName: string;
    cardNumber: string;
    illustrator: string;
    releaseDate: string;
    cardTitle: string;
    tags: string; // Tags are a string representation of a list
}

const API_ENDPOINT = "https://downloader.deepnimma.workers.dev/";
const R2_BUCKET_URL = "https://images.nottdex.com";
const placeholderWords = ["Pokemon", "Trainer", "Illustrator"];

// Helper to capitalize words
const capitalizeWords = (str: string) => {
    if (!str) return '';
    return str.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Helper to parse the tags string
const parseTags = (tagsString: string): string[] => {
    try {
        // Replace single quotes with double quotes for valid JSON
        const validJsonString = tagsString.replace(/'/g, '"');
        const tags = JSON.parse(validJsonString);
        if (Array.isArray(tags)) {
            return tags;
        }
    } catch (error) {
        console.error("Error parsing tags:", error);
    }
    return [];
};


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

        const processedQuery = query
            .split(',')
            .map(part => part.trim().toLowerCase().replace(/\s+/g, '-'))
            .join(',');

        const params = new URLSearchParams({ q: processedQuery });

        if (isCameo) params.append('cameo', '1');
        if (isTrainer) params.append('trainer', '1');
        if (isIllustrator) params.append('illustrator', '1');
        if (sortOrder === 'desc') params.append('descending', '1');

        try {
            const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            setImages(data.image_rows || []); // Expecting the data under "image_rows"

        } catch (error) {
            console.error("Error fetching images:", error);
            alert("Failed to fetch images. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleReset = () => {
        setQuery('');
        setImages([]);
        setIsCameo(false);
        setIsTrainer(false);
        setIsIllustrator(false);
    };

    const handleFocus = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);

        const sortedImages = [...images].sort((a, b) => {
            const dateA = new Date(a.releaseDate).getTime();
            const dateB = new Date(b.releaseDate).getTime();

            if (dateA !== dateB) {
                return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // If dates are the same, sort by card number
            const cardNumA = parseInt(a.cardNumber.split('/')[0]);
            const cardNumB = parseInt(b.cardNumber.split('/')[0]);
            return newSortOrder === 'asc' ? cardNumA - cardNumB : cardNumB - cardNumA;
        });

        setImages(sortedImages);
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

    const renderTags = () => {
        if (!selectedImage || !selectedImage.tags) return null;

        const tags = parseTags(selectedImage.tags);

        if (tags.length === 0) return null;

        return (
            <div className="tags-container">
                <h3>Tags</h3>
                <p className="tags-text">
                    {tags.map(tag => capitalizeWords(tag)).join(', ')}
                </p>
            </div>
        );
    };

    return (
        <>
            <div className="github-links">
                <a href="https://github.com/deepnimma/FrontNAMST" target="_blank" rel="noopener noreferrer" className="github-link-item" title="Frontend Repo">
                    <Github size={24} />
                    <span>FE</span>
                </a>
                <a href="https://github.com/deepnimma/NottAnotherMasterSetTrackerBackend" target="_blank" rel="noopener noreferrer" className="github-link-item" title="Backend Repo">
                    <Github size={24} />
                    <span>BE</span>
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

                    <div className="sticky-container">
                        <div className="search-and-controls-container">
                            <div className="search-input-container">
                                <input
                                    type="text"
                                    className="search-input"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={handleFocus}
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

                        <div className={`filters-container ${query.length > 0 ? 'visible' : ''}`}>
                            <div className="checkbox-group">
                                <label className={`checkbox-label ${isIllustrator ? 'disabled' : ''}`} title="Enable this if you also want cameo appearances of the particular pokemon/trainer you are searching for to be displayed.">
                                    <input type="checkbox" checked={isCameo} onChange={(e) => handleCameoChange(e.target.checked)} disabled={isIllustrator} />
                                    Cameo
                                </label>
                                <label className={`checkbox-label ${isIllustrator ? 'disabled' : ''}`} title="Enable this if you are trying to search for a particular Pokemon series trainer.">
                                    <input type="checkbox" checked={isTrainer} onChange={(e) => handleTrainerChange(e.target.checked)} disabled={isIllustrator} />
                                    Trainer
                                </label>
                                <label className={`checkbox-label ${isCameo || isTrainer ? 'disabled' : ''}`} title="Enable this if you are trying to search for all cards from a particular illustrator.">
                                    <input type="checkbox" checked={isIllustrator} onChange={(e) => handleIllustratorChange(e.target.checked)} disabled={isCameo || isTrainer} />
                                    Illustrator
                                </label>
                            </div>
                            <div className="filter-buttons-group">
                                <button onClick={toggleSortOrder} className="sort-button">
                                    <ArrowDownUp size={16} />
                                    {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                                </button>
                                {images.length > 0 && (
                                    <button onClick={toggleGridCols} className="grid-toggle-button">
                                        <Settings size={16} />
                                        {gridCols} Columns
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading && <div className="loading-spinner"></div>}

                    {!loading && images.length > 0 && (
                        <div className="image-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                            {images.map((image) => (
                                <div key={image.imageKey} className="image-card" onClick={() => openModal(image)}>
                                    <img
                                        src={`${R2_BUCKET_URL}/${image.imageKey}`}
                                        alt={image.cardTitle}
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
                            src={`${R2_BUCKET_URL}/${selectedImage.imageKey}`}
                            alt={selectedImage.cardTitle}
                            className="modal-image"
                        />
                        <div className="modal-metadata">
                            <h2>{capitalizeWords(selectedImage.cardTitle)}</h2>
                            <p><strong>Set Name:</strong> {capitalizeWords(selectedImage.setName)}</p>
                            <p><strong>Card Number:</strong> {selectedImage.cardNumber}</p>
                            <p><strong>Illustrator:</strong> {capitalizeWords(selectedImage.illustrator)}</p>
                            <p><strong>Release Date:</strong> {selectedImage.releaseDate}</p>
                            {renderTags()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;