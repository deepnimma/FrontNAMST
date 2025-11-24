import './App.css';
import './styles/LazyImage.css';
import React, { useState, useEffect } from 'react';
import type { CardImage } from './lib/types';
import { useCardSearch } from './hooks/useCardSearch';
import { useAppEffects } from './hooks/useAppEffects';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import ImageGrid from './components/ImageGrid';
import Modal from './components/Modal';
import Changelog from './components/Changelog';
import TopRightLinks from './components/TopRightLinks';
import ScrollToTopButton from './components/ScrollToTopButton';
import KofiButton from './components/KofiButton';
import MissingCardLink from './components/MissingCardLink';
import FilterBox from './components/FilterBox';

function App() {
    const [query, setQuery] = useState('');
    const { images, setImages, loading, handleSearch } = useCardSearch();
    const {
        showScrollButton,
        isChangelogOpen,
        setIsChangelogOpen,
        changelogData,
        placeholderIndex, // Get placeholderIndex from useAppEffects
    } = useAppEffects(query);

    const [gridCols, setGridCols] = useState(5); // Default to 5 for desktop
    const [selectedImage, setSelectedImage] = useState<CardImage | null>(null);
    const [showSetNames, setShowSetNames] = useState(false);
    const [showReverseHolos, setShowReverseHolos] = useState(true);
    const [showMissingCardButton, setShowMissingCardButton] = useState(false);
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);

    // State for filters
    const [isCameo, setIsCameo] = useState(false);
    const [isTrainer, setIsTrainer] = useState(false);
    const [isIllustrator, setIsIllustrator] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        setShowMissingCardButton(images.length > 0);
    }, [images]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setGridCols(3); // Default to 3 for mobile
            } else {
                setGridCols(5); // Default to 5 for desktop
            }
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query, isCameo, isTrainer, isIllustrator, sortOrder);
        }
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        const sortedImages = [...images].sort((a, b) => {
            const dateA = new Date(a.releaseDate).getTime();
            const dateB = new Date(b.releaseDate).getTime();
            if (dateA !== dateB) return newSortOrder === 'asc' ? dateA - dateB : dateB - a.releaseDate.getTime();
            const cardNumA = parseInt(a.cardNumber.split('/')[0]);
            const cardNumB = parseInt(b.cardNumber.split('/')[0]);
            return newSortOrder === 'asc' ? cardNumA - cardNumB : cardNumB - cardNumA;
        });
        setImages(sortedImages);
    };

    const openModal = (image: CardImage) => setSelectedImage(image);
    const closeModal = () => setSelectedImage(null);

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
            <TopRightLinks setIsChangelogOpen={setIsChangelogOpen} />

            <div className={`app-wrapper ${query.length === 0 ? 'initial-state' : ''}`}>
                <div className="main-container">
                    <Header handleReset={handleReset} placeholderIndex={placeholderIndex} />

                    <div className="sticky-container">
                        <SearchBar
                            query={query}
                            setQuery={setQuery}
                            handleSearch={() => handleSearch(query, isCameo, isTrainer, isIllustrator, sortOrder)}
                            loading={loading}
                            handleKeyDown={handleKeyDown}
                            handleFocus={handleFocus}
                            placeholderIndex={placeholderIndex}
                        />

                        <Filters
                            isCameo={isCameo}
                            isTrainer={isTrainer}
                            isIllustrator={isIllustrator}
                            handleCameoChange={handleCameoChange}
                            handleTrainerChange={handleTrainerChange}
                            handleIllustratorChange={handleIllustratorChange}
                            toggleSortOrder={toggleSortOrder}
                            sortOrder={sortOrder}
                            query={query}
                        />
                    </div>

                    <div className={`content-with-filters ${images.length > 0 ? 'filters-visible' : ''}`}>
                        <ImageGrid
                            loading={loading}
                            images={images}
                            gridCols={gridCols}
                            openModal={openModal}
                            showSetNames={showSetNames}
                            query={query}
                            showReverseHolos={showReverseHolos}
                        />
                        {images.length > 0 && (
                            <>
                                <button
                                    className="mobile-filter-toggle"
                                    onClick={() => setIsFilterBoxOpen(!isFilterBoxOpen)}
                                >
                                    {isFilterBoxOpen ? 'Hide Filters' : 'Show Filters'}
                                </button>
                                <div className={`filter-box-wrapper ${isFilterBoxOpen ? 'open' : ''}`}>
                                    <FilterBox
                                        showSetNames={showSetNames}
                                        setShowSetNames={setShowSetNames}
                                        showReverseHolos={showReverseHolos}
                                        setShowReverseHolos={setShowReverseHolos}
                                        gridCols={gridCols}
                                        setGridCols={setGridCols}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal selectedImage={selectedImage} closeModal={closeModal} />
            <Changelog
                isChangelogOpen={isChangelogOpen}
                setIsChangelogOpen={setIsChangelogOpen}
                changelogData={changelogData}
            />
            <KofiButton showScrollButton={showScrollButton} showMissingCardButton={showMissingCardButton} />
            <MissingCardLink show={showMissingCardButton} showScrollButton={showScrollButton} />
            <ScrollToTopButton show={showScrollButton} scrollToTop={scrollToTop} />
        </>
    );
}

export default App;
