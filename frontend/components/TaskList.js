import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function TaskList({ onAssign }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/api/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="task-list">
      <h3>Vazifalar</h3>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <b>{t.title}</b> ({t.type})
            {onAssign && (
              <button
                className="btn-primary"
                onClick={() => onAssign(t.id)}
                style={{ marginLeft: 'auto', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                Biriktirish
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
