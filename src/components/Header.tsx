import React, { useState, useEffect, useRef, type JSX } from 'react';
import { placeholderWords } from '../lib/constants';
import { useSearchContext } from '../context/SearchContext';

const MAIN_HEADER_PHRASES = [
    "NottAnotherPokeDexTracker",
    "NottAnotherTrainerDexTracker",
    "NottAnotherIllustratorDexTracker",
    "NottAnotherMasterSetTracker"
];

const WORD_CLASSES: Record<string, string> = {
    PokeDex: 'emphasized-pokedex',
    TrainerDex: 'emphasized-trainerdex',
    IllustratorDex: 'emphasized-illustratordex',
    MasterSet: 'emphasized-masterset',
};

type Phase = 'visible' | 'exiting' | 'entering';

const Header: React.FC = () => {
    const { handleReset, placeholderIndex } = useSearchContext();

    const [displayedPhrase, setDisplayedPhrase] = useState(MAIN_HEADER_PHRASES[0]);
    const [phase, setPhase] = useState<Phase>('visible');
    const pendingPhraseRef = useRef<string | null>(null);
    const hasReachedMasterSet = useRef(false);

    // When placeholderIndex changes, kick off the exit phase
    useEffect(() => {
        if (hasReachedMasterSet.current || phase !== 'visible') return;

        const isMasterSet = placeholderWords[placeholderIndex] === 'Set';
        const targetPhrase = isMasterSet
            ? MAIN_HEADER_PHRASES[MAIN_HEADER_PHRASES.length - 1]
            : MAIN_HEADER_PHRASES[placeholderIndex];

        if (targetPhrase === displayedPhrase) return;

        if (isMasterSet) hasReachedMasterSet.current = true;
        pendingPhraseRef.current = targetPhrase;
        setPhase('exiting');
    }, [placeholderIndex, displayedPhrase, phase]);

    // exiting → swap content → entering
    useEffect(() => {
        if (phase !== 'exiting') return;
        const t = setTimeout(() => {
            if (pendingPhraseRef.current) {
                setDisplayedPhrase(pendingPhraseRef.current);
                pendingPhraseRef.current = null;
            }
            setPhase('entering');
        }, 300);
        return () => clearTimeout(t);
    }, [phase]);

    // entering → visible
    useEffect(() => {
        if (phase !== 'entering') return;
        const t = setTimeout(() => setPhase('visible'), 300);
        return () => clearTimeout(t);
    }, [phase]);

    const renderEmphasizedHeader = (headerText: string) => {
        const emphasisWords = Object.keys(WORD_CLASSES);
        let renderedText: (string | JSX.Element)[] = [headerText];

        emphasisWords.forEach(word => {
            renderedText = renderedText.flatMap(part => {
                if (typeof part === 'string') {
                    const regex = new RegExp(`(${word})`, 'gi');
                    return part.split(regex).map((match, index) =>
                        regex.test(match) ? (
                            <span key={`${word}-${index}`} className={WORD_CLASSES[word]}>
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
                    <span className={`title-desktop header-phrase${phase !== 'visible' ? ` header-${phase}ing` : ''}`}>
                        {renderEmphasizedHeader(displayedPhrase)}
                    </span>
                    <span className="title-mobile">NottDex</span>
                </h1>
            </button>
        </div>
    );
};

export default Header;
