import { useApp } from '../../context/AppContext';
import { esc } from '../../utils/helpers';
import './Sidebar.css';

export default function Sidebar({ switchView, createFolderPrompt, renameFolderPrompt, deleteFolderPrompt }) {
    const { folders, tools, currentView, currentFolderId } = useApp();

    const looseCount = tools.filter(t => !t.folder_id).length;
    const everythingCount = tools.length;

    return (
        <aside className="sidebar" id="sidebar">
            <div className="sidebar-section">
                <div className="sidebar-title">Views</div>
                <div className={`nav-item ${currentView === 'loose' ? 'active' : ''}`} onClick={() => switchView('loose')}>
                    <span className="nav-icon">🧩</span>
                    <span>Loose</span>
                    <span className="nav-count">{looseCount}</span>
                </div>
                <div className={`nav-item ${currentView === 'everything' ? 'active' : ''}`} onClick={() => switchView('everything')}>
                    <span className="nav-icon">🌐</span>
                    <span>Everything</span>
                    <span className="nav-count">{everythingCount}</span>
                </div>
            </div>
            <div className="sidebar-divider"></div>
            <div className="sidebar-section">
                <div className="sidebar-title">Folders</div>
                <input type="text" className="folder-search" id="folderSearch" placeholder="Search folders..." />
                <div id="folderList">
                    {folders.map(folder => {
                        const count = tools.filter(t => t.folder_id === folder.id).length;
                        const isActive = currentView === 'folder' && currentFolderId === folder.id;
                        return (
                            <div key={folder.id} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => switchView('folder', folder.id)}>
                                <span className="nav-icon">📁</span>
                                <span>{esc(folder.name)}</span>
                                <div className="nav-actions">
                                    <button className="nav-action-btn" onClick={(e) => { e.stopPropagation(); renameFolderPrompt(folder.id); }} title="Rename">✎</button>
                                    <button className="nav-action-btn delete" onClick={(e) => { e.stopPropagation(); deleteFolderPrompt(folder.id); }} title="Delete">🗑</button>
                                </div>
                                <span className="nav-count">{count}</span>
                            </div>
                        );
                    })}
                </div>
                <button className="new-folder-btn" onClick={createFolderPrompt}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    New Folder
                </button>
            </div>
        </aside>
    );
}
