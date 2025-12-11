import { useState, useEffect } from 'react';
import { Search, Check, X, Loader2 } from 'lucide-react';
import { leaveAPI, type Leave } from '../services/api';
import './LeaveManagement.css';

export default function LeaveManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [remarksModal, setRemarksModal] = useState<{ id: string; action: 'approved' | 'rejected' } | null>(null);
    const [remarks, setRemarks] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (statusFilter !== 'All Status') params.status = statusFilter.toLowerCase();
            const data = await leaveAPI.getAll(params);
            setLeaves(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [statusFilter]);

    const filteredRequests = leaves.filter(request => {
        const matchesSearch = request.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const stats = {
        total: leaves.length,
        pending: leaves.filter(l => l.status === 'pending').length,
        approved: leaves.filter(l => l.status === 'approved').length,
        rejected: leaves.filter(l => l.status === 'rejected').length
    };

    const STATS = [
        { label: 'Total Requests', value: stats.total.toString(), color: '#1e293b' },
        { label: 'Pending', value: stats.pending.toString(), color: '#f97316' },
        { label: 'Approved', value: stats.approved.toString(), color: '#22c55e' },
        { label: 'Rejected', value: stats.rejected.toString(), color: '#ef4444' },
    ];

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        setRemarksModal({ id, action });
    };

    const submitAction = async () => {
        if (!remarksModal) return;
        try {
            setActionLoading(remarksModal.id);
            await leaveAPI.updateStatus(remarksModal.id, { status: remarksModal.action, remarks });
            setRemarksModal(null);
            setRemarks('');
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update leave status');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    const getLeaveTypeDisplay = (type: string) => {
        const typeMap: Record<string, string> = {
            vacation: 'Vacation Leave',
            sick: 'Sick Leave',
            personal: 'Personal Leave',
            maternity: 'Maternity Leave',
            paternity: 'Paternity Leave',
            emergency: 'Emergency Leave',
            other: 'Other'
        };
        return typeMap[type] || type;
    };

    if (loading) {
        return (
            <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 className="spin" size={40} />
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Leave Management</h1>
                    <p className="page-subtitle">Process and approve employee leave requests</p>
                </div>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <div className="stats-row four-cols">
                {STATS.map((stat, index) => (
                    <div key={index} className="stat-mini-card no-border">
                        <span className="stat-mini-label">{stat.label}</span>
                        <span className="stat-mini-value" style={{ color: stat.color }}>{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="filters-inline">
                <div className="search-bar flex-grow">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search by employee or leave type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
                            <tr key={request._id}>
                                <td>
                                    <div className="employee-cell">
                                        <span className="emp-name">{request.userId?.name || 'Unknown'}</span>
                                        <span className="emp-email">{request.userId?.email || ''}</span>
                                    </div>
                                </td>
                                <td>{request.userId?.department || '-'}</td>
                                <td>{getLeaveTypeDisplay(request.type)}</td>
                                <td>{formatDate(request.startDate)}</td>
                                <td>{formatDate(request.endDate)}</td>
                                <td>{request.totalDays} day(s)</td>
                                <td>
                                    <span className={`status-badge ${request.status}`}>
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    {request.status === 'pending' ? (
                                        <>
                                            <button 
                                                className="action-icon approve" 
                                                onClick={() => handleAction(request._id, 'approved')}
                                                disabled={actionLoading === request._id}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                className="action-icon reject" 
                                                onClick={() => handleAction(request._id, 'rejected')}
                                                disabled={actionLoading === request._id}
                                            >
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

            {remarksModal && (
                <div className="modal-overlay" onClick={() => setRemarksModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2>{remarksModal.action === 'approved' ? 'Approve' : 'Reject'} Leave Request</h2>
                            <button className="close-btn" onClick={() => setRemarksModal(null)}><X size={20} /></button>
                        </div>
                        <div className="form-group">
                            <label>Remarks (Optional)</label>
                            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} placeholder="Add any remarks..." />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setRemarksModal(null)}>Cancel</button>
                            <button 
                                type="button" 
                                className="btn-primary" 
                                onClick={submitAction}
                                disabled={actionLoading !== null}
                                style={{ background: remarksModal.action === 'approved' ? '#22c55e' : '#ef4444' }}
                            >
                                {actionLoading ? 'Processing...' : remarksModal.action === 'approved' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
