import { useState } from 'react';
import { Calendar, Users, Search, Pencil, Trash2 } from 'lucide-react';
import './ShiftSchedule.css';

type ViewType = 'calendar' | 'list';

interface Employee {
    id: number;
    name: string;
    department: string;
    role: string;
    currentShift: string;
    status: 'Active' | 'Inactive';
}

interface ScheduleEntry {
    time: string;
    location: string;
    employee: string;
}

const EMPLOYEES_DATA: Employee[] = [
    { id: 1, name: 'Jane Smith', department: 'Computer Science', role: 'Lecturer', currentShift: 'Mon/Wed/Fri 8AM-4PM', status: 'Active' },
    { id: 2, name: 'Robert Chen', department: 'Engineering', role: 'Lecturer', currentShift: 'Tue/Thu 9AM-5PM', status: 'Active' },
    { id: 3, name: 'Mary Johnson', department: 'Administration', role: 'Admin Staff', currentShift: 'Mon-Fri 8AM-5PM', status: 'Active' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

const SCHEDULE_DATA: Record<string, ScheduleEntry | null> = {
    'Monday-8am': { time: '08:00 - 17:00', location: 'Office', employee: 'Mary Johnson' },
    'Tuesday-8am': { time: '08:00 - 17:00', location: 'Office', employee: 'Mary Johnson' },
    'Wednesday-8am': { time: '08:00 - 17:00', location: 'Office', employee: 'Mary Johnson' },
    'Thursday-8am': { time: '08:00 - 17:00', location: 'Office', employee: 'Mary Johnson' },
    'Friday-8am': { time: '08:00 - 17:00', location: 'Office', employee: 'Mary Johnson' },
};

export default function ShiftSchedule() {
    const [activeView, setActiveView] = useState<ViewType>('calendar');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmployees = EMPLOYEES_DATA.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <button
                        className={`view-tab ${activeView === 'calendar' ? 'active' : ''}`}
                        onClick={() => setActiveView('calendar')}
                    >
                        <Calendar size={16} />
                        <span>Calendar View</span>
                    </button>
                    <button
                        className={`view-tab ${activeView === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveView('list')}
                    >
                        <Users size={16} />
                        <span>Employee List</span>
                    </button>
                </div>
                <div className="search-bar compact">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                                    const key = `${day}-${hour}`;
                                    const schedule = SCHEDULE_DATA[key];
                                    const isShiftStart = schedule && hour === '8am';
                                    const isInShift = schedule || (SCHEDULE_DATA[`${day}-8am`] &&
                                        HOURS.indexOf(hour) >= HOURS.indexOf('8am') &&
                                        HOURS.indexOf(hour) <= HOURS.indexOf('4pm'));

                                    return (
                                        <div
                                            key={key}
                                            className={`schedule-cell ${isInShift ? 'has-shift' : ''}`}
                                        >
                                            {isShiftStart && schedule && (
                                                <div className="shift-info">
                                                    <span className="shift-time">{schedule.time}</span>
                                                    <span className="shift-location">{schedule.location}</span>
                                                    <span className="shift-employee">{schedule.employee}</span>
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
                    <div className="list-header">
                        <h2>Employee List</h2>
                    </div>
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
                                    <tr key={emp.id}>
                                        <td className="name-cell">{emp.name}</td>
                                        <td className="role-cell">{emp.department}</td>
                                        <td className="role-cell">{emp.role}</td>
                                        <td className="shift-cell">{emp.currentShift}</td>
                                        <td>
                                            <span className={`status-badge ${emp.status.toLowerCase()}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button className="assign-btn">Assign</button>
                                            <button className="action-icon edit">
                                                <Pencil size={16} />
                                            </button>
                                            <button className="action-icon delete">
                                                <Trash2 size={16} />
                                            </button>
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
