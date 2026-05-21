import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { esc } from '../../utils/helpers';
import FolderModal from '../FolderModal/FolderModal';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import './Sidebar.css';

export default function Sidebar({ switchView, createFolder, renameFolder, deleteFolder }) {
    const { folders, tools, currentView, currentFolderId } = useApp();
    const [folderModalOpen, setFolderModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [folderToRename, setFolderToRename] = useState(null);

    const looseCount = tools.filter(t => !t.folder_id).length;
    const everythingCount = tools.length;

    const handleCreateFolder = () => {
        setFolderModalOpen(true);
    };

    const handleSaveFolder = async (name) => {
        try {
            await createFolder(name);
            setFolderModalOpen(false);
        } catch (e) {
            console.error('Failed to create folder:', e);
        }
    };

    const handleDeleteFolder = (id) => {
        setFolderToDelete(id);
        setConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteFolder(folderToDelete);
            setConfirmModalOpen(false);
            setFolderToDelete(null);
        } catch (e) {
            console.error('Failed to delete folder:', e);
        }
    };

    const handleRenameFolder = (id) => {
        const folder = folders.find(f => f.id === id);
        if (folder) {
            const newName = prompt('Enter a new name for this folder:', folder.name);
            if (newName) {
                renameFolder(id, newName).catch(e => console.error('Failed to rename folder:', e));
            }
        }
    };

    return (
        <>
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
                    <input type="text" className="folder-search" id="folderSearch" placeholder="Search folders..." autoComplete="off" />
                    <div id="folderList">
                        {folders.map(folder => {
                            const count = tools.filter(t => t.folder_id === folder.id).length;
                            const isActive = currentView === 'folder' && currentFolderId === folder.id;
                            return (
                                <div key={folder.id} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => switchView('folder', folder.id)}>
                                    <span className="nav-icon">📁</span>
                                    <span>{esc(folder.name)}</span>
                                    <div className="nav-actions">
                                        <button className="nav-action-btn" onClick={(e) => { e.stopPropagation(); handleRenameFolder(folder.id); }} title="Rename">✎</button>
                                        <button className="nav-action-btn delete" onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }} title="Delete">🗑</button>
                                    </div>
                                    <span className="nav-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                    <button className="new-folder-btn" onClick={handleCreateFolder}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        New Folder
                    </button>
                </div>
            </aside>
            <FolderModal 
                isOpen={folderModalOpen} 
                onClose={() => setFolderModalOpen(false)} 
                onSave={handleSaveFolder}
            />
            <ConfirmModal 
                isOpen={confirmModalOpen}
                onClose={() => { setConfirmModalOpen(false); setFolderToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete Folder"
                message={`Are you sure you want to delete this folder and all ${tools.filter(t => t.folder_id === folderToDelete).length} links inside?`}
            />
        </>
    );
}
