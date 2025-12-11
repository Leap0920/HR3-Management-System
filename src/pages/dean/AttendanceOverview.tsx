import { useState, useEffect } from 'react';
import { Loader2, Download } from 'lucide-react';
import { attendanceAPI, usersAPI, type Attendance, type User } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AttendanceOverview.css';

interface FacultyStats {
    userId: string;
    name: string;
    totalHours: number;
    lateCount: number;
    absentCount: number;
    presentCount: number;
    attendanceRate: number;
}

export default function AttendanceOverview() {
    const { user } = useAuth();
    const [facultyStats, setFacultyStats] = useState<FacultyStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [attendanceData, usersData] = await Promise.all([
                    attendanceAPI.getAll(),
                    usersAPI.getAll().catch(() => [] as User[])
                ]);

                // Filter users by department
                const deptUsers = user?.department
                    ? usersData.filter(u => u.department === user.department && ['lecturer', 'adminstaff'].includes(u.role))
                    : usersData.filter(u => ['lecturer', 'adminstaff'].includes(u.role));

                // Calculate stats for each faculty
                const stats: FacultyStats[] = deptUsers.map(faculty => {
                    const userAttendance = attendanceData.filter(a => 
                        (typeof a.userId === 'object' ? a.userId._id : a.userId) === faculty._id
                    );
                    
                    const totalHours = userAttendance.reduce((sum, a) => sum + (a.hoursWorked || 0), 0);
                    const lateCount = userAttendance.filter(a => a.status === 'late').length;
                    const absentCount = userAttendance.filter(a => a.status === 'absent').length;
                    const presentCount = userAttendance.filter(a => ['present', 'late'].includes(a.status)).length;
                    const totalRecords = userAttendance.length;
                    const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

                    return {
                        userId: faculty._id,
                        name: faculty.name,
                        totalHours,
                        lateCount,
                        absentCount,
                        presentCount,
                        attendanceRate
                    };
                });

                setFacultyStats(stats);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load attendance data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

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
                    <h1 className="page-title">Attendance Overview</h1>
                    <p className="page-subtitle">Monitor faculty attendance and hours - {user?.department || 'All Departments'}</p>
                </div>
                <button className="primary-btn" style={{ background: '#64748b' }}>
                    <Download size={18} />
                    <span>Export Report</span>
                </button>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '12px' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Faculty</p>
                    <p style={{ margin: '8px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#5d5fdb' }}>{facultyStats.length}</p>
                </div>
                <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Avg Attendance Rate</p>
                    <p style={{ margin: '8px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#22c55e' }}>
                        {facultyStats.length > 0 ? (facultyStats.reduce((sum, f) => sum + f.attendanceRate, 0) / facultyStats.length).toFixed(1) : 0}%
                    </p>
                </div>
                <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '12px' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Late</p>
                    <p style={{ margin: '8px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#f97316' }}>
                        {facultyStats.reduce((sum, f) => sum + f.lateCount, 0)}
                    </p>
                </div>
                <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '12px' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Total Absent</p>
                    <p style={{ margin: '8px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#ef4444' }}>
                        {facultyStats.reduce((sum, f) => sum + f.absentCount, 0)}
                    </p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table attendance-overview-table">
                    <thead>
                        <tr>
                            <th>Faculty</th>
                            <th>Total Hours</th>
                            <th>Present Days</th>
                            <th>Late Count</th>
                            <th>Absent Count</th>
                            <th>Attendance Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facultyStats.length > 0 ? facultyStats.map((record) => (
                            <tr key={record.userId}>
                                <td className="faculty-name">{record.name}</td>
                                <td>{record.totalHours.toFixed(1)} hrs</td>
                                <td style={{ color: '#22c55e' }}>{record.presentCount}</td>
                                <td className="late-count">{record.lateCount}</td>
                                <td className="absent-count">{record.absentCount}</td>
                                <td className="rate-cell">
                                    <span style={{ 
                                        color: record.attendanceRate >= 90 ? '#22c55e' : record.attendanceRate >= 75 ? '#f97316' : '#ef4444',
                                        fontWeight: 600
                                    }}>
                                        {record.attendanceRate.toFixed(1)}%
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No faculty data found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
