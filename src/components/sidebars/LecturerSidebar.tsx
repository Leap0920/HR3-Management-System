import { LayoutDashboard, Clock, CalendarDays, CalendarX, FileText, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/lecturer' },
    { icon: Clock, label: 'My Attendance', path: '/lecturer/attendance' },
    { icon: CalendarDays, label: 'My Schedule', path: '/lecturer/schedule' },
    { icon: CalendarX, label: 'Leave Requests', path: '/lecturer/leave' },
    { icon: FileText, label: 'Payslip', path: '/lecturer/payslip' },
];

export default function LecturerSidebar() {
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
                        end={item.path === '/lecturer'}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-snippet">
                    <div className="user-avatar-placeholder lecturer">{user?.name?.charAt(0) || 'J'}</div>
                    <div className="user-details">
                        <span className="user-name-snippet">{user?.name || 'Jane Smith'}</span>
                        <span className="user-role-snippet">Lecturer</span>
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
