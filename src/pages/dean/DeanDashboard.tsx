import { useState, useEffect } from 'react';
import { Users, Bell, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { leaveAPI, attendanceAPI, usersAPI, type Leave, type User } from '../../services/api';
import './DeanDashboard.css';

export default function DeanDashboard() {
    const { user } = useAuth();
    const [pendingLeaves, setPendingLeaves] = useState<Leave[]>([]);
    const [stats, setStats] = useState({ totalFaculty: 0, presentToday: 0, pendingRequests: 0, onLeave: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [leavesData, usersData, attendanceData] = await Promise.all([
                leaveAPI.getAll({ status: 'pending' }),
                usersAPI.getAll().catch(() => [] as User[]),
                attendanceAPI.getAll().catch(() => [])
            ]);

            // Filter leaves for the dean's department
            const deptLeaves = user?.department 
                ? leavesData.filter(l => l.userId?.department === user.department)
                : leavesData;
            setPendingLeaves(deptLeaves);

            // Calculate stats
            const deptUsers = user?.department
                ? usersData.filter((u: User) => u.department === user.department && ['lecturer', 'adminstaff'].includes(u.role))
                : usersData.filter((u: User) => ['lecturer', 'adminstaff'].includes(u.role));

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStr = today.toISOString().split('T')[0];

            const todayAttendance = attendanceData.filter(a => {
                const attDate = new Date(a.date).toISOString().split('T')[0];
                return attDate === todayStr && ['present', 'late'].includes(a.status);
            });

            const onLeaveCount = leavesData.filter(l => {
                const start = new Date(l.startDate);
                const end = new Date(l.endDate);
                return l.status === 'approved' && today >= start && today <= end;
            }).length;

            setStats({
                totalFaculty: deptUsers.length,
                presentToday: todayAttendance.length,
                pendingRequests: deptLeaves.length,
                onLeave: onLeaveCount
            });

            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleApprove = async (leaveId: string) => {
        try {
            setActionLoading(leaveId);
            await leaveAPI.updateStatus(leaveId, { status: 'approved' });
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to approve leave');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (leaveId: string) => {
        try {
            setActionLoading(leaveId);
            await leaveAPI.updateStatus(leaveId, { status: 'rejected' });
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to reject leave');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };

    if (loading) {
        return (
            <div className="page-content dean-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 className="spin" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content dean-dashboard">
                <div style={{ padding: '20px', background: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
                    Error: {error}
                </div>
            </div>
        );
    }

    const STATS = [
        { label: 'Total Faculty', value: stats.totalFaculty.toString(), bgColor: '#eff6ff' },
        { label: 'Present Today', value: stats.presentToday.toString(), color: '#22c55e', bgColor: '#f0fdf4' },
        { label: 'Pending Requests', value: stats.pendingRequests.toString(), color: '#f97316', bgColor: '#fff7ed' },
        { label: 'On Leave', value: stats.onLeave.toString(), bgColor: '#faf5ff' },
    ];

    return (
        <div className="page-content dean-dashboard">
            <div className="dashboard-header-section">
                <div>
                    <h1 className="page-title">Dean Dashboard</h1>
                    <p className="page-subtitle">{user?.department || 'Department'} Overview</p>
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
                    {pendingLeaves.length > 0 ? (
                        pendingLeaves.map((request) => (
                            <div key={request._id} className="pending-item">
                                <div className="request-info">
                                    <span className="request-name">{request.userId?.name || 'Unknown'}</span>
                                    <span className="request-details">
                                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave - {formatDate(request.startDate)} to {formatDate(request.endDate)} ({calculateDays(request.startDate, request.endDate)} days)
                                    </span>
                                </div>
                                <div className="request-actions">
                                    <button 
                                        className="approve-btn"
                                        onClick={() => handleApprove(request._id)}
                                        disabled={actionLoading === request._id}
                                    >
                                        {actionLoading === request._id ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button 
                                        className="reject-btn"
                                        onClick={() => handleReject(request._id)}
                                        disabled={actionLoading === request._id}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                            No pending leave requests
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
