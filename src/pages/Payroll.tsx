import { useState, useEffect } from 'react';
import { Calculator, Eye, Calendar, Loader2 } from 'lucide-react';
import { payrollAPI, type Payroll as PayrollType } from '../services/api';
import './Payroll.css';

const formatCurrency = (amount: number) => {
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Payroll() {
    const [payrollPeriod, setPayrollPeriod] = useState('');
    const [payrolls, setPayrolls] = useState<PayrollType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showViewModal, setShowViewModal] = useState<PayrollType | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (payrollPeriod) params.period = payrollPeriod;
            const payrollData = await payrollAPI.getAll(params);
            setPayrolls(payrollData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load payroll data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [payrollPeriod]);

    const totalPayroll = payrolls.reduce((sum, record) => sum + record.netPay, 0);
    const periods = [...new Set(payrolls.map(p => p.period))];

    const handleComputePayroll = async () => {
        const period = prompt('Enter payroll period (e.g., December 1-15, 2025):');
        if (!period) return;
        try {
            await payrollAPI.generate({ period, basicSalary: 25000 });
            await fetchData();
            alert('Payroll computed successfully!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to compute payroll');
        }
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
                    <h1 className="page-title">Payroll Management</h1>
                    <p className="page-subtitle">Compute and manage employee salaries</p>
                </div>
                <button className="primary-btn" onClick={handleComputePayroll}>
                    <Calculator size={18} />
                    <span>Compute Payroll</span>
                </button>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            <div className="payroll-summary">
                <div className="period-selector">
                    <div className="period-label">
                        <Calendar size={16} />
                        <span>Payroll Period</span>
                    </div>
                    <select className="period-select" value={payrollPeriod} onChange={e => setPayrollPeriod(e.target.value)}>
                        <option value="">November 1-15, 2025</option>
                        {periods.map(p => <option key={p} value={p}>{p}</option>)}
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
                        {payrolls.map((record) => (
                            <tr key={record._id}>
                                <td>
                                    <div className="employee-cell">
                                        <span className="emp-name">{record.userId?.name || 'Unknown'}</span>
                                        <span className="emp-role">{record.userId?.role || ''}</span>
                                    </div>
                                </td>
                                <td>{record.userId?.department || '-'}</td>
                                <td className="salary-cell">{formatCurrency(record.basicSalary)}</td>
                                <td className="salary-cell">{formatCurrency(record.grossPay)}</td>
                                <td className="deduction-cell">{formatCurrency(record.totalDeductions)}</td>
                                <td className="net-pay-cell">{formatCurrency(record.netPay)}</td>
                                <td>
                                    <button className="view-btn" onClick={() => setShowViewModal(record)}>
                                        <Eye size={14} />
                                        <span>View</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showViewModal && (
                <div className="modal-overlay" onClick={() => setShowViewModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Payslip Details</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(null)}>×</button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <p><strong>Employee:</strong> {showViewModal.userId?.name}</p>
                            <p><strong>Period:</strong> {showViewModal.period}</p>
                            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                            <p><strong>Basic Salary:</strong> {formatCurrency(showViewModal.basicSalary)}</p>
                            <p><strong>Overtime Pay:</strong> {formatCurrency(showViewModal.overtimePay)}</p>
                            <p><strong>Allowances:</strong> {formatCurrency(showViewModal.allowances)}</p>
                            <p style={{ color: '#22c55e' }}><strong>Gross Pay:</strong> {formatCurrency(showViewModal.grossPay)}</p>
                            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                            <p><strong>SSS:</strong> {formatCurrency(showViewModal.deductions.sss)}</p>
                            <p><strong>PhilHealth:</strong> {formatCurrency(showViewModal.deductions.philhealth)}</p>
                            <p><strong>Pag-IBIG:</strong> {formatCurrency(showViewModal.deductions.pagibig)}</p>
                            <p><strong>Tax:</strong> {formatCurrency(showViewModal.deductions.tax)}</p>
                            <p style={{ color: '#ef4444' }}><strong>Total Deductions:</strong> {formatCurrency(showViewModal.totalDeductions)}</p>
                            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                            <p style={{ fontSize: '1.2rem', color: '#5d5fdb' }}><strong>Net Pay:</strong> {formatCurrency(showViewModal.netPay)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
