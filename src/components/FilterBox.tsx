import React, { useState } from 'react';
import { useSearchContext } from '../context/SearchContext';
import '../styles/FilterBox.css';

const FilterBox: React.FC = () => {
    const {
        showSetNames, setShowSetNames,
        showReverseHolos, setShowReverseHolos,
        gridCols, setGridCols,
        hideFirstEditions, setHideFirstEditions,
        showEnergyCards, setShowEnergyCards,
        showItemCards, setShowItemCards,
        showTrainerOwned, setShowTrainerOwned,
    } = useSearchContext();

    const [copied, setCopied] = useState(false);

    const toggleGridCols = () => setGridCols(gridCols === 3 ? 5 : 3);

    const handlePrint = () => window.print();

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="filter-box">
            <h3>Filters</h3>
            <div className="filter-box-checkbox-group">
                <label>
                    <input type="checkbox" checked={showSetNames} onChange={(e) => setShowSetNames(e.target.checked)} />
                    Show Set Names
                </label>
                <label>
                    <input type="checkbox" checked={showReverseHolos} onChange={(e) => setShowReverseHolos(e.target.checked)} />
                    Show Reverse Holos
                </label>
                <label>
                    <input type="checkbox" checked={hideFirstEditions} onChange={(e) => setHideFirstEditions(e.target.checked)} />
                    Hide 1st Edition
                </label>
                <label>
                    <input type="checkbox" checked={showItemCards} onChange={(e) => setShowItemCards(e.target.checked)} />
                    Show Trainer Cards
                </label>
                <label>
                    <input type="checkbox" checked={showTrainerOwned} onChange={(e) => setShowTrainerOwned(e.target.checked)} />
                    Show Trainer's PKMN
                </label>
                <label>
                    <input type="checkbox" checked={showEnergyCards} onChange={(e) => setShowEnergyCards(e.target.checked)} />
                    Show Energy Cards
                </label>
            </div>
            <div className="grid-cols-buttons">
                <button onClick={toggleGridCols} className="grid-toggle-button">
                    {gridCols === 5 ? '3 Cols' : '5 Cols'}
                </button>
                <button onClick={handleShare} className="share-button">
                    {copied ? 'Copied!' : 'Share'}
                </button>
                <button onClick={handlePrint} className="print-button">
                    Print
                </button>
            </div>
        </div>
    );
};

export default FilterBox;
