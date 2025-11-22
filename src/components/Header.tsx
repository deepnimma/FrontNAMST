import React, { useState, useEffect } from 'react';

interface HeaderProps {
    handleReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleReset }) => {
    const mainHeaderPhrases = [
        "NottAnotherPokeDexTracker",
        "NottAnotherTrainerDexTracker",
        "NottAnotherIllustratorDexTracker",
        "NottAnotherMasterSetTracker"
    ];
    const [mainHeaderIndex, setMainHeaderIndex] = useState(0);
    const [currentMainHeader, setCurrentMainHeader] = useState(mainHeaderPhrases[0]);
    const [animationStopped, setAnimationStopped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (animationStopped) return;

        const interval = setInterval(() => {
            setMainHeaderIndex(prevIndex => {
                const nextIndex = prevIndex + 1;
                if (nextIndex === mainHeaderPhrases.length - 1) {
                    setAnimationStopped(true);
                    clearInterval(interval);
                }
                return nextIndex % mainHeaderPhrases.length;
            });
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [animationStopped]);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 500); // Animation duration
        setCurrentMainHeader(mainHeaderPhrases[mainHeaderIndex]);
        return () => clearTimeout(timer);
    }, [mainHeaderIndex]);

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
