import { useApp } from '../../context/AppContext';
import './BulkActionBar.css';

export default function BulkActionBar({ onDeleteClick, onMoveToFolderClick }) {
    const { selectedItems } = useApp();
    const count = selectedItems.size;

    if (count === 0) return null;

    return (
        <div className="bulk-action-bar">
            <div className="bulk-action-content">
                <span className="selected-count">{count} {count === 1 ? 'item' : 'items'} selected</span>
                <div className="bulk-action-buttons">
                    <button className="bulk-action-btn delete" onClick={onDeleteClick}>
                        Delete
                    </button>
                    <button className="bulk-action-btn move" onClick={onMoveToFolderClick}>
                        Move to Folder
                    </button>
                </div>
            </div>
        </div>
    );
}
