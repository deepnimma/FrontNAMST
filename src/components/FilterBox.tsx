import React from 'react';
import '../styles/FilterBox.css';

interface FilterBoxProps {
    showSetNames: boolean;
    setShowSetNames: (show: boolean) => void;
    showReverseHolos: boolean;
    setShowReverseHolos: (show: boolean) => void;
    gridCols: number;
    setGridCols: (cols: number) => void;
    hideFirstEditions: boolean;
    setHideFirstEditions: (hide: boolean) => void;
    showEnergyCards: boolean;
    setShowEnergyCards: (show: boolean) => void;
    showItemCards: boolean;
    setShowItemCards: (show: boolean) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({
    showSetNames,
    setShowSetNames,
    showReverseHolos,
    setShowReverseHolos,
    gridCols,
    setGridCols,
    hideFirstEditions,
    setHideFirstEditions,
    showEnergyCards,
    setShowEnergyCards,
    showItemCards,
    setShowItemCards,
}) => {
    const toggleGridCols = () => {
        setGridCols(gridCols === 3 ? 5 : 3);
    };

    return (
        <div className="filter-box">
            <h3>Filters</h3>
            <div className="filter-box-checkbox-group">
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
                <label>
                    <input
                        type="checkbox"
                        checked={hideFirstEditions}
                        onChange={(e) => setHideFirstEditions(e.target.checked)}
                    />
                    Hide 1st Edition
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showEnergyCards}
                        onChange={(e) => setShowEnergyCards(e.target.checked)}
                    />
                    Show Energy Cards
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showItemCards}
                        onChange={(e) => setShowItemCards(e.target.checked)}
                    />
                    Show Item Cards
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
