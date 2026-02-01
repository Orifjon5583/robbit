import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import GroupList from './GroupList';
import UserList from './UserList';
import GroupDetails from './GroupDetails';
import Sidebar from './Sidebar';
import { getUser } from '../utils/auth';
import { LayoutDashboard, Users, FolderKanban } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [view, setView] = useState('overview'); // 'overview', 'users', 'groups'
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const handlegroupClick = (groupId) => {
        setSelectedGroupId(groupId);
        setView('group-details');
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/analytics/admin');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar
                role="super_admin"
                activeView={view}
                onViewChange={setView}
                user={{ username: 'Admin' }} // Mock or fetch user
            />

            <main className="main-content">
                {view === 'overview' && stats && (
                    <div className="stats-cards">
                        <div className="card">
                            <h3>Foydalanuvchilar</h3>
                            <p className="highlight-text">{stats.totalUsers}</p>
                            <span className="sub-text">Jami</span>
                        </div>
                        <div className="card">
                            <h3>Guruhlar</h3>
                            <p className="highlight-text">{stats.totalGroups}</p>
                            <span className="sub-text">Jami</span>
                        </div>
                    </div>
                )}

                {view === 'groups' && (
                    <div className="card">
                        <div style={{ marginBottom: '20px' }}>
                            {/* Potential place for "Create Group" button if needed */}
                        </div>
                        <GroupList onViewDetails={handlegroupClick} />
                    </div>
                )}

                {view === 'users' && (
                    <div className="card">
                        <UserList />
                    </div>
                )}

                {view === 'group-details' && selectedGroupId && (
                    <div className="card">
                        <GroupDetails
                            groupId={selectedGroupId}
                            onBack={() => setView('groups')}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
