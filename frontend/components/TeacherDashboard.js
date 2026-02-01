import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import TaskList from './TaskList';
import CreateTaskForm from './CreateTaskForm';
import AssignmentForm from './AssignmentForm';
import AnalyticsView from './AnalyticsView';
import Sidebar from './Sidebar';
import { getUser } from '../utils/auth';
import { LayoutDashboard, BookOpen, PlusCircle, BarChart2 } from 'lucide-react';

export default function TeacherDashboard() {
    const [view, setView] = useState('overview'); // 'tasks', 'create-task', 'assign', 'analytics'
    const [stats, setStats] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null); // For assignment

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/analytics/teacher');
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
        <div className="dashboard-container">
            <Sidebar
                role="teacher"
                activeView={view}
                onViewChange={setView}
                user={getUser()}
            />

            <main className="main-content">
                {view === 'overview' && stats && (
                    <div className="stats-cards">
                        <div className="card">
                            <h3>O‘qituvchi Statistikasi</h3>
                            <p className="highlight-text">{stats.totalStudents || 0}</p>
                            <span className="sub-text">O‘quvchilar</span>
                        </div>
                        <div className="card">
                            <h3>Vazifalar</h3>
                            <p className="highlight-text">{stats.totalTasks || 0}</p>
                            <span className="sub-text">Yaratilgan</span>
                        </div>
                    </div>
                )}

                {view === 'tasks' && (
                    <div className="card">
                        <h3>Vazifalar Kutubxonasi</h3>
                        <TaskList onAssign={handleAssignClick} />
                    </div>
                )}

                {view === 'create-task' && (
                    <div className="card">
                        <CreateTaskForm onTaskCreated={() => setView('tasks')} />
                    </div>
                )}

                {view === 'assign' && (
                    <div className="card">
                        <button onClick={() => setView('tasks')} className="btn-secondary" style={{ marginBottom: '1rem' }}>
                            &larr; Orqaga
                        </button>
                        <AssignmentForm taskId={selectedTaskId} onAssignmentCreated={() => setView('tasks')} />
                    </div>
                )}

                {view === 'analytics' && (
                    <div className="card">
                        <AnalyticsView />
                    </div>
                )}
            </main>
        </div>
    );
}
