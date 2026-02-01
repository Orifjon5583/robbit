import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function AnalyticsView() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            // In a real app we might have a robust endpoint for this.
            // For now we use the /analytics/teacher endpoint again or similar.
            // Let's assume /analytics/admin gives global for now, simulating teacher view with mock data if needed?
            // Actually we have /analytics/student/:id and /analytics/group/:id
            // Let's list groups and their average scores? 
            // Simplification: Just show raw JSON stats for now or a simple summary.
            try {
                const res = await api.get('/analytics/teacher');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div>Loading Analytics...</div>;

    return (
        <div className="analytics-view">
            <h3>Class Performance</h3>
            <div className="stat-box">
                <h4>Total Tasks Created</h4>
                <p>{stats.totalTasks}</p>
            </div>
            {/* Extended stats could go here */}
        </div>
    )
}
