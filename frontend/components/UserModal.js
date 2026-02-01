import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function UserModal({ isOpen, onClose, onSave, user = null, defaultRole = 'student' }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [role, setRole] = useState(defaultRole);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setFullName(user.full_name || '');
            setAge(user.age || '');
            setRole(user.role || defaultRole);
            setPassword('');
        } else {
            setUsername('');
            setPassword('');
            setFullName('');
            setAge('');
            setRole(defaultRole);
        }
        setError('');
    }, [user, isOpen, defaultRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { username, role, fullName, age: parseInt(age) };
            if (password) payload.password = password;

            let res;
            if (user) {
                // Edit
                res = await api.put(`/api/users/${user.id}`, payload);
            } else {
                // Create
                if (!password) {
                    setError('Yangi foydalanuvchi uchun parol majburiy');
                    return;
                }
                res = await api.post('/api/auth/register', { ...payload, password });
            }
            onSave(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Saqlashda xatolik');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content card" style={{ width: '400px', margin: 0 }}>
                <h3>{user ? 'Foydalanuvchini Tahrirlash' : 'Yangi Foydalanuvchi'}</h3>
                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Rol
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            style={{ marginTop: '5px' }}
                        >
                            <option value="student">O‘quvchi</option>
                            <option value="teacher">O‘qituvchi</option>
                        </select>
                    </label>

                    <input
                        type="text"
                        placeholder="Login (Username)"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Ism Familiya"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Yosh"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder={user ? "Yangi Parol (ixtiyoriy)" : "Parol"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required={!user}
                    />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Saqlash</button>
                        <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Bekor Qilish</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
