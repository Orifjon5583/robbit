import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Eye, Trash2, FolderKanban, Edit, Plus } from 'lucide-react';
import GroupModal from './GroupModal';

export default function GroupList({ onViewDetails }) {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/api/groups');
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Guruhni o‘chirib yubormoqchimisiz?')) return;
    try {
      await api.delete(`/api/groups/${id}`);
      fetchGroups();
    } catch (err) {
      alert('O‘chirishda xatolik');
    }
  };

  const handleEdit = (e, group) => {
    e.stopPropagation();
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    fetchGroups();
  };

  return (
    <div className="group-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Mavjud Guruhlar</h3>
        <button className="btn-primary" onClick={handleCreate}>
          <Plus size={18} style={{ marginRight: '5px' }} /> Guruh Yaratish
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {groups.map(g => (
          <div key={g.id} className="card" style={{ margin: 0, cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => onViewDetails(g.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                  <FolderKanban size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{g.name}</h4>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>O‘qituvchi: <span style={{ color: 'var(--text-main)' }}>{g.teacher_name || 'Yo‘q'}</span></p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-secondary" style={{ padding: '0.5rem' }} onClick={(e) => { e.stopPropagation(); onViewDetails(g.id); }} title="Ko'rish">
                <Eye size={18} />
              </button>
              <button className="btn-secondary" style={{ padding: '0.5rem' }} onClick={(e) => handleEdit(e, g)} title="Tahrirlash">
                <Edit size={18} />
              </button>
              <button className="btn-secondary" style={{ padding: '0.5rem', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={(e) => handleDelete(e, g.id)} title="O'chirish">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {groups.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>Guruhlar mavjud emas</p>}

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        group={editingGroup}
      />
    </div>
  )
}
