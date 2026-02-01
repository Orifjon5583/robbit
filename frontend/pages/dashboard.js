import React, { useEffect, useState } from 'react';
import { getUser, removeAuthToken, removeUser } from '../utils/auth';
import AdminDashboard from '../components/AdminDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import StudentDashboard from '../components/StudentDashboard';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      window.location.href = '/login';
    } else {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    removeUser();
    window.location.href = '/login';
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>EduPlatform</h1>
        <div className="user-info">
          <span>{user.username} ({user.role})</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main>
        {user.role === 'super_admin' && <AdminDashboard />}
        {user.role === 'teacher' && <TeacherDashboard />}
        {user.role === 'student' && <StudentDashboard />}
      </main>
    </div>
  );
}
