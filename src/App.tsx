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
    const [lastExecutedQuery, setLastExecutedQuery] = useState('');
    const { images, setImages, loading, loadingMore, hasMore, handleSearch, loadMore } = useCardSearch();
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
    const [hideFirstEditions, setHideFirstEditions] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [showEnergyCards, setShowEnergyCards] = useState(false);
    const [showItemCards, setShowItemCards] = useState(true);
    const [showTrainerOwned, setShowTrainerOwned] = useState(true);

    // State for filters
    const [isCameo, setIsCameo] = useState(false);
    const [isTrainer, setIsTrainer] = useState(false);
    const [isIllustrator, setIsIllustrator] = useState(false);
    const [isSet, setIsSet] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

    const performSearch = () => {
        setSearchPerformed(true);
        const newSortOrder = 'asc';
        setSortOrder(newSortOrder);
        setLastExecutedQuery(query);
        handleSearch(query, isCameo, isTrainer, isIllustrator, newSortOrder, isSet);
    };


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleSearchClick = () => {
        performSearch();
    };

    const handleReset = () => {
        setQuery('');
        setLastExecutedQuery('');
        setImages([]);
        setIsCameo(false);
        setIsTrainer(false);
        setIsIllustrator(false);
        setIsSet(false);
        setSearchPerformed(false);
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
        if (searchPerformed) {
            handleSearch(query, isCameo, isTrainer, isIllustrator, newSortOrder, isSet);
        } else {
            const sortedImages = [...images].sort((a, b) => {
                const dateA = new Date(a.releaseDate).getTime();
                const dateB = new Date(b.releaseDate).getTime();
                if (dateA !== dateB) return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;

                const cardNumA = a.cardNumber.split('/')[0];
                const cardNumB = b.cardNumber.split('/')[0];

                const numA = parseInt(cardNumA, 10);
                const numB = parseInt(cardNumB, 10);

                if (!isNaN(numA) && !isNaN(numB)) {
                    return newSortOrder === 'asc' ? numA - numB : numB - numA;
                }

                return newSortOrder === 'asc' ? cardNumA.localeCompare(cardNumB) : cardNumB.localeCompare(cardNumA);
            });
            setImages(sortedImages);
        }
    };

    const openModal = (image: CardImage) => setSelectedImage(image);
    const closeModal = () => setSelectedImage(null);

    const handleCameoChange = (checked: boolean) => {
        setIsCameo(checked);
        if (checked) {
            setIsIllustrator(false);
            setIsSet(false);
        }
    };

    const handleTrainerChange = (checked: boolean) => {
        setIsTrainer(checked);
        if (checked) {
            setIsIllustrator(false);
            setIsSet(false);
        }
    };

    const handleIllustratorChange = (checked: boolean) => {
        setIsIllustrator(checked);
        if (checked) {
            setIsCameo(false);
            setIsTrainer(false);
            setIsSet(false);
        }
    };

    const handleSetChange = (checked: boolean) => {
        setIsSet(checked);
        if (checked) {
            setIsCameo(false);
            setIsTrainer(false);
            setIsIllustrator(false);
        }
    };

    const filteredImages = images.filter(image => {
        if (hideFirstEditions && image.tags.includes('1st-edition')) {
            return false;
        }
        if (!showEnergyCards && image.tags.includes('energy')) {
            return false;
        }
        if (!showItemCards && image.item === 1) {
            return false;
        }
        if (!showTrainerOwned && image.trainerOwned === 1) {
            return false;
        }
        return true;
    });

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
                            handleSearch={handleSearchClick}
                            loading={loading}
                            handleKeyDown={handleKeyDown}
                            handleFocus={handleFocus}
                            placeholderIndex={placeholderIndex}
                        />

                        <Filters
                            isCameo={isCameo}
                            isTrainer={isTrainer}
                            isIllustrator={isIllustrator}
                            isSet={isSet}
                            handleCameoChange={handleCameoChange}
                            handleTrainerChange={handleTrainerChange}
                            handleIllustratorChange={handleIllustratorChange}
                            handleSetChange={handleSetChange}
                            toggleSortOrder={toggleSortOrder}
                            sortOrder={sortOrder}
                            query={query}
                        />
                    </div>

                    <div className={`content-with-filters ${images.length > 0 ? 'filters-visible' : ''}`}>
                        <ImageGrid
                            loading={loading}
                            images={filteredImages}
                            gridCols={gridCols}
                            openModal={openModal}
                            showSetNames={showSetNames}
                            query={lastExecutedQuery}
                            showReverseHolos={showReverseHolos}
                            searchPerformed={searchPerformed}
                            loadMore={loadMore}
                            hasMore={hasMore}
                            loadingMore={loadingMore}
                            sortOrder={sortOrder}
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
                                        hideFirstEditions={hideFirstEditions}
                                        setHideFirstEditions={setHideFirstEditions}
                                        showEnergyCards={showEnergyCards}
                                        setShowEnergyCards={setShowEnergyCards}
                                        showItemCards={showItemCards}
                                        setShowItemCards={setShowItemCards}
                                        showTrainerOwned={showTrainerOwned}
                                        setShowTrainerOwned={setShowTrainerOwned}
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
