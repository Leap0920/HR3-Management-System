import { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import './LeaveManagement.css';

interface LeaveRequest {
    id: number;
    employeeName: string;
    employeeEmail: string;
    department: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    status: 'Pending' | 'Approved' | 'Rejected';
}

const LEAVE_DATA: LeaveRequest[] = [
    { id: 1, employeeName: 'Jane Smith', employeeEmail: 'jane@hr3.com', department: 'Computer Science', leaveType: 'Sick Leave', startDate: '11/26/2025', endDate: '11/27/2025', days: 2, status: 'Pending' },
    { id: 2, employeeName: 'Robert Chen', employeeEmail: 'robert@hr3.com', department: 'Engineering', leaveType: 'Vacation Leave', startDate: '12/01/2025', endDate: '12/03/2025', days: 3, status: 'Pending' },
    { id: 3, employeeName: 'Mary Johnson', employeeEmail: 'mary@hr3.com', department: 'Administration', leaveType: 'Sick Leave', startDate: '11/20/2025', endDate: '11/21/2025', days: 2, status: 'Approved' },
    { id: 4, employeeName: 'Jane Smith', employeeEmail: 'jane@hr3.com', department: 'Computer Science', leaveType: 'Sick Leave', startDate: '11/15/2025', endDate: '11/15/2025', days: 1, status: 'Approved' },
];

const STATS = [
    { label: 'Total Requests', value: '4', color: '#1e293b' },
    { label: 'Pending', value: '2', color: '#f97316' },
    { label: 'Approved', value: '2', color: '#22c55e' },
    { label: 'Rejected', value: '0', color: '#ef4444' },
];

export default function LeaveManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');

    const filteredRequests = LEAVE_DATA.filter(request => {
        const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Leave Management</h1>
                    <p className="page-subtitle">Process and approve employee leave requests</p>
                </div>
            </div>

            <div className="stats-row four-cols">
                {STATS.map((stat, index) => (
                    <div key={index} className="stat-mini-card no-border">
                        <span className="stat-mini-label">{stat.label}</span>
                        <span className="stat-mini-value" style={{ color: stat.color }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="filters-inline">
                <div className="search-bar flex-grow">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by employee or leave type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request) => (
                            <tr key={request.id}>
                                <td>
                                    <div className="employee-cell">
                                        <span className="emp-name">{request.employeeName}</span>
                                        <span className="emp-email">{request.employeeEmail}</span>
                                    </div>
                                </td>
                                <td>{request.department}</td>
                                <td>{request.leaveType}</td>
                                <td>{request.startDate}</td>
                                <td>{request.endDate}</td>
                                <td>{request.days} day(s)</td>
                                <td>
                                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    {request.status === 'Pending' ? (
                                        <>
                                            <button className="action-icon approve">
                                                <Check size={16} />
                                            </button>
                                            <button className="action-icon reject">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <span className="action-text">{request.status}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
