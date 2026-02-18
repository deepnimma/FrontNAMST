import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { CardImage } from '../lib/types';
import { useCardSearch } from '../hooks/useCardSearch';
import { useAppEffects } from '../hooks/useAppEffects';
import { useGridLayout } from '../hooks/useGridLayout';
import { useUrlSync } from '../hooks/useUrlSync';

function getInitialUrlState() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query') ?? '';
    const isCameo = params.get('isCameo') === 'true';
    const isTrainer = params.get('isTrainer') === 'true';
    const isIllustrator = params.get('isIllustrator') === 'true';
    const isSet = params.get('isSet') === 'true';
    const sortOrderRaw = params.get('sortOrder');
    const sortOrder: 'asc' | 'desc' = sortOrderRaw === 'desc' ? 'desc' : 'asc';
    return { query, isCameo, isTrainer, isIllustrator, isSet, sortOrder };
}

interface SearchContextValue {
    query: string;
    setQuery: (query: string) => void;
    lastExecutedQuery: string;

    isCameo: boolean;
    isTrainer: boolean;
    isIllustrator: boolean;
    isSet: boolean;
    handleCameoChange: (checked: boolean) => void;
    handleTrainerChange: (checked: boolean) => void;
    handleIllustratorChange: (checked: boolean) => void;
    handleSetChange: (checked: boolean) => void;

    sortOrder: 'asc' | 'desc';
    toggleSortOrder: () => void;

    showSetNames: boolean;
    setShowSetNames: (show: boolean) => void;
    showReverseHolos: boolean;
    setShowReverseHolos: (show: boolean) => void;
    hideFirstEditions: boolean;
    setHideFirstEditions: (hide: boolean) => void;
    showEnergyCards: boolean;
    setShowEnergyCards: (show: boolean) => void;
    showItemCards: boolean;
    setShowItemCards: (show: boolean) => void;
    showTrainerOwned: boolean;
    setShowTrainerOwned: (show: boolean) => void;

    gridCols: number;
    setGridCols: (cols: number) => void;

    images: CardImage[];
    filteredImages: CardImage[];
    imageGridKey: string;
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    loadMore: () => void;
    isNewSearch: boolean;
    error: string | null;
    searchPerformed: boolean;

    selectedImage: CardImage | null;
    openModal: (image: CardImage) => void;
    closeModal: () => void;

    showScrollButton: boolean;
    showMissingCardButton: boolean;
    isFilterBoxOpen: boolean;
    setIsFilterBoxOpen: (open: boolean) => void;
    placeholderIndex: number;

    performSearch: () => void;
    handleReset: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    scrollToTop: () => void;
    handleTcgPlayerSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const initial = useMemo(() => getInitialUrlState(), []);

