import { useApp } from '../../context/AppContext';
import './EmptyState.css';

export default function EmptyState() {
    const { tools } = useApp();

    return (
        <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No links found</h3>
            <p>{tools.length === 0 ? 'Add your first link above. Paste any URL and it will be analyzed automatically.' : 'No links match your current filter or search.'}</p>
        </div>
    );
}
