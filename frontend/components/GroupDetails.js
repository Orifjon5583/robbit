import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import StudentModal from './StudentModal'; // Restored
import GroupModal from './GroupModal';
import { Users, Trash2, Edit, Plus } from 'lucide-react';

export default function GroupDetails({ groupId, onBack }) {
    const [group, setGroup] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    const fetchGroupData = async () => {
        setLoading(true);
        try {
            const groupRes = await api.get(`/api/groups/${groupId}`);
            const studentsRes = await api.get(`/api/groups/${groupId}/students`);
            setGroup(groupRes.data);
            setStudents(studentsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveStudent = async (studentId) => {
        if (!confirm('Rostdan ham bu o‘quvchini guruhdan chiqarmoqchimisiz?')) return;
        try {
            await api.post('/api/groups/remove-student', { groupId, studentId });
            fetchGroupData();
        } catch (err) {
            alert('Xatolik yuz berdi');
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setIsStudentModalOpen(true);
    };

    const handleAddStudent = () => {
        setEditingStudent(null);
        setIsStudentModalOpen(true);
    };

    const handleStudentSave = async (studentData) => {
        // If it was a new student, we need to add them to the group
        if (!editingStudent) {
            try {
                await api.post('/api/groups/add-student', { groupId, studentId: studentData.id });
            } catch (err) {
                console.error('Failed to add student to group', err);
            }
        }
        fetchGroupData();
    };

    const handleGroupSave = () => {
        fetchGroupData();
    };

    if (loading) return <div>Yuklanmoqda...</div>;
    if (!group) return <div>Guruh topilmadi</div>;

    return (
        <div className="group-details">
            <button onClick={onBack} className="btn-secondary" style={{ marginBottom: '20px' }}>&larr; Orqaga</button>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h2 style={{ margin: 0 }}>{group.name}</h2>
                            <button className="btn-secondary" style={{ padding: '5px' }} onClick={() => setIsGroupModalOpen(true)} title="Guruhni Tahrirlash">
                                <Edit size={16} />
                            </button>
                        </div>
                        <p style={{ marginTop: '5px' }}>O‘qituvchi: {group.teacher_name || 'Biriktirilmagan'}</p>
                    </div>
                    <div className="stats-cards" style={{ gridTemplateColumns: '1fr', gap: '10px', minWidth: '200px' }}>
                        <div style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                            <h3>O‘quvchilar</h3>
                            <p className="highlight-text" style={{ fontSize: '2rem' }}>{students.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>O‘quvchilar Ro‘yxati</h3>
                    <button className="btn-primary" onClick={handleAddStudent}>
                        <Plus size={18} /> O‘quvchi Qo‘shish
                    </button>
                </div>

                <div className="students-list">
                    {students.map(student => (
                        <div key={student.id} className="block-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ background: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                    {student.full_name?.charAt(0) || student.username.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{student.full_name}</div>
                                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>@{student.username}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-secondary" onClick={() => handleEditStudent(student)} title="Tahrirlash">
                                    <Edit size={18} />
                                </button>
                                <button className="btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleRemoveStudent(student.id)} title="O'chirish">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {students.length === 0 && <p className="text-center">Guruhda o‘quvchilar yo‘q</p>}
                </div>
            </div>

            <StudentModal
                isOpen={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                onSave={handleStudentSave}
                student={editingStudent}
            />

            <GroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onSave={handleGroupSave}
                group={group}
            />
        </div>
    );
}
