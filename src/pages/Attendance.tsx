import { useState } from 'react';
import { Download, Search, Filter, Clock } from 'lucide-react';
import './Attendance.css';

interface AttendanceRecord {
    id: number;
    employee: string;
    department: string;
    date: string;
    timeIn: string;
    timeOut: string;
    totalHours: number;
    overtime: number;
    status: 'Present' | 'Late' | 'Absent';
}

const ATTENDANCE_DATA: AttendanceRecord[] = [
    { id: 1, employee: 'Jane Smith', department: 'Computer Science', date: '11/24/2025', timeIn: '8:00 AM', timeOut: '5:30 PM', totalHours: 9.50, overtime: 1.50, status: 'Present' },
    { id: 2, employee: 'Robert Chen', department: 'Engineering', date: '11/24/2025', timeIn: '8:15 AM', timeOut: '4:00 PM', totalHours: 7.75, overtime: 0, status: 'Late' },
    { id: 3, employee: 'Mary Johnson', department: 'Administration', date: '11/24/2025', timeIn: '8:00 AM', timeOut: '6:00 PM', totalHours: 10.00, overtime: 2.00, status: 'Present' },
    { id: 4, employee: 'Jane Smith', department: 'Computer Science', date: '11/23/2025', timeIn: '8:05 AM', timeOut: '5:00 PM', totalHours: 8.92, overtime: 0.92, status: 'Late' },
    { id: 5, employee: 'Robert Chen', department: 'Engineering', date: '11/23/2025', timeIn: '8:00 AM', timeOut: '5:00 PM', totalHours: 9.00, overtime: 1.00, status: 'Present' },
    { id: 6, employee: 'Mary Johnson', department: 'Administration', date: '11/23/2025', timeIn: '8:00 AM', timeOut: '5:00 PM', totalHours: 9.00, overtime: 1.00, status: 'Present' },
];

const STATS = [
    { label: 'Total Present', value: '4', color: '#22c55e', bgColor: '#dcfce7' },
    { label: 'Total Late', value: '2', color: '#f97316', bgColor: '#ffedd5' },
    { label: 'Total Absent', value: '0', color: '#ef4444', bgColor: '#fee2e2' },
    { label: 'Total Overtime', value: '6.4 hrs', color: '#8b5cf6', bgColor: '#ede9fe' },
];

export default function Attendance() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [statusFilter, setStatusFilter] = useState('All Status');

    const filteredRecords = ATTENDANCE_DATA.filter(record => {
        const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = departmentFilter === 'All Departments' || record.department === departmentFilter;
        const matchesStatus = statusFilter === 'All Status' || record.status === statusFilter;
        return matchesSearch && matchesDepartment && matchesStatus;
    });

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Time & Attendance Management</h1>
                    <p className="page-subtitle">Track and manage employee attendance records</p>
                </div>
                <button className="primary-btn">
                    <Download size={18} />
                    <span>Download Report</span>
                </button>
            </div>

            <div className="stats-row">
                {STATS.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-mini-card"
                        style={{ borderLeftColor: stat.color }}
                    >
                        <span className="stat-mini-label">{stat.label}</span>
                        <span className="stat-mini-value" style={{ color: stat.color }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="filters-section">
                <div className="filters-header">
                    <Filter size={18} />
                    <span>Filters</span>
                </div>
                <div className="filters-row">
                    <div className="search-bar filter-search">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                        <option>All Departments</option>
                        <option>Computer Science</option>
                        <option>Engineering</option>
                        <option>Administration</option>
                    </select>
                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All Status</option>
                        <option>Present</option>
                        <option>Late</option>
                        <option>Absent</option>
                    </select>
                    <div className="date-picker">
                        <input type="date" />
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table attendance-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Total Hours</th>
                            <th>Overtime</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((record) => (
                            <tr key={record.id}>
                                <td className="name-cell">{record.employee}</td>
                                <td className="role-cell">{record.department}</td>
                                <td>{record.date}</td>
                                <td className="time-cell">
                                    <Clock size={14} />
                                    <span>{record.timeIn}</span>
                                </td>
                                <td className="time-cell">
                                    <Clock size={14} />
                                    <span>{record.timeOut}</span>
                                </td>
                                <td>{record.totalHours.toFixed(2)} hrs</td>
                                <td className="overtime-cell">{record.overtime.toFixed(2)} hrs</td>
                                <td>
                                    <span className={`status-badge-alt ${record.status.toLowerCase()}`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
