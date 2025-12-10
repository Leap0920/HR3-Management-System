import { Users, Building2, Activity, TrendingUp, Wallet, Settings, Bell } from 'lucide-react';
import './Dashboard.css';

const STATS = [
    {
        label: 'Total System Users',
        value: '8',
        subtext: 'Employees, Admins & Deans',
        icon: Users,
        iconColor: '#5d5fdb',
        bg: 'white'
    },
    {
        label: 'Total Departments',
        value: '3',
        subtext: 'Academic & Admin Units',
        icon: Building2,
        iconColor: '#5d5fdb',
        bg: 'white'
    },
    {
        label: 'System Uptime',
        value: '99.9%',
        subtext: 'Last 30 days',
        icon: Activity,
        iconColor: '#5d5fdb',
        bg: 'white'
    }
];

const SECOND_ROW_STATS = [
    {
        label: 'Active Users Today',
        value: '31',
        icon: TrendingUp,
        iconColor: '#5d5fdb',
        bg: 'white'
    },
    {
        label: 'Total Payroll (current)',
        value: '₱47,718.6',
        icon: Wallet,
        iconColor: '#5d5fdb',
        bg: 'white'
    }
];

export default function Dashboard() {
    return (
        <div className="dashboard-content">
            <div className="dashboard-header-section">
                <div>
                    <h1 className="page-title">Super Admin Dashboard</h1>
                    <p className="page-subtitle">Complete system overview and management</p>
                </div>
                <div className="header-actions">
                    <button className="icon-btn">
                        <Bell size={20} />
                    </button>
                    <button className="icon-btn">
                        <Users size={20} />
                    </button>
                </div>
            </div>

            <div className="stats-grid-3">
                {STATS.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon-wrapper">
                                <stat.icon size={20} color={stat.iconColor} />
                            </div>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                        <div className="stat-body">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-subtext">{stat.subtext}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-grid-mixed">
                {SECOND_ROW_STATS.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon-wrapper">
                                <stat.icon size={20} color={stat.iconColor} />
                            </div>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                        <div className="stat-body">
                            <span className="stat-value">{stat.value}</span>
                        </div>
                    </div>
                ))}

                <div className="stat-card purple-card">
                    <div className="purple-card-content">
                        <Settings size={28} className="spin-slow" />
                        <span className="purple-value">1</span>
                        <span className="purple-label">Pending Actions</span>
                    </div>
                </div>
            </div>

            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
                <button className="action-button">
                    <Users size={18} />
                    <span>Manage Users</span>
                </button>
                <button className="action-button">
                    <Building2 size={18} />
                    <span>Manage Departments</span>
                </button>
                <button className="action-button">
                    <Activity size={18} />
                    <span>View Analytics</span>
                </button>
                <button className="action-button">
                    <Settings size={18} />
                    <span>System Settings</span>
                </button>
            </div>

            <div className="system-info-card">
                <h2 className="section-title">System Information</h2>
                <div className="info-list">
                    <div className="info-item">
                        <span>System Version</span>
                        <span className="info-value">HR3 v1.0.0</span>
                    </div>
                    <div className="info-item">
                        <span>Last Backup</span>
                        <span className="info-value">11/24/2025</span>
                    </div>
                    <div className="info-item">
                        <span>Database Status</span>
                        <span className="info-value status-healthy">● Healthy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
