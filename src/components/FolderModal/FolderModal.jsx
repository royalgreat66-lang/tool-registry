import { useState } from 'react';
import './FolderModal.css';

export default function FolderModal({ isOpen, onClose, onSave }) {
    const [name, setName] = useState('');
    const [isSelectingText, setIsSelectingText] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim());
            setName('');
        }
    };

    return (
        <div className="modal-overlay active" onClick={(e) => {
            if (!isSelectingText) onClose();
        }}>
            <div 
                className="modal folder-modal" 
                onClick={(e) => e.stopPropagation()}
                onMouseDown={() => setIsSelectingText(true)}
                onMouseUp={() => setIsSelectingText(false)}
                onMouseLeave={() => setIsSelectingText(false)}
            >
                <div className="modal-header">
                    <h3>Create New Folder</h3>
                    <p>Enter a name for your new folder</p>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="field-group">
                            <label>Folder Name</label>
                            <input 
                                type="text" 
                                className="field-input" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Design Tools"
                                autoFocus
                                autoComplete="off"
                            />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn-save">Create Folder</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
