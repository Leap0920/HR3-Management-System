import { LayoutDashboard, CalendarClock, Clock, CalendarX, Wallet, FileBarChart, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/hr-admin' },
    { icon: CalendarClock, label: 'Shift & Schedule', path: '/hr-admin/schedule' },
    { icon: Clock, label: 'Attendance', path: '/hr-admin/attendance' },
    { icon: CalendarX, label: 'Leave Management', path: '/hr-admin/leave' },
    { icon: Wallet, label: 'Payroll', path: '/hr-admin/payroll' },
    { icon: FileBarChart, label: 'Reports', path: '/hr-admin/reports' },
];

export default function HRAdminSidebar() {
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
                        end={item.path === '/hr-admin'}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-snippet">
                    <div className="user-avatar-placeholder hradmin">{user?.name?.charAt(0) || 'H'}</div>
                    <div className="user-details">
                        <span className="user-name-snippet">{user?.name || 'HR Admin'}</span>
                        <span className="user-role-snippet">HR Administrator</span>
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
