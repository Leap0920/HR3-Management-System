import { useState, useEffect } from 'react';
import { Download, Search, Filter, Clock, Plus, X, Loader2 } from 'lucide-react';
import { attendanceAPI, usersAPI, departmentsAPI, type Attendance as AttendanceType, type User, type Department } from '../services/api';
import './Attendance.css';

export default function Attendance() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [dateFilter, setDateFilter] = useState('');
    const [attendance, setAttendance] = useState<AttendanceType[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        date: new Date().toISOString().split('T')[0],
        timeIn: '08:00',
        timeOut: '17:00',
        status: 'present',
        notes: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (dateFilter) params.date = dateFilter;
            if (statusFilter !== 'All Status') params.status = statusFilter.toLowerCase();

            const [attData, usersData, deptsData] = await Promise.all([
                attendanceAPI.getAll(params),
                usersAPI.getAll().catch(() => [] as User[]),
                departmentsAPI.getAll().catch(() => [] as Department[])
            ]);
            setAttendance(attData);
            setUsers(usersData);
            setDepartments(deptsData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [dateFilter, statusFilter]);

    const filteredRecords = attendance.filter(record => {
        const matchesSearch = record.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const matchesDepartment = departmentFilter === 'All Departments' || record.userId?.department === departmentFilter;
        return matchesSearch && matchesDepartment;
    });

    const stats = {
        present: filteredRecords.filter(r => r.status === 'present').length,
        late: filteredRecords.filter(r => r.status === 'late').length,
        absent: filteredRecords.filter(r => r.status === 'absent').length,
        overtime: filteredRecords.reduce((sum, r) => sum + (r.overtime || 0), 0).toFixed(1)
    };

    const STATS = [
        { label: 'Total Present', value: stats.present.toString(), color: '#22c55e', bgColor: '#dcfce7' },
        { label: 'Total Late', value: stats.late.toString(), color: '#f97316', bgColor: '#ffedd5' },
        { label: 'Total Absent', value: stats.absent.toString(), color: '#ef4444', bgColor: '#fee2e2' },
        { label: 'Total Overtime', value: `${stats.overtime} hrs`, color: '#8b5cf6', bgColor: '#ede9fe' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const timeInDate = new Date(`${formData.date}T${formData.timeIn}:00`);
            const timeOutDate = new Date(`${formData.date}T${formData.timeOut}:00`);
            
            await attendanceAPI.create({
                userId: formData.userId,
                date: formData.date,
                timeIn: timeInDate.toISOString(),
                timeOut: timeOutDate.toISOString(),
                status: formData.status,
                notes: formData.notes
            });
            setShowModal(false);
            setFormData({ userId: '', date: new Date().toISOString().split('T')[0], timeIn: '08:00', timeOut: '17:00', status: 'present', notes: '' });
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to create attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
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
                    <h1 className="page-title">Time & Attendance Management</h1>
                    <p className="page-subtitle">Track and manage employee attendance records</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="primary-btn" onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        <span>Add Record</span>
                    </button>
                    <button className="primary-btn" style={{ background: '#64748b' }}>
                        <Download size={18} />
                        <span>Download Report</span>
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <div className="stats-row">
                {STATS.map((stat, index) => (
                    <div key={index} className="stat-mini-card" style={{ borderLeftColor: stat.color }}>
                        <span className="stat-mini-label">{stat.label}</span>
                        <span className="stat-mini-value" style={{ color: stat.color }}>{stat.value}</span>
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
                        <input type="text" placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="filter-select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                        <option>All Departments</option>
                        {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                    </select>
                    <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option>All Status</option>
                        <option>Present</option>
                        <option>Late</option>
                        <option>Absent</option>
                    </select>
                    <div className="date-picker">
                        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
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
                            <tr key={record._id}>
                                <td className="name-cell">{record.userId?.name || 'Unknown'}</td>
                                <td className="role-cell">{record.userId?.department || '-'}</td>
                                <td>{formatDate(record.date)}</td>
                                <td className="time-cell"><Clock size={14} /><span>{formatTime(record.timeIn)}</span></td>
                                <td className="time-cell"><Clock size={14} /><span>{formatTime(record.timeOut)}</span></td>
                                <td>{record.hoursWorked?.toFixed(2) || '0.00'} hrs</td>
                                <td className="overtime-cell">{record.overtime?.toFixed(2) || '0.00'} hrs</td>
                                <td>
                                    <span className={`status-badge-alt ${record.status}`}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Attendance Record</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Employee</label>
                                <select value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required>
                                    <option value="">Select Employee</option>
                                    {users.filter(u => ['lecturer', 'adminstaff'].includes(u.role)).map(u => (
                                        <option key={u._id} value={u._id}>{u.name} - {u.department}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Time In</label>
                                    <input type="time" value={formData.timeIn} onChange={e => setFormData({...formData, timeIn: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Time Out</label>
                                    <input type="time" value={formData.timeOut} onChange={e => setFormData({...formData, timeOut: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="present">Present</option>
                                    <option value="late">Late</option>
                                    <option value="absent">Absent</option>
                                    <option value="half-day">Half Day</option>
                                    <option value="on-leave">On Leave</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Record'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
