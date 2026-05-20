import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn-danger" onClick={onConfirm}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
