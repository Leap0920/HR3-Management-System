import { useState } from 'react';
import { LayoutDashboard, Clock, CalendarDays, CalendarX, FileText, LogOut, X } from 'lucide-react';
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
    const [showLogoutModal, setShowLogoutModal] = useState(false);

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
                <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>

            {showLogoutModal && (
                <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
                    <div className="logout-modal" onClick={e => e.stopPropagation()}>
                        <button className="logout-modal-close" onClick={() => setShowLogoutModal(false)}>
                            <X size={20} />
                        </button>
                        <div className="logout-modal-icon">
                            <LogOut size={32} />
                        </div>
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to logout from the system?</p>
                        <div className="logout-modal-actions">
                            <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={handleLogout}>Yes, Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