    const [query, setQuery] = useState(initial.query);
    const [lastExecutedQuery, setLastExecutedQuery] = useState(initial.query);
    const [isCameo, setIsCameo] = useState(initial.isCameo);
    const [isTrainer, setIsTrainer] = useState(initial.isTrainer);
    const [isIllustrator, setIsIllustrator] = useState(initial.isIllustrator);
    const [isSet, setIsSet] = useState(initial.isSet);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initial.sortOrder);

    const [showSetNames, setShowSetNames] = useState(false);
    const [showReverseHolos, setShowReverseHolos] = useState(true);
    const [hideFirstEditions, setHideFirstEditions] = useState(false);
    const [showEnergyCards, setShowEnergyCards] = useState(false);
    const [showItemCards, setShowItemCards] = useState(true);
    const [showTrainerOwned, setShowTrainerOwned] = useState(true);

    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchId, setSearchId] = useState(0);
    const [selectedImage, setSelectedImage] = useState<CardImage | null>(null);
    const [showMissingCardButton, setShowMissingCardButton] = useState(false);
    const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);

    const { images, setImages, loading, loadingMore, hasMore, handleSearch, loadMore, isNewSearch, error } = useCardSearch();
    const { showScrollButton, placeholderIndex } = useAppEffects(query);
    const { gridCols, setGridCols } = useGridLayout();

    useUrlSync({ query, isCameo, isTrainer, isIllustrator, isSet, sortOrder });

    // Trigger search from URL params on initial load
    useEffect(() => {
        if (initial.query) {
            setSearchPerformed(true);
            setSearchId(id => id + 1);
            handleSearch(initial.query, initial.isCameo, initial.isTrainer, initial.isIllustrator, initial.sortOrder, initial.isSet);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sort images when it's a set search
    useEffect(() => {
        if (!isSet || images.length === 0) return;

        const getVariantOrder = (cardNumber: string) => {
            if (cardNumber.endsWith('-MB')) return 3;
            if (cardNumber.endsWith('-PB')) return 2;
            if (cardNumber.endsWith('-RH')) return 1;
            return 0;
        };

        const sortedImages = [...images].sort((a, b) => {
            const dateA = new Date(a.releaseDate).getTime();
            const dateB = new Date(b.releaseDate).getTime();
            if (dateA !== dateB) return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;

            const numA = parseInt(a.cardNumber.split('/')[0], 10);
            const numB = parseInt(b.cardNumber.split('/')[0], 10);
            if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                return sortOrder === 'asc' ? numA - numB : numB - numA;
            }

            const variantOrderA = getVariantOrder(a.cardNumber);
            const variantOrderB = getVariantOrder(b.cardNumber);
            if (variantOrderA !== variantOrderB) {
                return sortOrder === 'asc' ? variantOrderA - variantOrderB : variantOrderB - variantOrderA;
            }

            const cardNumA = a.cardNumber.split('/')[0];
            const cardNumB = b.cardNumber.split('/')[0];
            return sortOrder === 'asc' ? cardNumA.localeCompare(cardNumB) : cardNumB.localeCompare(cardNumA);
        });

        const isDifferent = sortedImages.some((img, i) => img.imageKey !== images[i].imageKey);
        if (isDifferent) setImages(sortedImages);
    }, [images, isSet, sortOrder, setImages]);

    useEffect(() => {
        setShowMissingCardButton(images.length > 0);
    }, [images]);

    const performSearch = useCallback(() => {
        const newSortOrder: 'asc' | 'desc' = 'asc';
        setSearchId(id => id + 1);
        setSearchPerformed(true);
        setSortOrder(newSortOrder);
        setLastExecutedQuery(query);
        handleSearch(query, isCameo, isTrainer, isIllustrator, newSortOrder, isSet);
    }, [query, isCameo, isTrainer, isIllustrator, isSet, handleSearch]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') performSearch();
    }, [performSearch]);

    const handleReset = useCallback(() => {
        setQuery('');
        setLastExecutedQuery('');
        setImages([]);
        setIsCameo(false);
        setIsTrainer(false);
        setIsIllustrator(false);
        setIsSet(false);
        setSearchPerformed(false);
        setSearchId(0);
    }, [setImages]);

    const toggleSortOrder = useCallback(() => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        if (!isSet) {
            handleSearch(query, isCameo, isTrainer, isIllustrator, newSortOrder, isSet);
        }
    }, [sortOrder, isSet, query, isCameo, isTrainer, isIllustrator, handleSearch]);

    const handleCameoChange = useCallback((checked: boolean) => {
        setIsCameo(checked);
        if (checked) { setIsIllustrator(false); setIsSet(false); }
    }, []);

    const handleTrainerChange = useCallback((checked: boolean) => {
        setIsTrainer(checked);
        if (checked) { setIsIllustrator(false); setIsSet(false); }
    }, []);

    const handleIllustratorChange = useCallback((checked: boolean) => {
        setIsIllustrator(checked);
        if (checked) { setIsCameo(false); setIsTrainer(false); setIsSet(false); }
    }, []);

    const handleSetChange = useCallback((checked: boolean) => {
        setIsSet(checked);
        if (checked) { setIsCameo(false); setIsTrainer(false); setIsIllustrator(false); }
    }, []);

    const openModal = useCallback((image: CardImage) => setSelectedImage(image), []);
    const closeModal = useCallback(() => setSelectedImage(null), []);
    const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

    const handleTcgPlayerSearch = useCallback(() => {
        const searchString = query.toLowerCase().replace(/-/g, ' ');
        const tcgplayerLink = `https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=${searchString}&view=grid&productTypeName=Cards`;
        const partnerLink = `https://partner.tcgplayer.com/namst?u=${encodeURIComponent(tcgplayerLink)}`;
        window.open(partnerLink, '_blank');
    }, [query]);

    const filteredImages = useMemo(() => {
        let temp = images;
        if (!showReverseHolos) temp = temp.filter(img => img.isReverseHolo !== 1);
        if (hideFirstEditions) temp = temp.filter(img => !img.tags.includes('1st-edition'));
        if (!showEnergyCards) temp = temp.filter(img => !img.tags.includes('energy'));
        if (!showItemCards) temp = temp.filter(img => img.item !== 1);
        if (!showTrainerOwned) temp = temp.filter(img => img.trainerOwned !== 1);
        return temp;
    }, [images, showReverseHolos, hideFirstEditions, showEnergyCards, showItemCards, showTrainerOwned]);

    const imageGridKey = useMemo(
        () => `${searchId}-${sortOrder}-${showReverseHolos}-${hideFirstEditions}-${showEnergyCards}-${showItemCards}-${showTrainerOwned}`,
        [searchId, sortOrder, showReverseHolos, hideFirstEditions, showEnergyCards, showItemCards, showTrainerOwned]
    );

    const value: SearchContextValue = {
        query, setQuery, lastExecutedQuery,
        isCameo, isTrainer, isIllustrator, isSet,
        handleCameoChange, handleTrainerChange, handleIllustratorChange, handleSetChange,
        sortOrder, toggleSortOrder,
        showSetNames, setShowSetNames,
        showReverseHolos, setShowReverseHolos,
        hideFirstEditions, setHideFirstEditions,
        showEnergyCards, setShowEnergyCards,
        showItemCards, setShowItemCards,
        showTrainerOwned, setShowTrainerOwned,
        gridCols, setGridCols,
        images, filteredImages, imageGridKey,
        loading, loadingMore, hasMore, loadMore, isNewSearch, error,
        searchPerformed,
        selectedImage, openModal, closeModal,
        showScrollButton, showMissingCardButton,
        isFilterBoxOpen, setIsFilterBoxOpen,
        placeholderIndex,
        performSearch, handleReset, handleKeyDown, scrollToTop, handleTcgPlayerSearch,
    };

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearchContext(): SearchContextValue {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error('useSearchContext must be used within SearchProvider');
    return ctx;
}
