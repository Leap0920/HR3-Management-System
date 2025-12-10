import { Clock, CheckCircle, Timer, CalendarX, Bell, Users } from 'lucide-react';
import './LecturerDashboard.css';

const STATS = [
    { icon: Clock, label: 'Attendance Rate', value: '70%', color: '#5d5fdb', bgColor: '#eff6ff' },
    { icon: CheckCircle, label: 'Total Hours', value: '83', color: '#22c55e', bgColor: '#f0fdf4' },
    { icon: Timer, label: 'Overtime', value: '2.0 hrs', color: '#f97316', bgColor: '#fff7ed' },
    { icon: CalendarX, label: 'Leave Balance', value: '6/7', color: '#ef4444', bgColor: '#fef2f2' },
];

const ATTENDANCE_TREND = [
    { date: 'Nov 18', value: 1 },
    { date: 'Nov 19', value: 1 },
    { date: 'Nov 20', value: 0.5 },
    { date: 'Nov 21', value: 1 },
    { date: 'Nov 22', value: 1 },
    { date: 'Nov 23', value: 0.5 },
    { date: 'Nov 24', value: 1 },
];

export default function LecturerDashboard() {
    return (
        <div className="page-content lecturer-dashboard">
            <div className="dashboard-header-section">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Welcome back, Jane Smith!</p>
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
            <div className="lecturer-stats-grid">
                {STATS.map((stat, index) => (
                    <div
                        key={index}
                        className="lecturer-stat-card"
                        style={{ backgroundColor: stat.bgColor }}
                    >
                        <div className="stat-header">
                            <div className="stat-icon-circle" style={{ backgroundColor: `${stat.color}20` }}>
                                <stat.icon size={20} color={stat.color} />
                            </div>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                        <span className="stat-value">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                {/* Attendance Trend */}
                <div className="chart-card attendance-trend-card">
                    <h3 className="chart-title">My Attendance <span className="text-primary">Trend</span></h3>
                    <div className="line-chart">
                        <div className="chart-y-axis">
                            <span>1</span>
                            <span>0.5</span>
                            <span>0</span>
                        </div>
                        <div className="chart-area">
                            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="trend-line">
                                <polyline
                                    fill="none"
                                    stroke="#5d5fdb"
                                    strokeWidth="2"
                                    points="0,10 50,10 100,50 150,10 200,10 250,50 300,10"
                                />
                                {[0, 50, 100, 150, 200, 250, 300].map((x, i) => (
                                    <circle key={i} cx={x} cy={[10, 10, 50, 10, 10, 50, 10][i]} r="4" fill="#5d5fdb" />
                                ))}
                            </svg>
                            <div className="chart-x-axis">
                                {ATTENDANCE_TREND.map((item, i) => (
                                    <span key={i}>{item.date}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="chart-legend">
                        <span className="legend-item">1 = Present, 0.5 = <span className="text-orange">Late</span>, 0 = <span className="text-red">Absent</span></span>
                    </div>
                </div>

                {/* My Schedule */}
                <div className="chart-card schedule-card">
                    <h3 className="chart-title">My Schedule</h3>
                    <div className="upcoming-shift">
                        <span className="shift-label">Upcoming Shift</span>
                        <span className="shift-time">8:00 AM – 4:00 PM</span>
                    </div>
                    <button className="view-schedule-btn">View Full Schedule</button>
                </div>
            </div>

            {/* Leave Balance */}
            <div className="leave-balance-section">
                <h3 className="section-heading">Leave Balance</h3>
                <div className="leave-balance-row">
                    <div className="leave-progress-container">
                        <span className="leave-label">Annual Leave Quota</span>
                        <div className="leave-progress-bar">
                            <div className="leave-progress-fill" style={{ width: '85.7%' }}></div>
                        </div>
                    </div>
                    <span className="leave-count">6/7 days</span>
                    <button className="request-leave-btn">Request Leave</button>
                </div>
            </div>
        </div>
    );
}
