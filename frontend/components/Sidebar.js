import React from 'react';
import { LayoutDashboard, BookOpen, PlusCircle, BarChart2, FolderKanban, Users, LogOut, GraduationCap } from 'lucide-react';
import { removeAuthToken, removeUser } from '../utils/auth';
import { useRouter } from 'next/router';

export default function Sidebar({ role, activeView, onViewChange, user }) {
    const router = useRouter();

    const handleLogout = () => {
        removeAuthToken();
        removeUser();
        router.push('/login');
    };

    const teacherItems = [
        { id: 'overview', label: 'Umumiy', icon: LayoutDashboard },
        { id: 'tasks', label: 'Vazifalarim', icon: BookOpen },
        { id: 'create-task', label: 'Vazifa Yaratish', icon: PlusCircle },
        { id: 'analytics', label: 'Statistika', icon: BarChart2 },
    ];

    const adminItems = [
        { id: 'overview', label: 'Umumiy', icon: LayoutDashboard },
        { id: 'groups', label: 'Guruhlar', icon: FolderKanban },
        // { id: 'users', label: 'Foydalanuvchilar', icon: Users },
    ];

    const items = role === 'admin' || role === 'super_admin' ? adminItems : teacherItems;

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <GraduationCap size={28} />
                <span>EduPlatform</span>
            </div>

            <div className="user-profile">
                <div>{user?.username}</div>
                <div>{role === 'super_admin' ? 'Admin' : 'O‘qituvchi'}</div>
            </div>

            <nav className="sidebar-nav">
                {items.map(item => (
                    <button
                        key={item.id}
                        className={activeView === item.id ? 'active' : ''}
                        onClick={() => onViewChange(item.id)}
                    >
                        <item.icon size={20} style={{ marginRight: '10px' }} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout}>
                    <LogOut size={20} style={{ marginRight: '10px' }} />
                    Chiqish
                </button>
            </div>
        </aside>
    );
}
