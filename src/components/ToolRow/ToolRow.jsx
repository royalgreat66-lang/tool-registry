import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../../context/AppContext';
import { esc } from '../../utils/helpers';
import Spinner from '../Spinner/Spinner';
import './ToolRow.css';

export default function ToolRow({ tool, editTool, removeToolById, selectMode, selectedItems, toggleSelection, reorderMode, isOverlay }) {
    const { folders, currentView } = useApp();
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: tool.id,
        disabled: !reorderMode || isOverlay,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isOverlay ? 1000 : 'auto',
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await removeToolById(tool.id);
        } catch (error) {
            console.error('Delete error:', error);
            setIsDeleting(false);
        }
    };

    const domain = (() => { try { return new URL(tool.url).hostname; } catch { return tool.url; } })();
    const iconUrl = tool.icon || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    const initial = (tool.name || '?').charAt(0).toUpperCase();
    const folder = folders.find(f => f.id === tool.folder_id);
    const folderBadge = folder && currentView !== 'folder' ? (
        <span className="folder-badge">{esc(folder.name)}</span>
    ) : null;

    const isSelected = selectedItems && selectedItems.has(tool.id);

    const handleRowClick = () => {
        if (selectMode) {
            toggleSelection(tool.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`tool-row ${isSelected ? 'selected' : ''} ${selectMode && !isSelected ? 'dimmed' : ''} ${reorderMode ? 'reorder-active' : ''} ${isOverlay ? 'is-overlay' : ''} ${isDragging ? 'is-dragging' : ''}`}
            data-tool-id={tool.id}
            onClick={handleRowClick}
            {...attributes}
            {...listeners}
            style={style}
        >
            <div className={`tool-icon ${!tool.icon ? 'fallback' : ''}`} style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>
                {tool.icon ? (
                    <img 
                        src={iconUrl} 
                        alt={esc(tool.name)} 
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('fallback');
                            e.target.parentElement.textContent = initial;
                        }}
                    />
                ) : initial}
            </div>
            <div className="tool-meta">
                <h3 className="tool-name">{esc(tool.name)}</h3>
                {selectMode || reorderMode ? (
                    <span className="tool-url">{domain}</span>
                ) : (
                    <a href={esc(tool.url)} target="_blank" rel="noopener" className="tool-url">{domain}</a>
                )}
            </div>
            {folderBadge}
            <div className="tool-actions">
                <button className="action-btn visit" onClick={() => window.open(tool.url, '_blank')} title="Visit" disabled={selectMode || reorderMode} style={{ width: '28px', height: '28px' }}>↗</button>
                <button className="action-btn edit" onClick={() => editTool(tool.id)} title="Edit" disabled={selectMode || reorderMode} style={{ width: '28px', height: '28px' }}>✎</button>
                <button className="action-btn" onClick={handleDelete} disabled={isDeleting || selectMode || reorderMode} title="Remove" style={{ width: '28px', height: '28px' }}>
                    {isDeleting ? <Spinner /> : '✕'}
                </button>
            </div>
        </div>
    );
}
