import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import './Reports.css';

interface ReportType {
    id: string;
    name: string;
    description: string;
}

interface GeneratedReport {
    id: number;
    name: string;
    generatedDate: string;
    type: string;
}

const REPORT_TYPES: ReportType[] = [
    { id: 'attendance', name: 'Attendance Summary Report', description: 'Complete attendance records with status and hours' },
    { id: 'payroll', name: 'Payroll Report', description: 'Salary computation breakdown and deductions' },
    { id: 'leave', name: 'Leave Summary Report', description: 'Leave requests and balance overview' },
    { id: 'schedule', name: 'Employee Schedule Report', description: 'Work schedules and shift assignments' },
    { id: 'overtime', name: 'Overtime Report', description: 'Overtime hours and compensation' },
    { id: 'department', name: 'Department Summary', description: 'Per-department HR metrics and analytics' },
];

const GENERATED_REPORTS: GeneratedReport[] = [
    { id: 1, name: 'Attendance Summary - November 2025', generatedDate: '11/24/2025', type: 'Attendance' },
    { id: 2, name: 'Payroll Report - November 1-15, 2025', generatedDate: '11/15/2025', type: 'Payroll' },
    { id: 3, name: 'Leave Summary - Q4 2025', generatedDate: '11/10/2025', type: 'Leave' },
    { id: 4, name: 'Department Summary - Computer Science', generatedDate: '11/05/2025', type: 'Department' },
];

export default function Reports() {
    const [selectedReport, setSelectedReport] = useState('attendance');
    const [startDate, setStartDate] = useState('2025-11-01');
    const [endDate, setEndDate] = useState('2025-11-24');
    const [department, setDepartment] = useState('All Departments');

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Documentation</h1>
                    <p className="page-subtitle">Generate and download HR reports</p>
                </div>
            </div>

            <div className="reports-layout">
                <div className="reports-main">
                    <h2 className="section-title">Select Report Type</h2>
                    <div className="report-types-list">
                        {REPORT_TYPES.map((report) => (
                            <div
                                key={report.id}
                                className={`report-type-card ${selectedReport === report.id ? 'selected' : ''}`}
                                onClick={() => setSelectedReport(report.id)}
                            >
                                <div className="report-icon">
                                    <FileText size={18} />
                                </div>
                                <div className="report-info">
                                    <span className="report-name">{report.name}</span>
                                    <span className="report-desc">{report.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="section-title mt-32">Recently Generated Reports</h2>
                    <div className="recent-reports-list">
                        {GENERATED_REPORTS.map((report) => (
                            <div key={report.id} className="recent-report-item">
                                <div className="report-icon small">
                                    <FileText size={16} />
                                </div>
                                <div className="report-info">
                                    <span className="report-name">{report.name}</span>
                                    <span className="report-date">Generated on {report.generatedDate}</span>
                                </div>
                                <span className="report-type-badge">{report.type}</span>
                                <button className="download-icon-btn">
                                    <Download size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="reports-sidebar">
                    <div className="filters-card">
                        <div className="filters-header">
                            <Filter size={16} />
                            <span>Report Filters</span>
                        </div>

                        <div className="filter-group">
                            <label>
                                <Calendar size={14} />
                                <span>Start Date</span>
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label>
                                <Calendar size={14} />
                                <span>End Date</span>
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Department</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option>All Departments</option>
                                <option>Computer Science</option>
                                <option>Engineering</option>
                                <option>Administration</option>
                            </select>
                        </div>

                        <button className="generate-btn">
                            <Download size={16} />
                            <span>Generate Report (PDF)</span>
                        </button>
                    </div>

                    <div className="quick-stats-card">
                        <h3>Quick Statistics</h3>
                        <div className="stat-row">
                            <span className="stat-name">Total Reports</span>
                            <span className="stat-val primary">156</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-name">This Month</span>
                            <span className="stat-val">24</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-name">Last Generated</span>
                            <span className="stat-val primary">Today</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
