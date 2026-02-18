import React, {useState, useEffect, type JSX} from 'react';
import { placeholderWords } from '../lib/constants'; // Import placeholderWords

const MAIN_HEADER_PHRASES = [
    "NottAnotherPokeDexTracker",
    "NottAnotherTrainerDexTracker",
    "NottAnotherIllustratorDexTracker",
    "NottAnotherMasterSetTracker"
];

interface HeaderProps {
    handleReset: () => void;
    placeholderIndex: number; // Accept placeholderIndex as a prop
}

const Header: React.FC<HeaderProps> = ({ handleReset, placeholderIndex }) => {

    const [currentMainHeader, setCurrentMainHeader] = useState(MAIN_HEADER_PHRASES[0]);
    const [hasReachedMasterSet, setHasReachedMasterSet] = useState(false);

    useEffect(() => {
        if (hasReachedMasterSet) {
            return; // Stop changing if Master Set has been reached
        }

        // Map placeholderIndex to MAIN_HEADER_PHRASES index
        const headerPhraseIndex = placeholderIndex;
        const targetHeader = MAIN_HEADER_PHRASES[headerPhraseIndex];

        if (placeholderWords[placeholderIndex] === "Set") {
            // Ensure "MasterSetTracker" is the final header
            setCurrentMainHeader(MAIN_HEADER_PHRASES[MAIN_HEADER_PHRASES.length - 1]);
            setHasReachedMasterSet(true); // Stop further changes
        } else if (currentMainHeader !== targetHeader) {
            setCurrentMainHeader(targetHeader);
        }
    }, [placeholderIndex, hasReachedMasterSet, currentMainHeader]);

    const renderEmphasizedHeader = (headerText: string) => {
        const emphasisWords = ["PokeDex", "TrainerDex", "IllustratorDex", "MasterSet"];
        let renderedText: (string | JSX.Element)[] = [headerText];

        emphasisWords.forEach(word => {
            renderedText = renderedText.flatMap(part => {
                if (typeof part === 'string') {
                    const regex = new RegExp(`(${word})`, 'gi');
                    const matches = part.split(regex);
                    return matches.map((match, index) =>
                        regex.test(match) ? (
                            <span key={`${word}-${index}`} className="emphasized-header-word">
                                {match}
                            </span>
                        ) : (
                            match
                        )
                    );
                }
                return part;
            });
        });
        return renderedText;
    };

    return (
        <div className="header-container">
            <button className="title-button" onClick={handleReset} aria-label="Return to home">
                <h1 className="title">
                    <span key={currentMainHeader} className="title-desktop header-revolve-animation">
                        {renderEmphasizedHeader(currentMainHeader)}
                    </span>
                    <span className="title-mobile">NottDex</span>
                </h1>
            </button>
        </div>
    );
};

export default Header;
