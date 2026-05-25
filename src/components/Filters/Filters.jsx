import { useApp } from '../../context/AppContext';
import { TAG_LABELS } from '../../utils/helpers';
import ReorderIcon from '../../assets/ReorderIcon.svg';
import SelectIcon from '../../assets/SelectIcon.svg';
import './Filters.css';

export default function Filters() {
    const { currentView, activeFilters, setActiveFilters, searchQuery, setSearchQuery, displayMode, setDisplayMode, selectMode, toggleSelectMode, reorderMode, toggleReorderMode } = useApp();

    const handleFilterClick = (filter) => {
        if (filter === 'all') {
            setActiveFilters(['all']);
        } else {
            const newFilters = activeFilters.filter(f => f !== 'all');
            
            if (newFilters.includes(filter)) {
                // Remove the filter if already selected
                const updated = newFilters.filter(f => f !== filter);
                setActiveFilters(updated.length === 0 ? ['all'] : updated);
            } else {
                // Add the filter
                setActiveFilters([...newFilters, filter]);
            }
        }
    };

    if (currentView === 'folder') {
        return (
            <div className="toolbar" id="toolbar">
                <div className="filters" id="filterSection">
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
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        className={`icon-btn ${reorderMode ? 'active' : ''}`}
                        onClick={toggleReorderMode}
                        title="Reorder"
                    >
                        <img src={ReorderIcon} alt="Reorder" />
                    </button>
                    <button
                        className={`icon-btn ${selectMode ? 'active' : ''}`}
                        onClick={toggleSelectMode}
                        title={selectMode ? 'Cancel selection' : 'Select items'}
                    >
                        <img src={SelectIcon} alt="Select" />
                    </button>
                </div>
            </div>
        );
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
                        autoComplete="off"
                    />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                    className={`icon-btn ${reorderMode ? 'active' : ''}`}
                    onClick={toggleReorderMode}
                    title="Reorder"
                >
                    <img src={ReorderIcon} alt="Reorder" />
                </button>
                <button
                    className={`icon-btn ${selectMode ? 'active' : ''}`}
                    onClick={toggleSelectMode}
                    title={selectMode ? 'Cancel selection' : 'Select items'}
                >
                    <img src={SelectIcon} alt="Select" />
                </button>
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
