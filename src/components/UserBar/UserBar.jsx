import { useState } from 'react';
import { db } from '../../utils/supabase';
import { useApp } from '../../context/AppContext';
import Spinner from '../Spinner/Spinner';
import './UserBar.css';

export default function UserBar({ toggleSidebarMobile, exportJSON }) {
    const { user } = useApp();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try { 
            await db.auth.signOut(); 
        } catch(e) {}
        window.location.reload();
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportJSON();
        } catch(e) {
            console.error('Export error:', e);
        } finally {
            setIsExporting(false);
        }
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
                    onClick={handleExport} 
                    disabled={isExporting}
                    title="Export all links to JSON" 
                    style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '0.78rem' }}
                >
                    {isExporting ? <span className="btn-spinner"></span> : '⬇ Export JSON'}
                </button>
                <button className="signout-btn" id="signOutBtn" onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? <span className="btn-spinner"></span> : 'Sign out'}
                </button>
            </div>
        </div>
    );
}
