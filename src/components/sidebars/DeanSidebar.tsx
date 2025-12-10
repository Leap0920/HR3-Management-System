import { LayoutDashboard, CalendarDays, CalendarX, Clock, FileBarChart, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dean' },
    { icon: CalendarDays, label: 'Faculty Schedules', path: '/dean/schedules' },
    { icon: CalendarX, label: 'Leave Requests', path: '/dean/leave' },
    { icon: Clock, label: 'Attendance Overview', path: '/dean/attendance' },
    { icon: FileBarChart, label: 'Reports', path: '/dean/reports' },
];

export default function DeanSidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo-icon">
                    <LayoutDashboard size={20} />
                </div>
                <div className="sidebar-logo">HR3</div>
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end={item.path === '/dean'}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-snippet">
                    <div className="user-avatar-placeholder dean">{user?.name?.charAt(0) || 'D'}</div>
                    <div className="user-details">
                        <span className="user-name-snippet">{user?.name || 'Dean Johnson'}</span>
                        <span className="user-role-snippet">Dean - {user?.department || 'CS Department'}</span>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
