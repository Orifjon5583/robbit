import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function GroupModal({ isOpen, onClose, onSave, group = null }) {
    const [name, setName] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchTeachers();
            if (group) {
                setName(group.name);
                setTeacherId(group.teacher_id || 'null'); // Handle null teacher
            } else {
                setName('');
                setTeacherId('');
            }
        }
    }, [isOpen, group]);

    const fetchTeachers = async () => {
        try {
            const res = await api.get('/api/users?role=teacher');
            setTeachers(res.data);
        } catch (err) {
            console.error('Failed to fetch teachers', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                teacherId: teacherId === 'null' ? null : parseInt(teacherId)
            };

            let res;
            if (group) {
                // Edit
                // Try POST /edit instead of PUT to avoid 404 issues
                res = await api.post(`/api/groups/${group.id}/edit`, payload);
            } else {
                // Create
                res = await api.post('/api/groups', payload);
            }
            onSave(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save group');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content card" style={{ width: '400px', margin: 0 }}>
                <h3>{group ? 'Guruhni Tahrirlash' : 'Yangi Guruh'}</h3>
                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Guruh Nomi
                        <input
                            type="text"
                            placeholder="Masalan: 5-A Sinf"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            style={{ marginTop: '5px' }}
                        />
                    </label>

                    <label style={{ display: 'block', marginBottom: '20px' }}>
                        Biriktirilgan O‘qituvchi
                        <select
                            value={teacherId}
                            onChange={e => setTeacherId(e.target.value)}
                            style={{ marginTop: '5px', width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
                        >
                            <option value="">Tanlang...</option>
                            <option value="null">Biriktirilmagan</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.full_name || t.username}</option>
                            ))}
                        </select>
                    </label>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Saqlash</button>
                        <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Bekor Qilish</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
