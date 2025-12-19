import './App.css';
import './styles/LazyImage.css';
import React, { useMemo, useState, useEffect } from 'react';
import type { CardImage } from './lib/types';
import { useCardSearch } from './hooks/useCardSearch';
import { useAppEffects } from './hooks/useAppEffects';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import ImageGrid from './components/ImageGrid';
import Modal from './components/Modal';
import TopRightLinks from './components/TopRightLinks';
import ScrollToTopButton from './components/ScrollToTopButton';
import KofiButton from './components/KofiButton';
import MissingCardLink from './components/MissingCardLink';
import FilterBox from './components/FilterBox';
import { ExternalLink } from 'lucide-react';

function App() {
    const [query, setQuery] = useState('');
    const [lastExecutedQuery, setLastExecutedQuery] = useState('');
    const { images, setImages, loading, loadingMore, hasMore, handleSearch, loadMore, isNewSearch } = useCardSearch();
    const {
        showScrollButton,
        placeholderIndex,
    } = useAppEffects(query);

    const [gridCols, setGridCols] = useState(5);
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
    const [searchId, setSearchId] = useState(0);

    const [isCameo, setIsCameo] = useState(false);
    const [isTrainer, setIsTrainer] = useState(false);
    const [isIllustrator, setIsIllustrator] = useState(false);
    const [isSet, setIsSet] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const queryFromUrl = params.get('query');

        if (queryFromUrl) {
            const isCameoFromUrl = params.get('isCameo') === 'true';
            const isTrainerFromUrl = params.get('isTrainer') === 'true';
            const isIllustratorFromUrl = params.get('isIllustrator') === 'true';
            const isSetFromUrl = params.get('isSet') === 'true';
            const sortOrderFromUrl = params.get('sortOrder');
            const newSortOrder = (sortOrderFromUrl === 'asc' || sortOrderFromUrl === 'desc') ? sortOrderFromUrl : 'asc';

            setQuery(queryFromUrl);
            setIsCameo(isCameoFromUrl);
            setIsTrainer(isTrainerFromUrl);
            setIsIllustrator(isIllustratorFromUrl);
            setIsSet(isSetFromUrl);
            setSortOrder(newSortOrder);

            setSearchId(id => id + 1);
            setSearchPerformed(true);
            setLastExecutedQuery(queryFromUrl);
            handleSearch(queryFromUrl, isCameoFromUrl, isTrainerFromUrl, isIllustratorFromUrl, newSortOrder, isSetFromUrl);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        if (isCameo) params.set('isCameo', 'true');
        if (isTrainer) params.set('isTrainer', 'true');
        if (isIllustrator) params.set('isIllustrator', 'true');
        if (isSet) params.set('isSet', 'true');
        if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);

        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }, [query, isCameo, isTrainer, isIllustrator, isSet, sortOrder]);

    useEffect(() => {
        setShowMissingCardButton(images.length > 0);
    }, [images]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setGridCols(3);
            } else {
                setGridCols(5);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const performSearch = () => {
        setSearchId(id => id + 1);
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
        setSearchId(0);
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
        if (isSet) {
            const sortedImages = [...images].sort((a, b) => {
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
        } else {
            handleSearch(query, isCameo, isTrainer, isIllustrator, newSortOrder, isSet);
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

    const handleTcgPlayerSearch = () => {
        const searchString = query.toLowerCase().replace(/-/g, ' ');
        const tcgplayerLink = `https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=${searchString}&view=grid&productTypeName=Cards`;
        const encodedTcgplayerLink = encodeURIComponent(tcgplayerLink);
        const partnerLink = `https://partner.tcgplayer.com/namst?u=${encodedTcgplayerLink}`;
        window.open(partnerLink, '_blank');
    };

    const filteredImages = useMemo(() => {
        let tempImages = images;

        if (!showReverseHolos) {
            tempImages = tempImages.filter(image => image.isReverseHolo !== 1);
        }
        if (hideFirstEditions) {
            tempImages = tempImages.filter(image => !image.tags.includes('1st-edition'));
        }
        if (!showEnergyCards) {
            tempImages = tempImages.filter(image => !image.tags.includes('energy'));
        }
        if (!showItemCards) {
            tempImages = tempImages.filter(image => image.item !== 1);
        }
        if (!showTrainerOwned) {
            tempImages = tempImages.filter(image => image.trainerOwned !== 1);
        }

        return tempImages;
    }, [images, showReverseHolos, hideFirstEditions, showEnergyCards, showItemCards, showTrainerOwned]);

    const imageGridKey = useMemo(() => {
        return `${searchId}-${sortOrder}-${showReverseHolos}-${hideFirstEditions}-${showEnergyCards}-${showItemCards}-${showTrainerOwned}`;
    }, [searchId, sortOrder, showReverseHolos, hideFirstEditions, showEnergyCards, showItemCards, showTrainerOwned]);


    return (
        <>
            <TopRightLinks />

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
                            key={imageGridKey}
                            loading={loading}
                            images={filteredImages}
                            gridCols={gridCols}
                            openModal={openModal}
                            showSetNames={showSetNames}
                            query={lastExecutedQuery}
                            searchPerformed={searchPerformed}
                            loadMore={loadMore}
                            hasMore={hasMore}
                            loadingMore={loadingMore}
                            isNewSearch={isNewSearch}
                        />
                        {images.length > 0 && (
                            <div className="right-sidebar">
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
                                    {searchPerformed && images.length > 0 && (
                                        <>
                                            <button onClick={handleTcgPlayerSearch} className="tcgplayer-set-button">
                                                View on TCGPlayer
                                                <ExternalLink size={16} />
                                            </button>
                                            <p className="referral-disclaimer">
                                                Clicking this link may result in us receiving a commission.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal selectedImage={selectedImage} closeModal={closeModal} />
            <KofiButton showScrollButton={showScrollButton} showMissingCardButton={showMissingCardButton} />
            <MissingCardLink show={showMissingCardButton} showScrollButton={showScrollButton} />
            <ScrollToTopButton show={showScrollButton} scrollToTop={scrollToTop} />
        </>
    );
}

export default App;
