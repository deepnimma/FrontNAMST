import React from 'react';
import { Search } from 'lucide-react';
import { placeholderWords } from '../lib/constants';

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: () => void;
    loading: boolean;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    handleFocus: () => void;
    placeholderIndex: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    query,
    setQuery,
    handleSearch,
    loading,
    handleKeyDown,
    handleFocus,
    placeholderIndex,
}) => {
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
            <button className="search-button" onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : <><Search size={18} /> Search</>}
            </button>
        </div>
    );
};

export default SearchBar;
