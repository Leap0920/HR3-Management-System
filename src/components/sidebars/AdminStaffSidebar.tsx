import { LayoutDashboard, Clock, CalendarDays, CalendarX, FileText, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-staff' },
    { icon: Clock, label: 'My Attendance', path: '/admin-staff/attendance' },
    { icon: CalendarDays, label: 'My Schedule', path: '/admin-staff/schedule' },
    { icon: CalendarX, label: 'Leave Requests', path: '/admin-staff/leave' },
    { icon: FileText, label: 'Payslip', path: '/admin-staff/payslip' },
];

export default function AdminStaffSidebar() {
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
                        end={item.path === '/admin-staff'}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-snippet">
                    <div className="user-avatar-placeholder adminstaff">{user?.name?.charAt(0) || 'M'}</div>
                    <div className="user-details">
                        <span className="user-name-snippet">{user?.name || 'Mary Johnson'}</span>
                        <span className="user-role-snippet">Admin Staff</span>
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
