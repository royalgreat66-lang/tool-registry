import { useApp } from '../../context/AppContext';
import { normalizeTags, getTimeAgo } from '../../utils/helpers';
import './StatsBar.css';

export default function StatsBar() {
    const { tools, folders, currentView, currentFolderId } = useApp();

    let displayTools, displayTags, displayFolders;

    if (currentView === 'loose') {
        displayTools = tools.filter(t => !t.folder_id).length;
        const allTags = new Set();
        tools.filter(t => !t.folder_id).forEach(t => normalizeTags(t.tags).forEach(tag => allTags.add(tag)));
        displayTags = allTags.size;
        displayFolders = 0;
    } else if (currentView === 'everything') {
        displayTools = tools.length;
        const allTags = new Set();
        tools.forEach(t => normalizeTags(t.tags).forEach(tag => allTags.add(tag)));
        displayTags = allTags.size;
        displayFolders = folders.length;
    } else {
        displayTools = tools.filter(t => t.folder_id === currentFolderId).length;
        displayTags = 0;
        displayFolders = 0;
    }

    const relevantTools = currentView === 'loose' ? tools.filter(t => !t.folder_id) : 
                         currentView === 'folder' ? tools.filter(t => t.folder_id === currentFolderId) : tools;
    const last = relevantTools[0];
    const lastAdded = last ? new Date(last.added_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

    return (
        <div className="stats-bar" id="statsBar">
            <div className="stat-item">
                <div className="stat-value" id="totalTools">{displayTools}</div>
                <div className="stat-label">Links</div>
            </div>
            {displayTags > 0 && (
                <div className="stat-item">
                    <div className="stat-value" id="totalTags">{displayTags}</div>
                    <div className="stat-label">Tags</div>
                </div>
            )}
            {displayFolders > 0 && (
                <div className="stat-item">
                    <div className="stat-value" id="totalFolders">{displayFolders}</div>
                    <div className="stat-label">Folders</div>
                </div>
            )}
            <div className="stat-item">
                <div className="stat-value" id="lastAdded">{lastAdded}</div>
                <div className="stat-label">Last Added</div>
            </div>
        </div>
    );
}
