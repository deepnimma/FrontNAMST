import React, {useState, useEffect, type JSX} from 'react';
import { placeholderWords } from '../lib/constants'; // Import placeholderWords

interface HeaderProps {
    handleReset: () => void;
    placeholderIndex: number; // Accept placeholderIndex as a prop
}

const Header: React.FC<HeaderProps> = ({ handleReset, placeholderIndex }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const mainHeaderPhrases = [
        "NottAnotherPokeDexTracker",
        "NottAnotherTrainerDexTracker",
        "NottAnotherIllustratorDexTracker",
        "NottAnotherMasterSetTracker"
    ];

    const [currentMainHeader, setCurrentMainHeader] = useState(mainHeaderPhrases[0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasReachedMasterSet, setHasReachedMasterSet] = useState(false);

    useEffect(() => {
        if (hasReachedMasterSet) {
            return; // Stop changing if Master Set has been reached
        }

        // Map placeholderIndex to mainHeaderPhrases index
        let headerPhraseIndex = placeholderIndex;
        if (placeholderWords[placeholderIndex] === "Set") {
            headerPhraseIndex = mainHeaderPhrases.length - 1; // "Set" corresponds to "MasterSetTracker"
            setHasReachedMasterSet(true); // Stop further changes
        }

        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 500); // Animation duration

        setCurrentMainHeader(mainHeaderPhrases[headerPhraseIndex]);

        return () => clearTimeout(timer);
    }, [placeholderIndex, hasReachedMasterSet, mainHeaderPhrases]); // Depend on placeholderIndex and hasReachedMasterSet

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
            <button className="title-button" onClick={handleReset}>
                <h1 className="title">
                    <span className={`title-desktop ${isAnimating ? 'header-fade-in' : ''}`}>
                        {renderEmphasizedHeader(currentMainHeader)}
                    </span>
                    <span className="title-mobile">NottDex</span>
                </h1>
            </button>
        </div>
    );
};

export default Header;
