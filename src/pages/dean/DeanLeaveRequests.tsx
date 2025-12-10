import { Check, X } from 'lucide-react';
import './DeanLeaveRequests.css';

interface LeaveRequest {
    id: number;
    faculty: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    status: 'Pending' | 'Approved' | 'Rejected';
}

const LEAVE_DATA: LeaveRequest[] = [
    { id: 1, faculty: 'Jane Smith', leaveType: 'Sick Leave', startDate: '11/26/2025', endDate: '11/27/2025', days: 2, status: 'Pending' },
    { id: 2, faculty: 'Robert Chen', leaveType: 'Vacation Leave', startDate: '12/01/2025', endDate: '12/05/2025', days: 5, status: 'Pending' },
];

const STATS = [
    { label: 'Pending', value: '2', color: '#f97316', bgColor: '#fff7ed' },
    { label: 'Approved', value: '0', color: '#22c55e', bgColor: '#f0fdf4' },
    { label: 'Rejected', value: '0', color: '#ef4444', bgColor: '#fef2f2' },
];

export default function DeanLeaveRequests() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Leave Requests</h1>
                    <p className="page-subtitle">Review and approve faculty leave requests</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="leave-stats-grid">
                {STATS.map((stat, index) => (
                    <div
                        key={index}
                        className="leave-stat-card"
                        style={{ backgroundColor: stat.bgColor }}
                    >
                        <span className="stat-label">{stat.label}</span>
                        <span className="stat-value" style={{ color: stat.color }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="table-container">
                <table className="data-table leave-table">
                    <thead>
                        <tr>
                            <th>Faculty</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LEAVE_DATA.map((request) => (
                            <tr key={request.id}>
                                <td className="faculty-name">{request.faculty}</td>
                                <td>{request.leaveType}</td>
                                <td>{request.startDate}</td>
                                <td>{request.endDate}</td>
                                <td>{request.days} day(s)</td>
                                <td>
                                    <span className={`status-text ${request.status.toLowerCase()}`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    {request.status === 'Pending' && (
                                        <>
                                            <button className="action-icon approve">
                                                <Check size={16} />
                                            </button>
                                            <button className="action-icon reject">
                                                <X size={16} />
                                            </button>
                                        </>
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
