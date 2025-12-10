import { Users, UserCheck, CalendarX, Wallet, TrendingUp, Clock, FileText, Bell } from 'lucide-react';
import './HRAdminDashboard.css';

const STATS = [
    { label: 'Total Employees', value: '21', icon: Users, color: '#5d5fdb' },
    { label: 'Present Today', value: '18', icon: UserCheck, color: '#22c55e' },
    { label: 'Pending Leaves', value: '4', icon: CalendarX, color: '#f97316' },
    { label: 'Total Payroll', value: '₱47,718.6', subtext: 'Current period', icon: Wallet, color: '#f97316' },
];

const ATTENDANCE_DATA = [
    { day: 'Mon', absent: 2, late: 3, present: 16 },
    { day: 'Tue', absent: 1, late: 2, present: 18 },
    { day: 'Wed', absent: 1, late: 4, present: 16 },
    { day: 'Thu', absent: 2, late: 2, present: 17 },
    { day: 'Fri', absent: 1, late: 1, present: 19 },
    { day: 'Sat', absent: 3, late: 2, present: 5 },
    { day: 'Sun', absent: 0, late: 0, present: 2 },
];

const PAYROLL_DATA = [
    { dept: 'CS', amount: 18000 },
    { dept: 'ENG', amount: 15000 },
    { dept: 'BUS', amount: 14000 },
];

const RECENT_ATTENDANCE = [
    { employee: 'Jane Smith', department: 'Computer Science', date: '11/24/2025', timeIn: '8:00 AM', timeOut: '5:30 PM', status: 'Present' },
    { employee: 'Robert Chen', department: 'Engineering', date: '11/24/2025', timeIn: '8:15 AM', timeOut: '4:00 PM', status: 'Late' },
    { employee: 'Mary Johnson', department: 'Administration', date: '11/24/2025', timeIn: '8:00 AM', timeOut: '6:00 PM', status: 'Present' },
];

const maxAttendance = 20;
const maxPayroll = 20000;

export default function HRAdminDashboard() {
    return (
        <div className="page-content hr-dashboard">
            <div className="dashboard-header-section">
                <div>
                    <h1 className="page-title">HR Admin Dashboard</h1>
                    <p className="page-subtitle">Manage attendance, schedules, leaves, and payroll</p>
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
            <div className="hr-stats-grid">
                {STATS.map((stat, index) => (
                    <div key={index} className="hr-stat-card">
                        <div className="stat-header">
                            <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15` }}>
                                <stat.icon size={20} color={stat.color} />
                            </div>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                        <div className="stat-body">
                            <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
                            {stat.subtext && <span className="stat-subtext">{stat.subtext}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="section-title analytics-title">Analytics & Insights</h2>

            <div className="analytics-grid">
                {/* Attendance Trends Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">Attendance Trends (Last 7 Days)</h3>
                    <div className="bar-chart">
                        {ATTENDANCE_DATA.map((day, index) => (
                            <div key={index} className="bar-group">
                                <div className="bars">
                                    <div
                                        className="bar absent"
                                        style={{ height: `${(day.absent / maxAttendance) * 100}%` }}
                                        title={`Absent: ${day.absent}`}
                                    ></div>
                                    <div
                                        className="bar late"
                                        style={{ height: `${(day.late / maxAttendance) * 100}%` }}
                                        title={`Late: ${day.late}`}
                                    ></div>
                                    <div
                                        className="bar present"
                                        style={{ height: `${(day.present / maxAttendance) * 100}%` }}
                                        title={`Present: ${day.present}`}
                                    ></div>
                                </div>
                                <span className="bar-label">{day.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chart-legend">
                        <span className="legend-item"><span className="dot absent"></span> Absent</span>
                        <span className="legend-item"><span className="dot late"></span> Late</span>
                        <span className="legend-item"><span className="dot present"></span> Present</span>
                    </div>
                </div>

                {/* Leave Distribution Pie Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">Leave Distribution</h3>
                    <div className="pie-chart-container">
                        <div className="pie-chart">
                            <div className="pie-segment"></div>
                        </div>
                        <div className="pie-legend">
                            <div className="pie-legend-item">
                                <span className="pie-color vacation"></span>
                                <span>Vacation Leave: 45%</span>
                            </div>
                            <div className="pie-legend-item">
                                <span className="pie-color sick"></span>
                                <span>Sick Leave: 35%</span>
                            </div>
                            <div className="pie-legend-item">
                                <span className="pie-color emergency"></span>
                                <span>Emergency Leave: 20%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payroll by Department */}
                <div className="chart-card">
                    <h3 className="chart-title">Payroll by Department (₱)</h3>
                    <div className="vertical-bar-chart">
                        {PAYROLL_DATA.map((dept, index) => (
                            <div key={index} className="vertical-bar-group">
                                <div className="vertical-bar-wrapper">
                                    <div
                                        className="vertical-bar"
                                        style={{ height: `${(dept.amount / maxPayroll) * 100}%` }}
                                    >
                                        <span className="bar-value">{(dept.amount / 1000).toFixed(0)}k</span>
                                    </div>
                                </div>
                                <span className="bar-label">{dept.dept}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="chart-card summary-card">
                    <h3 className="chart-title">Summary Metrics</h3>
                    <div className="summary-metrics">
                        <div className="metric-item green">
                            <div className="metric-info">
                                <span className="metric-label">Attendance Rate</span>
                                <span className="metric-value">94.5%</span>
                            </div>
                            <TrendingUp size={24} className="metric-icon" />
                        </div>
                        <div className="metric-item orange">
                            <div className="metric-info">
                                <span className="metric-label">Leave Requests (Month)</span>
                                <span className="metric-value">12</span>
                            </div>
                            <FileText size={24} className="metric-icon" />
                        </div>
                        <div className="metric-item blue">
                            <div className="metric-info">
                                <span className="metric-label">Overtime Hours</span>
                                <span className="metric-value">48 hrs</span>
                            </div>
                            <Clock size={24} className="metric-icon" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Attendance Records */}
            <div className="recent-section">
                <h2 className="section-title">Recent Attendance Records</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Department</th>
                                <th>Date</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RECENT_ATTENDANCE.map((record, index) => (
                                <tr key={index}>
                                    <td className="name-cell">{record.employee}</td>
                                    <td className="role-cell">{record.department}</td>
                                    <td>{record.date}</td>
                                    <td>{record.timeIn}</td>
                                    <td>{record.timeOut}</td>
                                    <td>
                                        <span className={`status-badge-pill ${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
