import React from 'react';
import '../styles/FilterBox.css';

interface FilterBoxProps {
    showSetNames: boolean;
    setShowSetNames: (show: boolean) => void;
    showReverseHolos: boolean;
    setShowReverseHolos: (show: boolean) => void;
    gridCols: number;
    setGridCols: (cols: number) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({
    showSetNames,
    setShowSetNames,
    showReverseHolos,
    setShowReverseHolos,
    gridCols,
    setGridCols,
}) => {
    const toggleGridCols = () => {
        setGridCols(gridCols === 3 ? 5 : 3);
    };

    return (
        <div className="filter-box">
            <h3>Filters</h3>
            <div className="checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        checked={showSetNames}
                        onChange={(e) => setShowSetNames(e.target.checked)}
                    />
                    Show Set Names
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showReverseHolos}
                        onChange={(e) => setShowReverseHolos(e.target.checked)}
                    />
                    Show Reverse Holos
                </label>
            </div>
            <div className="grid-cols-buttons">
                <button onClick={toggleGridCols} className="grid-toggle-button">
                    {gridCols === 5 ? '3 Cols' : '5 Cols'}
                </button>
            </div>
        </div>
    );
};

export default FilterBox;
