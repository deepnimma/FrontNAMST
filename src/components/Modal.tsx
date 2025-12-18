import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { CardImage } from '../lib/types';
import { R2_BUCKET_URL } from '../lib/constants';
import { capitalizeWords, parseTags, generateTcgplayerLink } from '../lib/utils';
import '../styles/Modal.css';

interface ModalProps {
    selectedImage: CardImage | null;
    closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ selectedImage, closeModal }) => {
    if (!selectedImage) return null;

    const tcgplayerLink = generateTcgplayerLink(selectedImage.setName, selectedImage.cardTitle);

    const renderTags = () => {
        if (!selectedImage || !selectedImage.tags) return null;
        const tags = parseTags(selectedImage.tags);
        if (tags.length === 0) return null;
        return (
            <div className="tags-container">
                <h3>Tags</h3>
                <p className="tags-text">{tags.map(tag => capitalizeWords(tag)).join(', ')}</p>
            </div>
        );
    };

    return (
        <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={closeModal}><X size={24} /></button>
                <img src={`${R2_BUCKET_URL}/${selectedImage.imageKey}`} alt={selectedImage.cardTitle} className="modal-image" />
                <div className="modal-metadata">
                    <h2>{capitalizeWords(selectedImage.cardTitle)}</h2>
                    <p><strong>Set Name:</strong> {capitalizeWords(selectedImage.setName)}</p>
                    <p><strong>Card Number:</strong> {selectedImage.cardNumber}</p>
                    <p><strong>Illustrator:</strong> {capitalizeWords(selectedImage.illustrator)}</p>
                    <p><strong>Release Date:</strong> {selectedImage.releaseDate}</p>
                    {renderTags()}
                    <a href={tcgplayerLink} target="_blank" rel="noopener noreferrer" className="tcgplayer-button-modal">
                        View on TCGPlayer
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Modal;
