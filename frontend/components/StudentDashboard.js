import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function StudentDashboard() {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Determine logged in student ID from token or context? 
                // Currently API /assignments might return all for student if we update it?
                // Or we need endpoint /api/assignments that detects user role student and returns their assignments.
                // Checking assignmentController... yes, `getAssignments` handles student role.
                const res = await api.get('/api/assignments');
                setAssignments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAssignments();
    }, []);

    const totalScore = assignments.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const level = Math.floor(totalScore / 100) + 1;

    return (
        <div className="dashboard-container">
            {/* Sidebar for student if needed, or just layout */}
            {/* For now, assuming student sidebar items would be different or minimal. 
                 Let's reuse Sidebar component but we need to add student items to it first.
                 Or I can pass custom items maybe? Sidebar logic handles admin/teacher. 
                 Let's add 'student' role logic to Sidebar.js in next step if not present. */}

            <main className="main-content" style={{ marginLeft: '0', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Temporary centered layout for student since Sidebar not fully configured for student yet. 
                    Actually user asked for "Image 2" look which implies sidebar. 
                    I should add sidebar for student too. */}

                <div className="gamification-header" style={{
                    background: 'linear-gradient(135deg, #1e1b4b, #312e81)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #4338ca', boxShadow: '0 10px 30px -10px rgba(67, 56, 202, 0.5)'
                }}>
                    <div>
                        <h3 style={{ color: '#c7d2fe', marginBottom: '0.5rem' }}>Mening Darajam: {level}-Bosqich</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Jami XP: {totalScore} ball</p>
                    </div>
                    <div style={{ fontSize: '4rem' }}>🏆</div>
                </div>

                <div className="card">
                    <h3>Mening Vazifalarim</h3>
                    <ul className="task-list-ul"> {/* Using global task list styles */}
                        {assignments.map(a => (
                            <li key={a.id} className={a.status} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>{a.title}</h4>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                                        <span>Turi: {a.type}</span>
                                        <span>Holati: {a.status}</span>
                                        {a.score !== null && <span>Baho: {a.score}</span>}
                                    </div>
                                </div>

                                {a.status !== 'completed' && (
                                    <button
                                        className="btn-primary"
                                        onClick={() => window.location.href = `/task/${a.task_id}?assignmentId=${a.id}`}
                                    >
                                        Boshlash
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
