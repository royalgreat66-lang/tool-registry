import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { esc } from '../../utils/helpers';
import './ToolRow.css';

export default function ToolRow({ tool, editTool, removeToolById }) {
    const { folders, currentView } = useApp();
    const [isDeleting, setIsDeleting] = useState(false);

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

    return (
        <div className="tool-row" data-tool-id={tool.id}>
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
                <a href={esc(tool.url)} target="_blank" rel="noopener" className="tool-url">{domain}</a>
            </div>
            {folderBadge}
            <div className="tool-actions">
                <button className="action-btn visit" onClick={() => window.open(tool.url, '_blank')} title="Visit" style={{ width: '28px', height: '28px' }}>↗</button>
                <button className="action-btn edit" onClick={() => editTool(tool.id)} title="Edit" style={{ width: '28px', height: '28px' }}>✎</button>
                <button className="action-btn" onClick={handleDelete} disabled={isDeleting} title="Remove" style={{ width: '28px', height: '28px' }}>
                    {isDeleting ? <span className="btn-spinner"></span> : '✕'}
                </button>
            </div>
        </div>
    );
}
