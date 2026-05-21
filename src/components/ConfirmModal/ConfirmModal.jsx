import { useState } from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    const [isSelectingText, setIsSelectingText] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay active" onClick={(e) => {
            if (!isSelectingText) onClose();
        }}>
            <div 
                className="modal confirm-modal" 
                onClick={(e) => e.stopPropagation()}
                onMouseDown={() => setIsSelectingText(true)}
                onMouseUp={() => setIsSelectingText(false)}
                onMouseLeave={() => setIsSelectingText(false)}
            >
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn-danger" onClick={onConfirm}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
