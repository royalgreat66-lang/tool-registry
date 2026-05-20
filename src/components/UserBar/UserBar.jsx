import { db } from '../../utils/supabase';
import { useApp } from '../../context/AppContext';
import './UserBar.css';

export default function UserBar({ toggleSidebarMobile, exportJSON }) {
    const { user } = useApp();

    const handleSignOut = async () => {
        try { 
            await db.auth.signOut(); 
        } catch(e) {}
        window.location.reload();
    };

    return (
        <div id="userBar">
            <button 
                className="signout-btn" 
                onClick={toggleSidebarMobile} 
                style={{ display: 'none' }} 
                id="menuBtn"
            >
                ☰
            </button>
            <span id="userEmail">{user?.email || user?.user_metadata?.user_name || 'Signed in'}</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                    className="export-btn" 
                    onClick={exportJSON} 
                    title="Export all links to JSON" 
                    style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '0.78rem' }}
                >
                    ⬇ Export JSON
                </button>
                <button className="signout-btn" id="signOutBtn" onClick={handleSignOut}>
                    Sign out
                </button>
            </div>
        </div>
    );
}
