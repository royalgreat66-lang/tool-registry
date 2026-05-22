import { useApp } from '../../context/AppContext';
import { esc } from '../../utils/helpers';
import './FolderPickerModal.css';

export default function FolderPickerModal({ isOpen, onClose, onFolderSelect }) {
    const { folders } = useApp();

    if (!isOpen) return null;

    const handleFolderClick = (folderId) => {
        onFolderSelect(folderId);
        onClose();
    };

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="folder-picker-modal" onClick={(e) => e.stopPropagation()}>
                <div className="folder-picker-header">
                    <h3>Move to Folder</h3>
                    <p>Select a folder to move the selected items</p>
                </div>
                <div className="folder-picker-body">
                    <div className="folder-list">
                        <div 
                            className="folder-item"
                            onClick={() => handleFolderClick(null)}
                        >
                            <span className="folder-icon">🧩</span>
                            <span>Loose (no folder)</span>
                        </div>
                        {folders.map(folder => (
                            <div 
                                key={folder.id}
                                className="folder-item"
                                onClick={() => handleFolderClick(folder.id)}
                            >
                                <span className="folder-icon">📁</span>
                                <span>{esc(folder.name)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
