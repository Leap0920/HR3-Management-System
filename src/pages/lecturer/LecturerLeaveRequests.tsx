import { Plus } from 'lucide-react';
import './LecturerLeaveRequests.css';

interface LeaveRequest {
    id: number;
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedDate: string;
}

const LEAVE_DATA: LeaveRequest[] = [
    { id: 1, leaveType: 'Sick Leave', startDate: '11/26/2025', endDate: '11/27/2025', days: 2, status: 'Pending', appliedDate: '11/24/2025' },
    { id: 2, leaveType: 'Sick Leave', startDate: '11/15/2025', endDate: '11/15/2025', days: 1, status: 'Approved', appliedDate: '11/14/2025' },
];

export default function LecturerLeaveRequests() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Leave Requests</h1>
                    <p className="page-subtitle">Manage your leave applications</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Request Leave</span>
                </button>
            </div>

            {/* Leave Balance */}
            <div className="leave-balance-card">
                <h3 className="card-title">Leave Balance</h3>
                <div className="leave-balance-row">
                    <div className="leave-progress-container">
                        <span className="leave-label">Annual Leave Quota</span>
                        <div className="leave-progress-bar">
                            <div className="leave-progress-fill" style={{ width: '85.7%' }}></div>
                        </div>
                    </div>
                    <span className="leave-count">6/7 days</span>
                </div>
            </div>

            {/* Leave Request History */}
            <div className="history-section">
                <h2 className="section-title">Leave Request History</h2>
                <div className="table-container">
                    <table className="data-table leave-history-table">
                        <thead>
                            <tr>
                                <th>Leave Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Days</th>
                                <th>Status</th>
                                <th>Applied Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LEAVE_DATA.map((request) => (
                                <tr key={request.id}>
                                    <td className="text-primary">{request.leaveType}</td>
                                    <td>{request.startDate}</td>
                                    <td>{request.endDate}</td>
                                    <td className="text-primary">{request.days} day(s)</td>
                                    <td>
                                        <span className={`status-text ${request.status.toLowerCase()}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td>{request.appliedDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
