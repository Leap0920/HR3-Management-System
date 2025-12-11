import { useState, useEffect } from 'react';
import { Calendar, Users, Search, Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { schedulesAPI, usersAPI, type Schedule, type User } from '../services/api';
import './ShiftSchedule.css';

type ViewType = 'calendar' | 'list';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

export default function ShiftSchedule() {
    const [activeView, setActiveView] = useState<ViewType>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        shiftName: 'Regular Shift',
        dayOfWeek: 'monday',
        startTime: '08:00',
        endTime: '17:00'
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [schedulesData, usersData] = await Promise.all([
                schedulesAPI.getAll(),
                usersAPI.getAll().catch(() => [] as User[])
            ]);
            setSchedules(schedulesData);
            setUsers(usersData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load schedules');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const employees = users.filter(u => ['lecturer', 'adminstaff'].includes(u.role));
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getEmployeeSchedules = (userId: string) => {
        return schedules.filter(s => s.userId?._id === userId || s.userId === userId);
    };

    const getScheduleDisplay = (userId: string) => {
        const userSchedules = getEmployeeSchedules(userId);
        if (userSchedules.length === 0) return 'No schedule assigned';
        const days = [...new Set(userSchedules.map(s => s.dayOfWeek))];
        const times = userSchedules[0];
        return `${days.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join('/')} ${times?.startTime || ''}-${times?.endTime || ''}`;
    };

    const handleOpenModal = (schedule?: Schedule) => {
        if (schedule) {
            setEditingSchedule(schedule);
            setFormData({
                userId: typeof schedule.userId === 'object' ? schedule.userId._id : schedule.userId,
                shiftName: schedule.shiftName,
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime
            });
        } else {
            setEditingSchedule(null);
            setFormData({ userId: '', shiftName: 'Regular Shift', dayOfWeek: 'monday', startTime: '08:00', endTime: '17:00' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingSchedule) {
                await schedulesAPI.update(editingSchedule._id, formData);
            } else {
                await schedulesAPI.create(formData);
            }
            setShowModal(false);
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to save schedule');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this schedule?')) return;
        try {
            await schedulesAPI.delete(id);
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete schedule');
        }
    };

    const getCalendarSchedule = (day: string, hour: string) => {
        const dayLower = day.toLowerCase();
        return schedules.find(s => {
            if (s.dayOfWeek !== dayLower) return false;
            const startHour = parseInt(s.startTime.split(':')[0]);
            const endHour = parseInt(s.endTime.split(':')[0]);
            const currentHour = hour.includes('pm') && !hour.includes('12') 
                ? parseInt(hour) + 12 
                : parseInt(hour);
            return currentHour >= startHour && currentHour < endHour;
        });
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
                    <h1 className="page-title">Shift & Schedule Manager</h1>
                    <p className="page-subtitle">Assign and manage employee work schedules</p>
                </div>
                <button className="primary-btn" onClick={() => handleOpenModal()}>
                    <Plus size={18} />
                    <span>Add Schedule</span>
                </button>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <div className="view-controls">
                <div className="view-tabs">
                    <button className={`view-tab ${activeView === 'calendar' ? 'active' : ''}`} onClick={() => setActiveView('calendar')}>
                        <Calendar size={16} />
                        <span>Calendar View</span>
                    </button>
                    <button className={`view-tab ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')}>
                        <Users size={16} />
                        <span>Employee List</span>
                    </button>
                </div>
                <div className="search-bar compact">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {activeView === 'calendar' ? (
                <div className="calendar-container">
                    <div className="calendar-grid">
                        <div className="time-column">
                            <div className="header-cell"></div>
                            {HOURS.map((hour) => (
                                <div key={hour} className="time-cell">{hour}</div>
                            ))}
                        </div>
                        {DAYS.map((day) => (
                            <div key={day} className="day-column">
                                <div className={`header-cell ${day === 'Friday' ? 'friday' : ''}`}>{day}</div>
                                {HOURS.map((hour) => {
                                    const schedule = getCalendarSchedule(day, hour);
                                    return (
                                        <div key={`${day}-${hour}`} className={`schedule-cell ${schedule ? 'has-shift' : ''}`}>
                                            {schedule && hour === '8am' && (
                                                <div className="shift-info">
                                                    <span className="shift-time">{schedule.startTime} - {schedule.endTime}</span>
                                                    <span className="shift-employee">{typeof schedule.userId === 'object' ? schedule.userId.name : ''}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="list-container">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Role</th>
                                    <th>Current Schedule</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td className="name-cell">{emp.name}</td>
                                        <td className="role-cell">{emp.department || '-'}</td>
                                        <td className="role-cell">{emp.role}</td>
                                        <td className="shift-cell">{getScheduleDisplay(emp._id)}</td>
                                        <td className="actions-cell">
                                            <button className="assign-btn" onClick={() => { setFormData({...formData, userId: emp._id}); setShowModal(true); }}>
                                                Assign
                                            </button>
                                            {getEmployeeSchedules(emp._id).map(s => (
                                                <span key={s._id} style={{ display: 'inline-flex', gap: '4px', marginLeft: '8px' }}>
                                                    <button className="action-icon edit" onClick={() => handleOpenModal(s)}>
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button className="action-icon delete" onClick={() => handleDelete(s._id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingSchedule ? 'Edit Schedule' : 'Add Schedule'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Employee</label>
                                <select value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required>
                                    <option value="">Select Employee</option>
                                    {employees.map(u => <option key={u._id} value={u._id}>{u.name} - {u.department}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Shift Name</label>
                                <input type="text" value={formData.shiftName} onChange={e => setFormData({...formData, shiftName: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Day of Week</label>
                                <select value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}>
                                    <option value="monday">Monday</option>
                                    <option value="tuesday">Tuesday</option>
                                    <option value="wednesday">Wednesday</option>
                                    <option value="thursday">Thursday</option>
                                    <option value="friday">Friday</option>
                                    <option value="saturday">Saturday</option>
                                    <option value="sunday">Sunday</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
