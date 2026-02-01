import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function TaskList({ onAssign }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await api.get('/tasks');
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  return (
    <div className="task-list">
      <h3>Tasks</h3>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <b>{t.title}</b> ({t.type})
            {onAssign && (
              <button
                onClick={() => onAssign(t.id)}
                style={{ marginLeft: '10px', fontSize: '0.8rem' }}
              >
                Assign
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
