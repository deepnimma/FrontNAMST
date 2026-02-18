import React from 'react';
import { ArrowDownUp } from 'lucide-react';
import { useSearchContext } from '../context/SearchContext';

const Filters: React.FC = () => {
    const {
        query,
        isCameo, isTrainer, isIllustrator, isSet,
        handleCameoChange, handleTrainerChange, handleIllustratorChange, handleSetChange,
        sortOrder, toggleSortOrder,
    } = useSearchContext();

    return (
        <div className={`filters-container ${query.length > 0 ? 'visible' : ''}`}>
            <div className="checkbox-group">
                <label className={`checkbox-label ${isIllustrator || isSet ? 'disabled' : ''}`} title="Enable this if you also want cameo appearances of the particular pokemon/trainer you are searching for to be displayed.">
                    <input type="checkbox" checked={isCameo} onChange={(e) => handleCameoChange(e.target.checked)} disabled={isIllustrator || isSet} />
                    Cameo
                </label>
                <label className={`checkbox-label ${isIllustrator || isSet ? 'disabled' : ''}`} title="Enable this if you are trying to search for a particular Pokemon series trainer.">
                    <input type="checkbox" checked={isTrainer} onChange={(e) => handleTrainerChange(e.target.checked)} disabled={isIllustrator || isSet} />
                    Trainer
                </label>
                <label className={`checkbox-label ${isCameo || isTrainer || isSet ? 'disabled' : ''}`} title="Enable this if you are trying to search for all cards from a particular illustrator.">
                    <input type="checkbox" checked={isIllustrator} onChange={(e) => handleIllustratorChange(e.target.checked)} disabled={isCameo || isTrainer || isSet} />
                    Illustrator
                </label>
                <label className={`checkbox-label ${isCameo || isTrainer || isIllustrator ? 'disabled' : ''}`} title="Enable this if you are trying to search for all cards from a particular set.">
                    <input type="checkbox" checked={isSet} onChange={(e) => handleSetChange(e.target.checked)} disabled={isCameo || isTrainer || isIllustrator} />
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
