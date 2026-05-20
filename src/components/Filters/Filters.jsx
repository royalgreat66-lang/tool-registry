import { useApp } from '../../context/AppContext';
import { TAG_LABELS } from '../../utils/helpers';
import './Filters.css';

export default function Filters() {
    const { currentView, activeFilters, setActiveFilters, searchQuery, setSearchQuery, displayMode, setDisplayMode } = useApp();

    const handleFilterClick = (filter) => {
        if (filter === 'all') {
            setActiveFilters(['all']);
        } else {
            const newFilters = activeFilters.filter(f => f !== 'all');
            
            if (newFilters.includes(filter)) {
                setActiveFilters(newFilters.filter(f => f !== filter));
            } else {
                setActiveFilters([...newFilters, filter]);
            }
            
            if (activeFilters.filter(f => f !== 'all').length === 0 && !newFilters.includes(filter)) {
                setActiveFilters(['all']);
            }
        }
    };

    if (currentView === 'folder') {
        return null;
    }

    return (
        <div className="toolbar" id="toolbar">
            <div className="filters" id="filterSection">
                <div className="filter-group" id="filterGroup">
                    <button 
                        className={`filter-btn ${activeFilters.includes('all') ? 'active' : ''}`} 
                        onClick={() => handleFilterClick('all')}
                    >
                        All Links
                    </button>
                    {Object.keys(TAG_LABELS).map(tag => (
                        <button
                            key={tag}
                            className={`filter-btn ${activeFilters.includes(tag) ? 'active' : ''}`}
                            onClick={() => handleFilterClick(tag)}
                        >
                            {TAG_LABELS[tag]}
                        </button>
                    ))}
                </div>
                <div className="search-box">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Links..."
                    />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div className="view-toggle">
                    <button 
                        className={`view-btn ${displayMode === 'grid' ? 'active' : ''}`} 
                        onClick={() => setDisplayMode('grid')} 
                        title="Grid view"
                    >
                        ▦
                    </button>
                    <button 
                        className={`view-btn ${displayMode === 'list' ? 'active' : ''}`} 
                        onClick={() => setDisplayMode('list')} 
                        title="List view"
                    >
                        ☰
                    </button>
                </div>
            </div>
        </div>
    );
}
