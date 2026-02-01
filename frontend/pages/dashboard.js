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

  if (!user) return <div>Yuklanmoqda...</div>;

  return (
    <>
      {user.role === 'super_admin' && <AdminDashboard />}
      {user.role === 'teacher' && <TeacherDashboard />}
      {user.role === 'student' && <StudentDashboard />}
    </>
  );
}
