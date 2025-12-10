import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import './MyAttendance.css';

interface AttendanceRecord {
    date: string;
    timeIn: string;
    timeOut: string;
    totalHours: string;
    lateMin: number;
    status: 'Present' | 'Late' | 'Absent';
}

const STATS = [
    { label: 'Total Hours', value: '82.6', bgColor: '#eff6ff' },
    { label: 'Present Days', value: '7', color: '#22c55e', bgColor: '#f0fdf4' },
    { label: 'Late Count', value: '2', color: '#f97316', bgColor: '#fff7ed' },
    { label: 'Absent Count', value: '1', color: '#ef4444', bgColor: '#fef2f2' },
    { label: 'Overtime', value: '2.0', color: '#5d5fdb', bgColor: '#f5f3ff' },
];

const ATTENDANCE_DATA: AttendanceRecord[] = [
    { date: '11/27/2025', timeIn: '8:00 AM', timeOut: '5:00 PM', totalHours: '9 hrs', lateMin: 0, status: 'Present' },
    { date: '11/26/2025', timeIn: '8:10 AM', timeOut: '4:50 PM', totalHours: '8.67 hrs', lateMin: 10, status: 'Late' },
    { date: '11/25/2025', timeIn: '8:00 AM', timeOut: '5:30 PM', totalHours: '9.5 hrs', lateMin: 0, status: 'Present' },
    { date: '11/24/2025', timeIn: '8:00 AM', timeOut: '5:30 PM', totalHours: '9.5 hrs', lateMin: 0, status: 'Present' },
    { date: '11/23/2025', timeIn: '8:05 AM', timeOut: '5:00 PM', totalHours: '8.92 hrs', lateMin: 5, status: 'Late' },
    { date: '11/22/2025', timeIn: '8:00 AM', timeOut: '5:00 PM', totalHours: '9 hrs', lateMin: 0, status: 'Present' },
    { date: '11/21/2025', timeIn: '8:00 AM', timeOut: '6:00 PM', totalHours: '10 hrs', lateMin: 0, status: 'Present' },
    { date: '11/20/2025', timeIn: '-', timeOut: '-', totalHours: '0 hrs', lateMin: 0, status: 'Absent' },
    { date: '11/19/2025', timeIn: '8:00 AM', timeOut: '5:00 PM', totalHours: '9 hrs', lateMin: 0, status: 'Present' },
    { date: '11/18/2025', timeIn: '8:00 AM', timeOut: '5:00 PM', totalHours: '9 hrs', lateMin: 0, status: 'Present' },
];

export default function MyAttendance() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Attendance</h1>
                    <p className="page-subtitle">View your attendance records and history</p>
                </div>
                <button className="btn-primary">
                    <Download size={18} />
                    <span>Download Report</span>
                </button>
            </div>

            {/* Month Selector */}
            <div className="month-selector">
                <button className="month-nav-btn">
                    <ChevronLeft size={18} />
                </button>
                <span className="current-month">November 2025</span>
                <button className="month-nav-btn">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Stats Row */}
            <div className="attendance-stats-grid">
                {STATS.map((stat, index) => (
                    <div
                        key={index}
                        className="attendance-stat-card"
                        style={{ backgroundColor: stat.bgColor }}
                    >
                        <span className="stat-label" style={{ color: stat.color || 'var(--text-muted)' }}>{stat.label}</span>
                        <span className="stat-value" style={{ color: stat.color || 'var(--text-main)' }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Attendance Records */}
            <div className="records-section">
                <h2 className="section-title">Attendance Records - November 2025</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Total Hours</th>
                                <th>Late (min)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ATTENDANCE_DATA.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.date}</td>
                                    <td className="text-primary">{record.timeIn}</td>
                                    <td className="text-primary">{record.timeOut}</td>
                                    <td>{record.totalHours}</td>
                                    <td>{record.lateMin}</td>
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
