import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import TaskList from './TaskList';
import CreateTaskForm from './CreateTaskForm';
import AssignmentForm from './AssignmentForm';
import AnalyticsView from './AnalyticsView';

export default function TeacherDashboard() {
    const [view, setView] = useState('overview'); // 'tasks', 'create-task', 'assign', 'analytics'
    const [stats, setStats] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null); // For assignment

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/teacher');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const handleAssignClick = (taskId) => {
        setSelectedTaskId(taskId);
        setView('assign');
    };

    return (
        <div className="teacher-dashboard">
            <nav style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0' }}>
                <button onClick={() => setView('overview')} style={{ marginRight: '10px' }}>Overview</button>
                <button onClick={() => setView('tasks')} style={{ marginRight: '10px' }}>My Tasks</button>
                <button onClick={() => setView('create-task')} style={{ marginRight: '10px' }}>Create Task</button>
                <button onClick={() => setView('analytics')}>Analytics</button>
                {/* 'assign' view is hidden from nav, accessed via Task List */}
            </nav>

            <div className="dashboard-content">
                {view === 'overview' && stats && (
                    <div className="stats">
                        <h3>Teacher Overview</h3>
                        <p>Total Students: {stats.totalStudents || 0}</p>
                        <p>Tasks Created: {stats.totalTasks || 0}</p>
                    </div>
                )}

                {view === 'tasks' && (
                    <div className="tasks-view">
                        <h3>Task Library</h3>
                        <TaskList onAssign={handleAssignClick} />
                    </div>
                )}

                {view === 'create-task' && (
                    <CreateTaskForm onTaskCreated={() => setView('tasks')} />
                )}

                {view === 'assign' && selectedTaskId && (
                    <AssignmentForm
                        taskId={selectedTaskId}
                        onAssignmentCreated={() => setView('tasks')}
                    />
                )}

                {view === 'analytics' && <AnalyticsView />}
            </div>
        </div>
    );
}
