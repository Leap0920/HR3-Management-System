import './FacultySchedules.css';

interface Schedule {
    id: number;
    faculty: string;
    subject: string;
    days: string;
    time: string;
    room: string;
}

const SCHEDULES_DATA: Schedule[] = [
    { id: 1, faculty: 'Jane Smith', subject: 'Computer Science 101', days: 'Mon/Wed/Fri', time: '8:00 AM - 10:00 AM', room: 'CS Lab 1' },
    { id: 2, faculty: 'Jane Smith', subject: 'Database Systems', days: 'Tue/Thu', time: '1:00 PM - 3:00 PM', room: 'CS Lab 2' },
];

export default function FacultySchedules() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Faculty Schedules</h1>
                    <p className="page-subtitle">View and manage faculty teaching schedules</p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table faculty-table">
                    <thead>
                        <tr>
                            <th>Faculty</th>
                            <th>Subject</th>
                            <th>Day(s)</th>
                            <th>Time</th>
                            <th>Room</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SCHEDULES_DATA.map((schedule) => (
                            <tr key={schedule.id}>
                                <td className="faculty-name">{schedule.faculty}</td>
                                <td className="subject-cell">{schedule.subject}</td>
                                <td className="days-cell">{schedule.days}</td>
                                <td className="time-cell">{schedule.time}</td>
                                <td className="room-cell">{schedule.room}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
