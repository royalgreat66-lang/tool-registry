import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { esc, ALL_TAGS, TAG_LABELS } from '../../utils/helpers';
import Spinner from '../Spinner/Spinner';
import './Modal.css';

export default function Modal({ isOpen, onClose, tool, isEditing, doSave, doUpdate }) {
    const { folders } = useApp();
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const selectedTags = Array.from(document.querySelectorAll('#f-tags .tag-pill-btn.selected')).map(btn => btn.dataset.tag);
        const benefits = Array.from(document.querySelectorAll('#f-benefits input')).map(i => i.value.trim()).filter(Boolean);
        
        const data = {
            name: formData.get('name'),
            url: formData.get('url'),
            description: formData.get('description'),
            folder_id: formData.get('folder') || null,
            tags: selectedTags,
            benefits,
            icon: tool.icon,
            source: tool.source
        };

        setIsSaving(true);
        try {
            if (isEditing) {
                await doUpdate({ ...tool, ...data });
            } else {
                await doSave({ ...tool, ...data });
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const folderOptions = folders.map(f => (
        <option key={f.id} value={f.id} selected={tool.folder_id === f.id}>{esc(f.name)}</option>
    ));

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEditing ? 'Edit Link' : 'Review & Edit Link'}</h3>
                    <p>Edit any field before saving to your registry.</p>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="field-group">
                            <label>Name</label>
                            <input name="name" className="field-input" defaultValue={tool.name} placeholder="Tool name" />
                        </div>
                        <div className="field-group">
                            <label>URL</label>
                            <input name="url" className="field-input" defaultValue={tool.url} placeholder="https://..." />
                        </div>
                        <div className="field-group">
                            <label>Description</label>
                            <textarea name="description" className="field-textarea" placeholder="What does this tool do?">{tool.description}</textarea>
                        </div>
                        <div className="field-group">
                            <label>Folder</label>
                            <select name="folder" className="field-select">
                                <option value="" selected={!tool.folder_id}>Loose (no folder)</option>
                                {folderOptions}
                            </select>
                        </div>
                        <div className="field-group">
                            <label>Tags</label>
                            <div className="tags-selector" id="f-tags">
                                {ALL_TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={`tag-pill-btn ${tool.tags?.includes(tag) ? 'selected' : ''}`}
                                        data-tag={tag}
                                        onClick={(e) => e.target.classList.toggle('selected')}
                                    >
                                        {TAG_LABELS[tag]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="field-group">
                            <label>Key Benefits</label>
                            <div className="benefits-editor" id="f-benefits">
                                {(tool.benefits || []).map((b, i) => (
                                    <div key={i} className="benefit-input-row">
                                        <input className="field-input" defaultValue={b} placeholder="e.g. Real-time collaboration" />
                                        <button type="button" className="remove-benefit-btn" onClick={(e) => e.target.parentElement.remove()}>✕</button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="add-benefit-btn" onClick={() => {
                                const container = document.getElementById('f-benefits');
                                const div = document.createElement('div');
                                div.className = 'benefit-input-row';
                                div.innerHTML = '<input class="field-input" placeholder="e.g. Real-time collaboration" /><button type="button" class="remove-benefit-btn" onclick="this.parentElement.remove()">✕</button>';
                                container.appendChild(div);
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                Add benefit
                            </button>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>Cancel</button>
                            <button type="submit" className="btn-save" disabled={isSaving}>
                                {isSaving ? <span className="btn-spinner"></span> : (isEditing ? 'Update Tool' : 'Save to Registry')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
