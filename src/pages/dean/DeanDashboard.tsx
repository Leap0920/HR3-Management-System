import { Users, Bell } from 'lucide-react';
import './DeanDashboard.css';

const STATS = [
    { label: 'Total Faculty', value: '12', bgColor: '#eff6ff' },
    { label: 'Present Today', value: '11', color: '#22c55e', bgColor: '#f0fdf4' },
    { label: 'Pending Requests', value: '2', color: '#f97316', bgColor: '#fff7ed' },
    { label: 'On Leave', value: '1', bgColor: '#faf5ff' },
];

interface LeaveRequest {
    id: number;
    name: string;
    type: string;
    dates: string;
    days: number;
}

const PENDING_REQUESTS: LeaveRequest[] = [
    { id: 1, name: 'Jane Smith', type: 'Sick Leave', dates: '11/26/2025 to 11/27/2025', days: 2 },
    { id: 2, name: 'Robert Chen', type: 'Vacation Leave', dates: '12/01/2025 to 12/05/2025', days: 5 },
];

export default function DeanDashboard() {
    return (
        <div className="page-content dean-dashboard">
            <div className="dashboard-header-section">
                <div>
                    <h1 className="page-title">Dean Dashboard</h1>
                    <p className="page-subtitle">Computer Science Department Overview</p>
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

            {/* Stats Row */}
            <div className="dean-stats-grid">
                {STATS.map((stat, index) => (
                    <div
                        key={index}
                        className="dean-stat-card"
                        style={{ backgroundColor: stat.bgColor }}
                    >
                        <span className="stat-label">{stat.label}</span>
                        <span className="stat-value" style={{ color: stat.color || '#1e293b' }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Pending Leave Requests */}
            <div className="pending-section">
                <h2 className="section-title">Pending Leave Requests</h2>
                <div className="pending-list">
                    {PENDING_REQUESTS.map((request) => (
                        <div key={request.id} className="pending-item">
                            <div className="request-info">
                                <span className="request-name">{request.name}</span>
                                <span className="request-details">
                                    {request.type} - {request.dates} ({request.days} days)
                                </span>
                            </div>
                            <div className="request-actions">
                                <button className="approve-btn">
                                    Approve
                                </button>
                                <button className="reject-btn">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
