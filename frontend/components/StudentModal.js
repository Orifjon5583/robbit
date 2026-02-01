import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function StudentModal({ isOpen, onClose, onSave, student = null }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [role, setRole] = useState('student'); // Default to student
    const [error, setError] = useState('');

    useEffect(() => {
        if (student) {
            setUsername(student.username);
            setFullName(student.full_name || '');
            setAge(student.age || '');
            setRole(student.role || 'student');
            setPassword(''); // Don't show password, only set if changing
        } else {
            setUsername('');
            setPassword('');
            setFullName('');
            setAge('');
            setRole('student');
        }
        setError('');
    }, [student, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { username, role, fullName, age: parseInt(age) };
            if (password) payload.password = password;

            let res;
            if (student) {
                // Edit
                res = await api.put(`/api/users/${student.id}`, payload);
            } else {
                // Create
                if (!password) {
                    setError('Password is required for new users');
                    return;
                }
                res = await api.post('/api/auth/register', { ...payload, password });
            }
            onSave(res.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save student');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content card" style={{ width: '400px', margin: 0 }}>
                <h3>{student ? 'O‘quvchini Tahrirlash' : 'Yangi O‘quvchi'}</h3>
                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                        placeholder={student ? "Yangi Parol (ixtiyoriy)" : "Parol"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required={!student}
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
