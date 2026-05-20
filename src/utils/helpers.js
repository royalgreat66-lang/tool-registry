export const ALL_TAGS = ['ai', 'dev', 'productivity', 'design', 'software', 'entertainment'];

export const TAG_LABELS = {
    ai: 'AI',
    dev: 'Development',
    productivity: 'Productivity',
    design: 'Design',
    software: 'Software',
    entertainment: 'Entertainment'
};

export function normalizeTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
        try { 
            const parsed = JSON.parse(tags); 
            if (Array.isArray(parsed)) return parsed; 
        } catch(e) {}
        return tags.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
}

export function esc(str) { 
    return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); 
}

export function getTimeAgo(date) {
    if(isNaN(date)) return 'Just now';
    const s = Math.floor((new Date() - date) / 1000);
    for(const [u, sec] of Object.entries({year:31536000, month:2592000, week:604800, day:86400, hour:3600, minute:60})) {
        const n = Math.floor(s / sec);
        if(n >= 1) return `${n} ${u}${n > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
}

export async function extractMetadata(url) {
    const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();
    try {
        const r = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&timeout=8000`);
        if (r.ok) {
            const d = await r.json();
            if (d.status === 'success' && d.data) {
                return { 
                    name: d.data.title ? d.data.title.split(/[|–—·]/)[0].trim() : domain, 
                    description: d.data.description || '', 
                    tags: ['productivity'], 
                    benefits: [], 
                    url, 
                    icon: d.data.logo?.url || d.data.image?.url || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`, 
                    source: 'Microlink',
                    folder_id: null
                };
            }
        }
    } catch(e) {}
    return { 
        name: '', 
        description: '', 
        tags: ['productivity'], 
        benefits: [], 
        url, 
        icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`, 
        source: 'Manual',
        folder_id: null
    };
}
