import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { getUser } from '../utils/auth';

export default function AssignmentForm({ taskId, onAssignmentCreated }) {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const user = getUser();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudentsInGroup(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/api/groups');
      setGroups(response.data);
    } catch (err) {
      setError('Failed to fetch groups');
    }
  };

  const fetchStudentsInGroup = async (groupId) => {
    try {
      const response = await api.get(`/api/groups/${groupId}/students`);
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const handleStudentToggle = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskId || selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    try {
      for (const studentId of selectedStudents) {
        await api.post('/api/assignments', { taskId, studentId });
      }
      setSuccess(true);
      setSelectedStudents([]);
      setTimeout(() => setSuccess(false), 3000);
      if (onAssignmentCreated) onAssignmentCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create assignments');
    }
  };

  return (
    <div className="assignment-form">
      <h3>O‘quvchilarga Vazifa Biriktirish</h3>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Vazifa muvaffaqiyatli biriktirildi!</div>}
      <form onSubmit={handleSubmit}>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          required
        >
          <option value="">Guruhni Tanlang</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        {students.length > 0 && (
          <div className="students-list">
            <h4>O‘quvchilarni Tanlang:</h4>
            {students.map((student) => (
              <label key={student.id}>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleStudentToggle(student.id)}
                />
                {student.username}
              </label>
            ))}
          </div>
        )}

        <button type="submit" className="btn-primary">
          Tanlanganlarga Biriktirish
        </button>
      </form>
    </div>
  );
}
