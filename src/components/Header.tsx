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
        setCurrentMainHeader(mainHeaderPhrases[mainHeaderIndex]);
    }, [mainHeaderIndex]);

    return (
        <div className="header-container">
            <button className="title-button" onClick={handleReset}>
                <h1 className="title">
                    <span className="title-desktop">{currentMainHeader}</span>
                    <span className="title-mobile">NottDex</span>
                </h1>
            </button>
        </div>
    );
};

export default Header;
