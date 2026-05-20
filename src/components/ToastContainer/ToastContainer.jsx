import { useEffect, useState } from 'react';
import './ToastContainer.css';

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        window.showToast = (message, type = 'success') => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 3000);
        };
    }, []);

    return (
        <div className="toast-container" id="toastContainer">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast ${toast.type} show`}>
                    <span>{toast.type === 'success' ? '✓' : '✕'}</span>
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
