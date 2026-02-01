import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function GroupList() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await api.get('/groups');
      setGroups(res.data);
    };
    fetchGroups();
  }, []);

  return (
    <div className="group-list">
      <h3>Groups</h3>
      <ul>
        {groups.map(g => (
          <li key={g.id}>
            <b>{g.name}</b> (Teacher: {g.teacher_name || 'None'})
          </li>
        ))}
      </ul>
    </div>
  )
}
