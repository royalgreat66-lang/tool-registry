import { useApp } from '../../context/AppContext';
import { esc, normalizeTags, TAG_LABELS, getTimeAgo } from '../../utils/helpers';
import './ToolCard.css';

export default function ToolCard({ tool, editTool, removeToolById }) {
    const { folders, currentView } = useApp();

    const domain = (() => { try { return new URL(tool.url).hostname; } catch { return tool.url; } })();
    const iconUrl = tool.icon || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    const initial = (tool.name || '?').charAt(0).toUpperCase();
    const timeAgo = getTimeAgo(new Date(tool.added_at));
    const toolTags = normalizeTags(tool.tags);
    const folder = folders.find(f => f.id === tool.folder_id);
    const folderBadge = folder && currentView !== 'folder' ? (
        <span className="folder-badge">{esc(folder.name)}</span>
    ) : null;

    return (
        <article className="tool-card entering" data-tool-id={tool.id}>
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
                    <a href={esc(tool.url)} target="_blank" rel="noopener" className="tool-url">{domain}</a>
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
                    <button className="action-btn visit" onClick={() => window.open(tool.url, '_blank')} title="Visit">↗</button>
                    <button className="action-btn edit" onClick={() => editTool(tool.id)} title="Edit">✎</button>
                    <button className="action-btn" onClick={() => removeToolById(tool.id)} title="Remove">✕</button>
                </div>
            </div>
        </article>
    );
}
