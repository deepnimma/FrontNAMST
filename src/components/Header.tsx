import React from 'react';

interface HeaderProps {
    handleReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleReset }) => {
    return (
        <div className="header-container">
            <button className="title-button" onClick={handleReset}>
                <h1 className="title">
                    <span className="title-desktop">NottAnotherMasterSetTracker</span>
                    <span className="title-mobile">NottDex</span>
                </h1>
            </button>
            <div className="titleSubtext">Find all the cards you need!</div>
        </div>
    );
};

export default Header;
