import React from 'react';
import { Search } from 'lucide-react';
import { placeholderWords } from '../lib/constants';
import { useSearchContext } from '../context/SearchContext';

const SearchBar: React.FC = () => {
    const { query, setQuery, loading, handleKeyDown, performSearch, placeholderIndex } = useSearchContext();

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
                        <span className="placeholder-word" key={placeholderIndex}>
                            {placeholderWords[placeholderIndex]}
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
