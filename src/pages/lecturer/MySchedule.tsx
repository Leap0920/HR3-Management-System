import './MySchedule.css';

interface CourseSchedule {
    id: number;
    course: string;
    days: string;
    time: string;
    room: string;
    code: string;
}

const SCHEDULE_DATA: CourseSchedule[] = [
    { id: 1, course: 'Computer Science 101', days: 'Mon/Wed/Fri', time: '8:00 AM - 10:00 AM', room: 'CS Lab 1', code: 'CS-3A' },
    { id: 2, course: 'Database Systems', days: 'Tue/Thu', time: '1:00 PM - 3:00 PM', room: 'CS Lab 2', code: 'CS-4B' },
    { id: 3, course: 'Data Structures', days: 'Wed/Fri', time: '3:00 PM - 5:00 PM', room: 'CS Lab 1', code: 'CS-2A' },
];

export default function MySchedule() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Schedule</h1>
                    <p className="page-subtitle">Your teaching schedule and assignments</p>
                </div>
            </div>

            {/* Upcoming Shift */}
            <div className="upcoming-shift-banner">
                <span className="shift-label">Upcoming Shift</span>
                <span className="shift-time">8:00 AM – 4:00 PM</span>
                <span className="shift-days">Monday - Friday</span>
            </div>

            {/* Weekly Schedule */}
            <div className="schedule-section">
                <h2 className="section-title">Weekly Schedule Summary</h2>
                <div className="schedule-cards">
                    {SCHEDULE_DATA.map((course) => (
                        <div key={course.id} className="schedule-card">
                            <div className="schedule-card-header">
                                <h3 className="course-name">{course.course}</h3>
                                <span className="course-code">{course.code}</span>
                            </div>
                            <div className="schedule-details">
                                <div className="detail-item">
                                    <span className="detail-label">Day(s)</span>
                                    <span className="detail-value">{course.days}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Time</span>
                                    <span className="detail-value">{course.time}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Room</span>
                                    <span className="detail-value">{course.room}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
