import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import GroupList from './GroupList';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [view, setView] = useState('overview'); // 'overview', 'users', 'groups'

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/admin');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">
            <nav>
                <button onClick={() => setView('overview')}>Overview</button>
                <button onClick={() => setView('groups')}>Groups</button>
                {/* <button onClick={() => setView('users')}>Users</button> */}
            </nav>

            {view === 'overview' && stats && (
                <div className="stats-cards">
                    <div className="card">
                        <h3>Total Users</h3>
                        <p>{stats.totalUsers}</p>
                    </div>
                    <div className="card">
                        <h3>Total Groups</h3>
                        <p>{stats.totalGroups}</p>
                    </div>
                </div>
            )}

            {view === 'groups' && (
                <GroupList />
                /* Add Group Creation Form Here if needed */
            )}
        </div>
    );
}
