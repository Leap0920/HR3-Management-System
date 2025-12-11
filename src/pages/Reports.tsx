import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, Loader2 } from 'lucide-react';
import { attendanceAPI, payrollAPI, leaveAPI, departmentsAPI, type Department } from '../services/api';
import './Reports.css';

interface ReportType {
    id: string;
    name: string;
    description: string;
}

const REPORT_TYPES: ReportType[] = [
    { id: 'attendance', name: 'Attendance Summary Report', description: 'Complete attendance records with status and hours' },
    { id: 'payroll', name: 'Payroll Report', description: 'Salary computation breakdown and deductions' },
    { id: 'leave', name: 'Leave Summary Report', description: 'Leave requests and balance overview' },
    { id: 'department', name: 'Department Summary', description: 'Per-department HR metrics and analytics' },
];

export default function Reports() {
    const [selectedReport, setSelectedReport] = useState('attendance');
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [department, setDepartment] = useState('All Departments');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<unknown>(null);
    const [stats, setStats] = useState({ totalReports: 0, thisMonth: 0 });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await departmentsAPI.getAll();
                setDepartments(data);
            } catch (err) {
                console.error('Failed to load departments');
            }
        };
        fetchDepartments();
    }, []);

    const generateReport = async () => {
        try {
            setLoading(true);
            let data;
            
            switch (selectedReport) {
                case 'attendance':
                    data = await attendanceAPI.getAll({ startDate, endDate });
                    break;
                case 'payroll':
                    data = await payrollAPI.getAll();
                    break;
                case 'leave':
                    data = await leaveAPI.getAll();
                    break;
                case 'department':
                    data = await departmentsAPI.getAll();
                    break;
            }
            
            setReportData(data);
            setStats(prev => ({ ...prev, totalReports: prev.totalReports + 1, thisMonth: prev.thisMonth + 1 }));
            
            // Generate downloadable report
            const reportContent = JSON.stringify(data, null, 2);
            const blob = new Blob([reportContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

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

                    {reportData && (
                        <div style={{ marginTop: '24px' }}>
                            <h2 className="section-title">Report Preview</h2>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', maxHeight: '300px', overflow: 'auto' }}>
                                <pre style={{ fontSize: '0.8rem', color: '#475569' }}>
                                    {JSON.stringify(reportData, null, 2).slice(0, 2000)}
                                    {JSON.stringify(reportData, null, 2).length > 2000 && '...'}
                                </pre>
                            </div>
                        </div>
                    )}
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
                                {departments.map(d => (
                                    <option key={d._id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <button className="generate-btn" onClick={generateReport} disabled={loading}>
                            {loading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
                            <span>{loading ? 'Generating...' : 'Generate Report'}</span>
                        </button>
                    </div>

                    <div className="quick-stats-card">
                        <h3>Quick Statistics</h3>
                        <div className="stat-row">
                            <span className="stat-name">Total Reports</span>
                            <span className="stat-val primary">{stats.totalReports}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-name">This Session</span>
                            <span className="stat-val">{stats.thisMonth}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-name">Last Generated</span>
                            <span className="stat-val primary">{reportData ? 'Just now' : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
