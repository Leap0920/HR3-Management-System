import './AttendanceOverview.css';

interface AttendanceRecord {
    id: number;
    faculty: string;
    totalHours: string;
    lateCount: number;
    absentCount: number;
    attendanceRate: string;
}

const ATTENDANCE_DATA: AttendanceRecord[] = [
    { id: 1, faculty: 'Jane Smith', totalHours: '38 hrs', lateCount: 1, absentCount: 0, attendanceRate: '98%' },
    { id: 2, faculty: 'Robert Chen', totalHours: '35 hrs', lateCount: 2, absentCount: 1, attendanceRate: '92%' },
];

export default function AttendanceOverview() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Attendance Overview</h1>
                    <p className="page-subtitle">Monitor faculty attendance and hours</p>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table attendance-overview-table">
                    <thead>
                        <tr>
                            <th>Faculty</th>
                            <th>Total Hours (Week)</th>
                            <th>Late Count</th>
                            <th>Absent Count</th>
                            <th>Attendance Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ATTENDANCE_DATA.map((record) => (
                            <tr key={record.id}>
                                <td className="faculty-name">{record.faculty}</td>
                                <td>{record.totalHours}</td>
                                <td className="late-count">{record.lateCount}</td>
                                <td className="absent-count">{record.absentCount}</td>
                                <td className="rate-cell">{record.attendanceRate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
