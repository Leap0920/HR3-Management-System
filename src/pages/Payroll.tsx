import { useState } from 'react';
import { Calculator, Eye, Calendar } from 'lucide-react';
import './Payroll.css';

interface PayrollRecord {
    id: number;
    employeeName: string;
    employeeRole: string;
    department: string;
    basicSalary: number;
    grossPay: number;
    deductions: number;
    netPay: number;
}

const PAYROLL_DATA: PayrollRecord[] = [
    { id: 1, employeeName: 'Jane Smith', employeeRole: 'Lecturer', department: 'Computer Science', basicSalary: 25000, grossPay: 28875, deductions: 4190.10, netPay: 24684.90 },
    { id: 2, employeeName: 'Robert Chen', employeeRole: 'Lecturer', department: 'Engineering', basicSalary: 22000, grossPay: 24900, deductions: 3659.09, netPay: 21240.91 },
    { id: 3, employeeName: 'Mary Johnson', employeeRole: 'Admin Staff', department: 'Administration', basicSalary: 18000, grossPay: 21800, deductions: 3140.78, netPay: 18659.22 },
];

const formatCurrency = (amount: number) => {
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Payroll() {
    const [payrollPeriod] = useState('November 1-15, 2025');
    const totalPayroll = PAYROLL_DATA.reduce((sum, record) => sum + record.netPay, 0);

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payroll Management</h1>
                    <p className="page-subtitle">Compute and manage employee salaries</p>
                </div>
                <button className="primary-btn">
                    <Calculator size={18} />
                    <span>Compute Payroll</span>
                </button>
            </div>

            <div className="payroll-summary">
                <div className="period-selector">
                    <div className="period-label">
                        <Calendar size={16} />
                        <span>Payroll Period</span>
                    </div>
                    <select className="period-select" value={payrollPeriod}>
                        <option>November 1-15, 2025</option>
                        <option>November 16-30, 2025</option>
                        <option>October 16-31, 2025</option>
                    </select>
                </div>
                <div className="total-payroll-card">
                    <span className="total-label">Total Payroll</span>
                    <span className="total-value">{formatCurrency(totalPayroll)}</span>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table payroll-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Basic Salary</th>
                            <th>Gross Pay</th>
                            <th>Deductions</th>
                            <th>Net Pay</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PAYROLL_DATA.map((record) => (
                            <tr key={record.id}>
                                <td>
                                    <div className="employee-cell">
                                        <span className="emp-name">{record.employeeName}</span>
                                        <span className="emp-role">{record.employeeRole}</span>
                                    </div>
                                </td>
                                <td>{record.department}</td>
                                <td className="salary-cell">{formatCurrency(record.basicSalary)}</td>
                                <td className="salary-cell">{formatCurrency(record.grossPay)}</td>
                                <td className="deduction-cell">{formatCurrency(record.deductions)}</td>
                                <td className="net-pay-cell">{formatCurrency(record.netPay)}</td>
                                <td>
                                    <button className="view-btn">
                                        <Eye size={14} />
                                        <span>View</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
