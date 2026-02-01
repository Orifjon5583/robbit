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
                const res = await api.get('/assignments');
                setAssignments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAssignments();
    }, []);

    return (
        <div className="student-dashboard">
            <h2>My Assignments</h2>
            <ul>
                {assignments.map(a => (
                    <li key={a.id} className={a.status}>
                        <h3>{a.title}</h3>
                        <p>Type: {a.type}</p>
                        <p>Status: {a.status}</p>
                        {a.status !== 'completed' && (
                            <button onClick={() => window.location.href = `/task/${a.task_id}?assignmentId=${a.id}`}>
                                Start Task
                            </button>
                        )}
                        {a.score !== null && <p>Score: {a.score}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
