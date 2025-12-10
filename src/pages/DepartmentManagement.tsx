import { Building2, Plus, Pencil, Trash2, Users } from 'lucide-react';
import './DepartmentManagement.css';

interface Department {
    id: number;
    name: string;
    code: string;
    employeeCount: number;
    head: string;
    description: string;
}

const DEPARTMENTS_DATA: Department[] = [
    {
        id: 1,
        name: 'Computer Science',
        code: 'CS',
        employeeCount: 12,
        head: 'Dean Johnson',
        description: 'Computer Science and IT Department'
    },
    {
        id: 2,
        name: 'Engineering',
        code: 'ENG',
        employeeCount: 8,
        head: 'Dr. Smith',
        description: 'Engineering Department'
    },
    {
        id: 3,
        name: 'Business',
        code: 'BUS',
        employeeCount: 6,
        head: 'Prof. Williams',
        description: 'Business and Management Department'
    },
];

export default function DepartmentManagement() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Department Management</h1>
                    <p className="page-subtitle">Manage organizational departments and units</p>
                </div>
                <button className="primary-btn">
                    <Plus size={18} />
                    <span>Add Department</span>
                </button>
            </div>

            <div className="departments-grid">
                {DEPARTMENTS_DATA.map((dept) => (
                    <div key={dept.id} className="department-card">
                        <div className="card-header">
                            <div className="dept-icon">
                                <Building2 size={20} />
                            </div>
                            <div className="card-actions">
                                <button className="action-icon edit">
                                    <Pencil size={16} />
                                </button>
                                <button className="action-icon delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="dept-name">{dept.name}</h3>
                        <p className="dept-code">Code: {dept.code}</p>

                        <div className="dept-info">
                            <div className="info-row">
                                <Users size={16} />
                                <span>{dept.employeeCount} Employees</span>
                            </div>
                            <p className="dept-head">Head: {dept.head}</p>
                        </div>

                        <p className="dept-description">{dept.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
