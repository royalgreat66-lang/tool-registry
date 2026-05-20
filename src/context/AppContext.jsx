import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../utils/supabase';
import { normalizeTags } from '../utils/helpers';

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [tools, setTools] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentView, setCurrentView] = useState('loose');
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [activeFilters, setActiveFilters] = useState(['all']);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayMode, setDisplayMode] = useState('grid');
    const [loading, setLoading] = useState(true);

    // Get current user
    async function getUser() {
        const { data: { session } } = await db.auth.getSession();
        return session?.user || null;
    }

    // Load tools from database
    async function loadTools() {
        const currentUser = await getUser();
        if (!currentUser) return;
        try {
            const { data, error } = await db.from('tools').select('*').eq('user_id', currentUser.id).order('added_at', { ascending: false });
            if (error) throw error;
            setTools((data || []).map(t => ({...t, tags: normalizeTags(t.tags)})));
        } catch(e) { 
            console.error('Load error:', e); 
            setTools([]); 
        }
    }

    // Load folders from database
    async function loadFolders() {
        const currentUser = await getUser();
        if (!currentUser) return;
        try {
            const { data, error } = await db.from('folders').select('*').eq('user_id', currentUser.id).order('usage_count', { ascending: false, nullsFirst: false });
            if (error) throw error;
            setFolders((data || []).map(f => ({ ...f, usage_count: f.usage_count || 0 })));
            
            // Migrate existing folders that don't have usage_count
            await migrateFolderUsageCounts();
        } catch(e) { 
            console.error('Load folders error:', e); 
            setFolders([]); 
        }
    }

    // Migrate folder usage counts
    async function migrateFolderUsageCounts() {
        const currentUser = await getUser();
        if (!currentUser) return;
        
        try {
            const foldersNeedingMigration = folders.filter(f => f.usage_count === undefined || f.usage_count === null);
            
            if (foldersNeedingMigration.length > 0) {
                console.log(`Migrating ${foldersNeedingMigration.length} folders with usage_count...`);
                
                for (const folder of foldersNeedingMigration) {
                    try {
                        const { error } = await db.from('folders').update({ usage_count: 0 }).eq('id', folder.id);
                        if (error) throw error;
                        folder.usage_count = 0;
                    } catch(e) {
                        console.error(`Failed to migrate folder ${folder.id}:`, e);
                    }
                }
                
                // Re-sort after migration
                setFolders(prev => [...prev].sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0)));
            }
        } catch(e) {
            console.error('Migration error:', e);
        }
    }

    // Create new folder
    async function createFolder(name) {
        const currentUser = await getUser();
        if (!currentUser) throw new Error('Not signed in');
        const { data, error } = await db.from('folders').insert([{ name, user_id: currentUser.id, usage_count: 0 }]).select();
        if (error) throw error;
        if (data && data[0]) {
            setFolders(prev => [...prev, { ...data[0], usage_count: 0 }]);
        }
        return data?.[0];
    }

    // Rename folder
    async function renameFolder(id, newName) {
        const { error } = await db.from('folders').update({ name: newName }).eq('id', id);
        if (error) throw error;
        setFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    }

    // Delete folder
    async function deleteFolder(id) {
        const { error } = await db.from('folders').delete().eq('id', id);
        if (error) throw error;
        setFolders(prev => prev.filter(f => f.id !== id));
        setTools(prev => prev.filter(t => t.folder_id !== id));
    }

    // Increment folder usage count
    async function incrementFolderUsage(folderId) {
        if (!folderId) return;
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;
        
        try {
            const newCount = (folder.usage_count || 0) + 1;
            const { error } = await db.from('folders').update({ usage_count: newCount }).eq('id', folderId);
            if (error) throw error;
            setFolders(prev => {
                const updated = prev.map(f => f.id === folderId ? { ...f, usage_count: newCount } : f);
                return [...updated].sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
            });
        } catch(e) {
            console.error('Failed to increment folder usage:', e);
        }
    }

    // Insert new tool
    async function insertTool(tool) {
        const currentUser = await getUser();
        if (!currentUser) throw new Error('Not signed in — please refresh the page');
        const { error } = await db.from('tools').insert([{ ...tool, user_id: currentUser.id }]);
        if (error) throw error;
    }

    // Update existing tool
    async function updateToolInDB(tool) {
        const currentUser = await getUser();
        if (!currentUser) throw new Error('Not signed in — please refresh the page');
        const { error } = await db.from('tools').update({ 
            name: tool.name, url: tool.url, description: tool.description, 
            tags: tool.tags, benefits: tool.benefits, icon: tool.icon, 
            source: tool.source, folder_id: tool.folder_id 
        }).eq('id', tool.id);
        if (error) throw error;
    }

    // Delete tool
    async function deleteToolFromDB(id) {
        const currentUser = await getUser();
        if (!currentUser) throw new Error('Not signed in — please refresh the page');
        const { error } = await db.from('tools').delete().eq('id', id);
        if (error) throw error;
    }

    // Initialize app
    useEffect(() => {
        async function init() {
            setLoading(true);
            const currentUser = await getUser();
            if (currentUser) {
                setUser(currentUser);
                await loadFolders();
                await loadTools();
            }
            setLoading(false);
        }
        init();
    }, []);

    const value = {
        user,
        tools,
        folders,
        currentView,
        setCurrentView,
        currentFolderId,
        setCurrentFolderId,
        activeFilters,
        setActiveFilters,
        searchQuery,
        setSearchQuery,
        displayMode,
        setDisplayMode,
        loading,
        loadTools,
        loadFolders,
        createFolder,
        renameFolder,
        deleteFolder,
        incrementFolderUsage,
        insertTool,
        updateToolInDB,
        deleteToolFromDB,
        getUser
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
