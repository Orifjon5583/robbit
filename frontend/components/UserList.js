import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Edit, Trash2, User, GraduationCap, Shield } from 'lucide-react';
import UserModal from './UserModal';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'teacher', 'student'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            const url = roleFilter === 'all' ? '/api/users' : `/api/users?role=${roleFilter}`;
            const res = await api.get(url);
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Foydalanuvchini o‘chirib yubormoqchimisiz?')) return;
        try {
            await api.delete(`/api/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert('O‘chirishda xatolik: ' + (err.response?.data?.error || 'Server xatosi'));
        }
    };

    const handleSave = () => {
        fetchUsers();
    };

    return (
        <div className="user-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={`btn-secondary ${roleFilter === 'all' ? 'active-filter' : ''}`}
                        onClick={() => setRoleFilter('all')}
                        style={roleFilter === 'all' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}
                    >
                        Barchasi
                    </button>
                    <button
                        className={`btn-secondary ${roleFilter === 'teacher' ? 'active-filter' : ''}`}
                        onClick={() => setRoleFilter('teacher')}
                        style={roleFilter === 'teacher' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}
                    >
                        O‘qituvchilar
                    </button>
                    <button
                        className={`btn-secondary ${roleFilter === 'student' ? 'active-filter' : ''}`}
                        onClick={() => setRoleFilter('student')}
                        style={roleFilter === 'student' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}
                    >
                        O‘quvchilar
                    </button>
                </div>
                <button className="btn-primary" onClick={handleCreate}>
                    <Plus size={18} style={{ marginRight: '5px' }} /> Yangi Foydalanuvchi
                </button>
            </div>

            <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '15px' }}>Foydalanuvchi</th>
                            <th style={{ padding: '15px' }}>Login</th>
                            <th style={{ padding: '15px' }}>Rol</th>
                            <th style={{ padding: '15px' }}>Yosh</th>
                            <th style={{ padding: '15px', textAlign: 'right' }}>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: user.role === 'super_admin' ? 'var(--danger)' : user.role === 'teacher' ? 'var(--primary)' : 'var(--success)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                    }}>
                                        {user.role === 'super_admin' ? <Shield size={16} /> : user.role === 'teacher' ? <GraduationCap size={16} /> : <User size={16} />}
                                    </div>
                                    {user.full_name}
                                </td>
                                <td style={{ padding: '15px', color: 'var(--text-dim)' }}>@{user.username}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                        background: user.role === 'teacher' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: user.role === 'teacher' ? 'var(--primary)' : 'var(--success)'
                                    }}>
                                        {user.role === 'teacher' ? 'O‘qituvchi' : user.role === 'student' ? 'O‘quvchi' : 'Admin'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>{user.age || '-'}</td>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    {user.role !== 'super_admin' && (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                            <button className="btn-secondary" style={{ padding: '5px' }} onClick={() => handleEdit(user)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn-secondary" style={{ padding: '5px', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleDelete(user.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)' }}>Foydalanuvchilar topilmadi</p>}
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                user={editingUser}
                defaultRole={roleFilter === 'teacher' ? 'teacher' : 'student'}
            />
        </div>
    );
}
