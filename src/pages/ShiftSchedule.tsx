import { useState, useEffect } from 'react';
import { Calendar, Users, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { schedulesAPI, usersAPI, type Schedule, type User } from '../services/api';
import './ShiftSchedule.css';

type ViewType = 'calendar' | 'list';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

export default function ShiftSchedule() {
    const [activeView, setActiveView] = useState<ViewType>('calendar');
    const [searchTerm, setSearchTerm] = useState('');
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [schedulesData, usersData] = await Promise.all([
                schedulesAPI.getAll(),
                usersAPI.getAll().catch(() => [] as User[])
            ]);
            setSchedules(schedulesData);
            setUsers(usersData);
        } catch (err) {
            console.error('Failed to load schedules');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const employees = users.filter(u => ['lecturer', 'adminstaff'].includes(u.role));
    const filteredEmployees = employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getEmployeeSchedules = (userId: string) => schedules.filter(s => (typeof s.userId === 'object' ? s.userId._id : s.userId) === userId);

    const getScheduleDisplay = (userId: string) => {
        const userSchedules = getEmployeeSchedules(userId);
        if (userSchedules.length === 0) return 'No schedule assigned';
        const days = [...new Set(userSchedules.map(s => s.dayOfWeek))];
        const times = userSchedules[0];
        return `${days.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join('/')} ${times?.startTime || ''}-${times?.endTime || ''}`;
    };

    const getCalendarSchedule = (day: string, hour: string) => {
        const dayLower = day.toLowerCase();
        return schedules.find(s => {
            if (s.dayOfWeek !== dayLower) return false;
            const startHour = parseInt(s.startTime.split(':')[0]);
            const endHour = parseInt(s.endTime.split(':')[0]);
            const currentHour = hour.includes('pm') && !hour.includes('12') ? parseInt(hour) + 12 : parseInt(hour);
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
            </div>

            <div className="view-controls">
                <div className="view-tabs">
                    <button className={`view-tab ${activeView === 'calendar' ? 'active' : ''}`} onClick={() => setActiveView('calendar')}>
                        <Calendar size={16} /><span>Calendar View</span>
                    </button>
                    <button className={`view-tab ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')}>
                        <Users size={16} /><span>Employee List</span>
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
                            {HOURS.map((hour) => <div key={hour} className="time-cell">{hour}</div>)}
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
                    <div className="list-header"><h2>Employee List</h2></div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Role</th>
                                    <th>Current Shift</th>
                                    <th>Status</th>
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
                                        <td><span className="status-badge active">Active</span></td>
                                        <td className="actions-cell">
                                            <button className="assign-btn">Assign</button>
                                            <button className="action-icon edit"><Pencil size={16} /></button>
                                            <button className="action-icon delete"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
