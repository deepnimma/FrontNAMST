import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { placeholderWords } from '../lib/constants';
import { useSearchContext } from '../context/SearchContext';

type Phase = 'visible' | 'exiting' | 'entering';

const WORD_COLORS = ['#3B9EFF', '#2ECC71', '#A855F7', '#BA0C2F'];

const SearchBar: React.FC = () => {
    const { query, setQuery, loading, handleKeyDown, performSearch, placeholderIndex } = useSearchContext();

    const [displayedIndex, setDisplayedIndex] = useState(placeholderIndex);
    const [phase, setPhase] = useState<Phase>('visible');
    const pendingRef = useRef<number | null>(null);

    useEffect(() => {
        if (phase !== 'visible' || placeholderIndex === displayedIndex) return;
        pendingRef.current = placeholderIndex;
        setPhase('exiting');
    }, [placeholderIndex, displayedIndex, phase]);

    const handleAnimationEnd = () => {
        if (phase === 'exiting' && pendingRef.current !== null) {
            // Content swaps here while invisible
            setDisplayedIndex(pendingRef.current);
            pendingRef.current = null;
            setPhase('entering');
        } else if (phase === 'entering') {
            setPhase('visible');
        }
    };

    const handleFocus = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
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
                        <span
                            className={`placeholder-word${phase !== 'visible' ? ` placeholder-${phase}` : ''}`}
                            style={{ color: WORD_COLORS[displayedIndex] }}
                            onAnimationEnd={handleAnimationEnd}
                        >
                            {placeholderWords[displayedIndex]}
                        </span>
                    </div>
                )}
            </div>
            <button className="search-button" onClick={performSearch} disabled={loading}>
                {loading ? 'Searching...' : <><Search size={18} /> Search</>}
            </button>
        </div>
    );
};

export default SearchBar;
