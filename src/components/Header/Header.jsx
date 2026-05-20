import { useApp } from '../../context/AppContext';
import './Header.css';

export default function Header() {
    const { currentView, currentFolderId, folders } = useApp();

    const getTitle = () => {
        if (currentView === 'folder') {
            const folder = folders.find(f => f.id === currentFolderId);
            return folder ? folder.name : 'Folder';
        }
        return 'Link House';
    };

    const getSubtitle = () => {
        if (currentView === 'folder') {
            return 'Links in this folder';
        }
        if (currentView === 'loose') {
            return 'Unfiled Links — tag and organize them';
        }
        return 'All your Links across every folder';
    };

    return (
        <header className="header">
            <div className="header-badge">Microlink Metadata</div>
            <h1 id="pageTitle">{getTitle()}</h1>
            <p id="pageSubtitle">{getSubtitle()}</p>
        </header>
    );
}
