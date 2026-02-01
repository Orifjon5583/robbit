import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import QuizPlayer from '../../components/QuizPlayer';
// import BlocklyPlayer from '../../components/BlocklyPlayer'; // To be implemented

export default function TaskPage() {
    const router = useRouter();
    const { id, assignmentId } = router.query;
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchTask = async () => {
            try {
                const res = await api.get(`/tasks/${id}`);
                setTask(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleComplete = async (score, submissionData) => {
        try {
            await api.put(`/assignments/${assignmentId}`, {
                status: 'completed',
                score,
                submissionData
            });
            alert(`Task completed! Score: ${score}`);
            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to submit', err);
            alert('Submission failed');
        }
    };

    if (loading) return <div>Loading task...</div>;
    if (!task) return <div>Task not found</div>;

    return (
        <div className="task-page">
            <h1>{task.title}</h1>
            <p>{task.description}</p>

            {task.type === 'quiz' && (
                <QuizPlayer content={task.content} onComplete={handleComplete} />
            )}

            {task.type === 'block_test' && (
                <div>
                    <h2>Blockly Task</h2>
                    <p>Blockly integration pending...</p>
                    <button onClick={() => handleComplete(100, { code: 'mock' })}>Simulate Complete</button>
                </div>
            )}
        </div>
    );
}
