import { useState, useEffect } from 'react';
import { Users, UserCheck, CalendarX, Wallet, TrendingUp, Clock, FileText, Bell, Loader2 } from 'lucide-react';
import { dashboardAPI, attendanceAPI, leaveAPI, type DashboardStats, type Attendance } from '../../services/api';
import './HRAdminDashboard.css';

const formatCurrency = (amount: number) => {
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

export default function HRAdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentAttendance, setRecentAttendance] = useState<Attendance[]>([]);
    const [attendanceSummary, setAttendanceSummary] = useState<{ present: number; late: number; absent: number }>({ present: 0, late: 0, absent: 0 });
    const [leaveSummary, setLeaveSummary] = useState<{ pending: number; approved: number; rejected: number }>({ pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, attendanceData, leaveSummaryData, attendanceSummaryData] = await Promise.all([
                    dashboardAPI.getStats(),
                    attendanceAPI.getAll(),
                    dashboardAPI.getLeaveSummary(),
                    dashboardAPI.getAttendanceSummary()
                ]);

                setStats(statsData);
                setRecentAttendance(attendanceData.slice(0, 5));

                // Process attendance summary
                const attSummary = { present: 0, late: 0, absent: 0 };
                attendanceSummaryData.forEach(item => {
                    if (item._id === 'present') attSummary.present = item.count;
                    else if (item._id === 'late') attSummary.late = item.count;
                    else if (item._id === 'absent') attSummary.absent = item.count;
                });
                setAttendanceSummary(attSummary);

                // Process leave summary
                const lvSummary = { pending: 0, approved: 0, rejected: 0 };
                leaveSummaryData.summary.forEach(item => {
                    if (item._id === 'pending') lvSummary.pending = item.count;
                    else if (item._id === 'approved') lvSummary.approved = item.count;
                    else if (item._id === 'rejected') lvSummary.rejected = item.count;
                });
                setLeaveSummary(lvSummary);

                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="page-content hr-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 className="spin" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content hr-dashboard">
                <div style={{ padding: '20px', background: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
                    Error: {error}
                </div>
            </div>
        );
    }

    const STATS = [
        { label: 'Total Employees', value: stats?.totalUsers?.toString() || '0', icon: Users, color: '#5d5fdb' },
        { label: 'Present Today', value: stats?.presentToday?.toString() || '0', icon: UserCheck, color: '#22c55e' },
        { label: 'Pending Leaves', value: stats?.pendingLeaves?.toString() || '0', icon: CalendarX, color: '#f97316' },
        { label: 'Total Payroll', value: formatCurrency(stats?.totalPayroll || 0), subtext: 'Current period', icon: Wallet, color: '#f97316' },
    ];

    const totalLeaves = leaveSummary.pending + leaveSummary.approved + leaveSummary.rejected;
    const vacationPercent = totalLeaves > 0 ? Math.round((leaveSummary.approved / totalLeaves) * 100) : 0;
    const sickPercent = totalLeaves > 0 ? Math.round((leaveSummary.pending / totalLeaves) * 100) : 0;
    const emergencyPercent = totalLeaves > 0 ? Math.round((leaveSummary.rejected / totalLeaves) * 100) : 0;

    const totalAttendance = attendanceSummary.present + attendanceSummary.late + attendanceSummary.absent;
    const attendanceRate = totalAttendance > 0 ? ((attendanceSummary.present + attendanceSummary.late) / totalAttendance * 100).toFixed(1) : '0';

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
                {/* Attendance Summary */}
                <div className="chart-card">
                    <h3 className="chart-title">Attendance Summary (Last 7 Days)</h3>
                    <div className="summary-stats">
                        <div className="summary-item">
                            <span className="summary-label">Present</span>
                            <span className="summary-value" style={{ color: '#22c55e' }}>{attendanceSummary.present}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Late</span>
                            <span className="summary-value" style={{ color: '#f97316' }}>{attendanceSummary.late}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Absent</span>
                            <span className="summary-value" style={{ color: '#ef4444' }}>{attendanceSummary.absent}</span>
                        </div>
                    </div>
                    <div className="chart-legend">
                        <span className="legend-item"><span className="dot absent"></span> Absent</span>
                        <span className="legend-item"><span className="dot late"></span> Late</span>
                        <span className="legend-item"><span className="dot present"></span> Present</span>
                    </div>
                </div>

                {/* Leave Distribution */}
                <div className="chart-card">
                    <h3 className="chart-title">Leave Distribution</h3>
                    <div className="pie-chart-container">
                        <div className="pie-chart">
                            <div className="pie-segment"></div>
                        </div>
                        <div className="pie-legend">
                            <div className="pie-legend-item">
                                <span className="pie-color vacation"></span>
                                <span>Approved: {vacationPercent}%</span>
                            </div>
                            <div className="pie-legend-item">
                                <span className="pie-color sick"></span>
                                <span>Pending: {sickPercent}%</span>
                            </div>
                            <div className="pie-legend-item">
                                <span className="pie-color emergency"></span>
                                <span>Rejected: {emergencyPercent}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="chart-card summary-card">
                    <h3 className="chart-title">Summary Metrics</h3>
                    <div className="summary-metrics">
                        <div className="metric-item green">
                            <div className="metric-info">
                                <span className="metric-label">Attendance Rate</span>
                                <span className="metric-value">{attendanceRate}%</span>
                            </div>
                            <TrendingUp size={24} className="metric-icon" />
                        </div>
                        <div className="metric-item orange">
                            <div className="metric-info">
                                <span className="metric-label">Pending Leave Requests</span>
                                <span className="metric-value">{leaveSummary.pending}</span>
                            </div>
                            <FileText size={24} className="metric-icon" />
                        </div>
                        <div className="metric-item blue">
                            <div className="metric-info">
                                <span className="metric-label">Total Departments</span>
                                <span className="metric-value">{stats?.totalDepartments || 0}</span>
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
                            {recentAttendance.length > 0 ? (
                                recentAttendance.map((record) => (
                                    <tr key={record._id}>
                                        <td className="name-cell">{record.userId?.name || 'Unknown'}</td>
                                        <td className="role-cell">{record.userId?.department || '-'}</td>
                                        <td>{formatDate(record.date)}</td>
                                        <td>{formatTime(record.timeIn)}</td>
                                        <td>{formatTime(record.timeOut)}</td>
                                        <td>
                                            <span className={`status-badge-pill ${record.status}`}>
                                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                                        No attendance records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
