import { useState, useEffect, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { extractMetadata, normalizeTags } from './utils/helpers';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import AuthScreen from './components/AuthScreen/AuthScreen';
import UserBar from './components/UserBar/UserBar';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import StatsBar from './components/StatsBar/StatsBar';
import UrlInput from './components/UrlInput/UrlInput';
import Filters from './components/Filters/Filters';
import ToolCard from './components/ToolCard/ToolCard';
import ToolRow from './components/ToolRow/ToolRow';
import Modal from './components/Modal/Modal';
import BulkActionBar from './components/BulkActionBar/BulkActionBar';
import FolderPickerModal from './components/FolderPickerModal/FolderPickerModal';
import ConfirmModal from './components/ConfirmModal/ConfirmModal';
import ToastContainer from './components/ToastContainer/ToastContainer';
import EmptyState from './components/EmptyState/EmptyState';
import './main.css';

function AppContent() {
    const {
        user, loading, tools, folders, currentView, currentFolderId,
        activeFilters, searchQuery, displayMode,
        setCurrentView, setCurrentFolderId, setActiveFilters, setSearchQuery, setDisplayMode,
        insertTool, updateToolInDB, deleteToolFromDB, createFolder, renameFolder, deleteFolder,
        getUser,
        selectMode, selectedItems, toggleSelectMode, clearSelection, toggleSelection
    } = useApp();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalTool, setModalTool] = useState(null);
    const [modalEditing, setModalEditing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [folderPickerOpen, setFolderPickerOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const menuBtn = document.getElementById('menuBtn');
            if (window.innerWidth <= 768) {
                if (menuBtn) menuBtn.style.display = 'block';
            } else {
                if (menuBtn) menuBtn.style.display = 'none';
                setSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.getElementById('menuBtn');
            if (window.innerWidth <= 768 && sidebarOpen) {
                if (sidebar && !sidebar.contains(e.target) && e.target !== menuBtn) {
                    setSidebarOpen(false);
                }
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [sidebarOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setModalOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleSidebarMobile = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const switchView = (view, folderId = null) => {
        setCurrentView(view);
        setCurrentFolderId(folderId);
        if (view === 'folder' && folderId) {
            incrementFolderUsage(folderId);
        }
    };

    const handleSubmit = async (url) => {
        try {
            const metadata = await extractMetadata(url);
            if (currentView === 'folder' && currentFolderId) {
                metadata.folder_id = currentFolderId;
            }
            setModalTool(metadata);
            setModalEditing(false);
            setModalOpen(true);
        } catch(err) {
            const fallback = {
                name: '',
                description: '',
                tags: ['productivity'],
                benefits: [],
                url,
                icon: '',
                source: 'Manual',
                folder_id: currentView === 'folder' ? currentFolderId : null
            };
            setModalTool(fallback);
            setModalEditing(false);
            setModalOpen(true);
        }
    };

    const doSave = async (tool) => {
        try {
            const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
            const newTool = { ...tool, id: generateId(), added_at: new Date().toISOString() };
            await insertTool(newTool);
            window.showToast(`${tool.name} added to registry`, 'success');
            setModalOpen(false);
        } catch(e) {
            window.showToast(e.message || 'Save failed', 'error');
        }
    };

    const doUpdate = async (tool) => {
        try {
            await updateToolInDB(tool);
            window.showToast(`${tool.name} updated`, 'success');
            setModalOpen(false);
        } catch(e) {
            window.showToast(e.message || 'Update failed', 'error');
        }
    };

    const editTool = (id) => {
        const tool = tools.find(t => t.id === id);
        if (tool) {
            setModalTool({ ...tool, tags: normalizeTags(tool.tags) });
            setModalEditing(true);
            setModalOpen(true);
        }
    };

    const removeToolById = async (id) => {
        try {
            await deleteToolFromDB(id);
            window.showToast('Link removed', 'error');
        } catch(e) {
            window.showToast('Could not remove link', 'error');
        }
    };

    const createFolderPrompt = () => {
        const name = prompt('Enter a name for your new folder:');
        if (name) {
            createFolder(name).then(() => {
                window.showToast('Folder created', 'success');
            }).catch(e => {
                window.showToast(e.message || 'Failed to create folder', 'error');
            });
        }
    };

    const renameFolderPrompt = (id) => {
        const folder = folders.find(f => f.id === id);
        if (folder) {
            const newName = prompt('Enter a new name for this folder:', folder.name);
            if (newName) {
                renameFolder(id, newName).then(() => {
                    window.showToast('Folder renamed', 'success');
                }).catch(e => {
                    window.showToast(e.message || 'Failed to rename folder', 'error');
                });
            }
        }
    };

    const deleteFolderPrompt = (id) => {
        const folder = folders.find(f => f.id === id);
        if (folder) {
            const count = tools.filter(t => t.folder_id === id).length;
            if (confirm(`Delete "${folder.name}" and all ${count} links inside?`)) {
                deleteFolder(id).then(() => {
                    window.showToast('Folder deleted', 'error');
                }).catch(e => {
                    window.showToast(e.message || 'Failed to delete folder', 'error');
                });
            }
        }
    };

    const exportJSON = () => {
        const data = tools.map(t => ({
            name: t.name,
            url: t.url,
            description: t.description,
            tags: normalizeTags(t.tags),
            benefits: t.benefits || [],
            icon: t.icon,
            source: t.source,
            folder_id: t.folder_id,
            added_at: t.added_at
        }));

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `link-house-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.showToast('JSON exported successfully', 'success');
    };

    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            const count = selectedItems.size;
            for (const toolId of selectedItems) {
                await deleteToolFromDB(toolId);
            }
            clearSelection();
            toggleSelectMode();
            setConfirmDeleteOpen(false);
            window.showToast(`${count} items deleted`, 'error');
        } catch (e) {
            window.showToast('Failed to delete items', 'error');
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const handleMoveToFolder = async (folderId) => {
        try {
            const itemsToUpdate = tools.filter(t => selectedItems.has(t.id));
            for (const tool of itemsToUpdate) {
                await updateToolInDB({ ...tool, folder_id: folderId });
            }
            clearSelection();
            toggleSelectMode();
            window.showToast(`${itemsToUpdate.length} items moved`, 'success');
        } catch (e) {
            window.showToast('Failed to move items', 'error');
        }
    };

    const getFiltered = () => {
        let f = tools;
        
        if (currentView === 'loose') {
            f = f.filter(t => !t.folder_id);
        } else if (currentView === 'folder') {
            f = f.filter(t => t.folder_id === currentFolderId);
        }
        
        if (!activeFilters.includes('all')) {
            f = f.filter(t => {
                const toolTags = Array.isArray(t.tags) ? t.tags : [];
                return activeFilters.every(filter => toolTags.includes(filter));
            });
        }
        
        if (searchQuery) { 
            const q = searchQuery.toLowerCase(); 
            f = f.filter(t => 
                (t.name || '').toLowerCase().includes(q) || 
                (t.description || '').toLowerCase().includes(q) || 
                (t.benefits || []).some(b => b.toLowerCase().includes(q))
            ); 
        }
        return f;
    };

    const filteredTools = useMemo(() => getFiltered(), [tools, currentView, currentFolderId, activeFilters, searchQuery]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return <AuthScreen />;
    }

    return (
        <>
            <div className="bg-noise"></div>
            <div className="bg-glow"></div>
            
            <UserBar 
                toggleSidebarMobile={toggleSidebarMobile} 
                exportJSON={exportJSON}
            />
            
            <div className="app-layout" id="appLayout">
                <Sidebar 
                    switchView={switchView}
                    createFolder={createFolder}
                    renameFolder={renameFolder}
                    deleteFolder={deleteFolder}
                />
                
                <main className="main-content" id="mainContent">
                    <Header />
                    <StatsBar />
                    <UrlInput handleSubmit={handleSubmit} />
                    <Filters />
                    
                    {displayMode === 'grid' ? (
                        <div className="tools-grid" id="toolsGrid">
                            {filteredTools.length === 0 ? (
                                <EmptyState />
                            ) : (
                                filteredTools.map(tool => (
                                    <ToolCard key={tool.id} tool={tool} editTool={editTool} removeToolById={removeToolById} selectMode={selectMode} selectedItems={selectedItems} toggleSelection={toggleSelection} />
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="tools-list" id="toolsList">
                            {filteredTools.length === 0 ? (
                                <EmptyState />
                            ) : (
                                filteredTools.map(tool => (
                                    <ToolRow key={tool.id} tool={tool} editTool={editTool} removeToolById={removeToolById} selectMode={selectMode} selectedItems={selectedItems} toggleSelection={toggleSelection} />
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
            
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                tool={modalTool || {}}
                isEditing={modalEditing}
                doSave={doSave}
                doUpdate={doUpdate}
            />

            <BulkActionBar
                onDeleteClick={() => setConfirmDeleteOpen(true)}
                onMoveToFolderClick={() => setFolderPickerOpen(true)}
                isDeleting={isBulkDeleting}
            />

            <FolderPickerModal
                isOpen={folderPickerOpen}
                onClose={() => setFolderPickerOpen(false)}
                onFolderSelect={handleMoveToFolder}
            />

            <ConfirmModal
                isOpen={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleBulkDelete}
                title="Delete Selected Items"
                message={`Are you sure you want to delete ${selectedItems.size} selected ${selectedItems.size === 1 ? 'item' : 'items'}? This action cannot be undone.`}
            />

            <ToastContainer />
        </>
    );
}

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
