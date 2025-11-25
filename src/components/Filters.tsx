import React from 'react';
import { ArrowDownUp } from 'lucide-react';

interface FiltersProps {
    isCameo: boolean;
    isTrainer: boolean;
    isIllustrator: boolean;
    isSet: boolean;
    handleCameoChange: (checked: boolean) => void;
    handleTrainerChange: (checked: boolean) => void;
    handleIllustratorChange: (checked: boolean) => void;
    handleSetChange: (checked: boolean) => void;
    toggleSortOrder: () => void;
    sortOrder: 'asc' | 'desc';
    query: string;
}

const Filters: React.FC<FiltersProps> = ({
    isCameo,
    isTrainer,
    isIllustrator,
    isSet,
    handleCameoChange,
    handleTrainerChange,
    handleIllustratorChange,
    handleSetChange,
    toggleSortOrder,
    sortOrder,
    query,
}) => {
    return (
        <div className={`filters-container ${query.length > 0 ? 'visible' : ''}`}>
            <div className="checkbox-group">
                <label className={`checkbox-label ${isIllustrator ? 'disabled' : ''}`} title="Enable this if you also want cameo appearances of the particular pokemon/trainer you are searching for to be displayed.">
                    <input type="checkbox" checked={isCameo} onChange={(e) => handleCameoChange(e.target.checked)} disabled={isIllustrator} />
                    Cameo
                </label>
                <label className={`checkbox-label ${isIllustrator ? 'disabled' : ''}`} title="Enable this if you are trying to search for a particular Pokemon series trainer.">
                    <input type="checkbox" checked={isTrainer} onChange={(e) => handleTrainerChange(e.target.checked)} disabled={isIllustrator} />
                    Trainer
                </label>
                <label className={`checkbox-label ${isCameo || isTrainer ? 'disabled' : ''}`} title="Enable this if you are trying to search for all cards from a particular illustrator.">
                    <input type="checkbox" checked={isIllustrator} onChange={(e) => handleIllustratorChange(e.target.checked)} disabled={isCameo || isTrainer} />
                    Illustrator
                </label>
                <label className="checkbox-label" title="Enable this if you are trying to search for all cards from a particular set.">
                    <input type="checkbox" checked={isSet} onChange={(e) => handleSetChange(e.target.checked)} />
                    Set
                </label>
            </div>
            <div className="filter-buttons-group">
                <button onClick={toggleSortOrder} className="sort-button">
                    <ArrowDownUp size={16} />
                    {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </button>
            </div>
        </div>
    );
};

export default Filters;
