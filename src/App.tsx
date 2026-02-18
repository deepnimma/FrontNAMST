import './App.css';
import './styles/LazyImage.css';
import { SearchProvider, useSearchContext } from './context/SearchContext';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExternalLink } from 'lucide-react';

function AppContent() {
    const {
        query, images, filteredImages, imageGridKey,
        searchPerformed, selectedImage, closeModal,
        showScrollButton, showMissingCardButton,
        isFilterBoxOpen, setIsFilterBoxOpen,
        scrollToTop, handleTcgPlayerSearch,
    } = useSearchContext();

    return (
        <>
            <TopRightLinks />

            <div className={`app-wrapper ${query.length === 0 ? 'initial-state' : ''}`}>
                <div className="main-container">
                    <Header />

                    <div className="sticky-container">
                        <SearchBar />
                        <Filters />
                    </div>

                    <div className={`content-with-filters ${images.length > 0 ? 'filters-visible' : ''}`}>
                        <div className="image-grid-container">
                            {searchPerformed && filteredImages.length > 0 && (
                                <div className="results-count">
                                    <span className="results-count-number">{filteredImages.length}</span> Cards
                                </div>
                            )}
                            <ErrorBoundary>
                                <ImageGrid key={imageGridKey} />
                            </ErrorBoundary>
                        </div>

                        {images.length > 0 && (
                            <div className="right-sidebar">
                                <button
                                    className="mobile-filter-toggle"
                                    onClick={() => setIsFilterBoxOpen(!isFilterBoxOpen)}
                                >
                                    {isFilterBoxOpen ? 'Hide Filters' : 'Show Filters'}
                                </button>
                                <div className={`filter-box-wrapper ${isFilterBoxOpen ? 'open' : ''}`}>
                                    <FilterBox />
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

function App() {
    return (
        <SearchProvider>
            <AppContent />
        </SearchProvider>
    );
}

export default App;
