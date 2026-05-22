import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { esc, normalizeTags, TAG_LABELS, getTimeAgo } from '../../utils/helpers';
import Spinner from '../Spinner/Spinner';
import './ToolCard.css';

export default function ToolCard({ tool, editTool, removeToolById, selectMode, selectedItems, toggleSelection }) {
    const { folders, currentView } = useApp();
    const [isDeleting, setIsDeleting] = useState(false);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const cardRef = useRef(null);

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
    const timeAgo = getTimeAgo(new Date(tool.added_at));
    const toolTags = normalizeTags(tool.tags);
    const folder = folders.find(f => f.id === tool.folder_id);
    const folderBadge = folder && currentView !== 'folder' ? (
        <span className="folder-badge">{esc(folder.name)}</span>
    ) : null;

    const isSelected = selectedItems && selectedItems.has(tool.id);

    const handleMouseMove = (e) => {
        if (selectMode) return;

        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateYValue = ((x - centerX) / centerX) * 20;
        const rotateXValue = -((y - centerY) / centerY) * 20;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    const handleCardClick = () => {
        if (selectMode) {
            toggleSelection(tool.id);
        }
    };

    useEffect(() => {
        if (cardRef.current && !selectMode) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            cardRef.current.style.transition = 'transform 0.1s ease-out';
        } else if (cardRef.current) {
            cardRef.current.style.transform = '';
            cardRef.current.style.transition = '';
        }
    }, [rotateX, rotateY, selectMode]);

    return (
        <article
            ref={cardRef}
            className={`tool-card entering ${isSelected ? 'selected' : ''} ${selectMode && !isSelected ? 'dimmed' : ''}`}
            data-tool-id={tool.id}
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="card-header">
                <div className={`tool-icon ${!tool.icon ? 'fallback' : ''}`}>
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
                    <h3 className="tool-name" title={esc(tool.name)}>{esc(tool.name)}</h3>
                    {selectMode ? (
                        <span className="tool-url">{domain}</span>
                    ) : (
                        <a href={esc(tool.url)} target="_blank" rel="noopener" className="tool-url">{domain}</a>
                    )}
                </div>
                {folderBadge}
            </div>
            <p className="tool-description">{esc(tool.description)}</p>
            <div className="tool-tags">
                {toolTags.map(tag => (
                    <span key={tag} className="tag-pill">{esc(TAG_LABELS[tag] || tag)}</span>
                ))}
            </div>
            <div className="card-footer">
                <div className="tool-source">
                    <span className="source-dot"></span>
                    <span>{esc(tool.source || 'Microlink')} · {timeAgo}</span>
                </div>
                <div className="tool-actions">
                    <button className="action-btn visit" onClick={() => window.open(tool.url, '_blank')} title="Visit" disabled={selectMode}>↗</button>
                    <button className="action-btn edit" onClick={() => editTool(tool.id)} title="Edit" disabled={selectMode}>✎</button>
                    <button className="action-btn" onClick={handleDelete} disabled={isDeleting || selectMode} title="Remove">
                        {isDeleting ? <Spinner /> : '✕'}
                    </button>
                </div>
            </div>
        </article>
    );
}
