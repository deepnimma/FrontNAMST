import React from 'react';
import { Settings, Library, Sparkles } from 'lucide-react';

interface DisplayControlsProps {
    images: any[];
    toggleGridCols: () => void;
    gridCols: number;
    setShowSetNames: (value: React.SetStateAction<boolean>) => void;
    showSetNames: boolean;
    setShowReverseHolos: (value: React.SetStateAction<boolean>) => void;
    showReverseHolos: boolean;
}

const DisplayControls: React.FC<DisplayControlsProps> = ({
    images,
    toggleGridCols,
    gridCols,
    setShowSetNames,
    showSetNames,
    setShowReverseHolos,
    showReverseHolos,
}) => {
    return (
        <div className={`display-controls-container ${images.length > 0 ? 'visible' : ''}`}>
            <button onClick={toggleGridCols} className="grid-toggle-button">
                <Settings size={16} />
                {gridCols} Columns
            </button>
            <button onClick={() => setShowSetNames(prev => !prev)} className="set-name-toggle-button">
                <Library size={16} />
                {showSetNames ? 'Hide Sets' : 'Show Sets'}
            </button>
            <button onClick={() => setShowReverseHolos(prev => !prev)} className="reverse-holo-toggle-button">
                <Sparkles size={16} />
                {showReverseHolos ? 'Hide Reverse' : 'Show Reverse'}
            </button>
        </div>
    );
};

export default DisplayControls;
