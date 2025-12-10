import { Users, UserCheck, DollarSign } from 'lucide-react';
import './Dashboard.css';

const STATS = [
    { label: 'Total Employees', value: '150', icon: Users, color: '#60a5fa' },
    { label: 'On Leave Today', value: '8', icon: UserCheck, color: '#f472b6' },
    { label: 'New Hires (Month)', value: '12', icon: UserCheck, color: '#34d399' },
    { label: 'Pending Payroll', value: '$45k', icon: DollarSign, color: '#fbbf24' },
];

export default function Dashboard() {
    return (
        <div className="dashboard-content">
            <h1 className="page-title">Dashboard Overview</h1>

            <div className="stats-grid">
                {STATS.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Recent Activities</h3>
                    <div className="placeholder-content">
                        <p className="text-muted">No recent activities to show.</p>
                    </div>
                </div>
                <div className="dashboard-card">
                    <h3>Upcoming Events</h3>
                    <div className="placeholder-content">
                        <p className="text-muted">No upcoming events.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
