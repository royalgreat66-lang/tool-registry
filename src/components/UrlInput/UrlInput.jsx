import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './UrlInput.css';

export default function UrlInput({ handleSubmit }) {
    const { currentView } = useApp();
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        
        let value = url.trim();
        if (!value.match(/^https?:\/\//i) && value.includes('.') && !value.includes(' ')) {
            value = 'https://' + value;
        }
        
        setIsProcessing(true);
        await handleSubmit(value);
        setUrl('');
        setIsProcessing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
    };

    if (currentView === 'folder') {
        return null;
    }

    return (
        <section className="input-section">
            <div className={`input-wrapper ${isProcessing ? 'processing' : ''} ${showSuccess ? 'success' : ''}`}>
                <div className="input-inner">
                    <div className="input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        className="url-input" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste a URL (e.g., https://linear.app)..." 
                        autoComplete="off"
                    />
                    <button className="submit-btn" disabled={isProcessing}>
                        {isProcessing ? <div className="spinner"></div> : <span>Analyze</span>}
                    </button>
                </div>
            </div>
            {showSuccess && (
                <div className="status-message success visible">
                    ✓ Analysis complete — review and edit below
                </div>
            )}
        </section>
    );
}
