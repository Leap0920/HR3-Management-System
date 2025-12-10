import { LayoutDashboard, Users, UserPlus, Calendar, CreditCard, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'All Employees', path: '/dashboard/employees' },
    { icon: UserPlus, label: 'Recruitment', path: '/dashboard/recruitment' },
    { icon: Calendar, label: 'Attendance', path: '/dashboard/attendance' },
    { icon: CreditCard, label: 'Payroll', path: '/dashboard/payroll' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">HR3 System</div>
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end={item.path === '/dashboard'} // Only exact match for root dashboard
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
