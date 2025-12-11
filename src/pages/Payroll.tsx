import { useState, useEffect } from 'react';
import { Calculator, Eye, Calendar, Plus, X, Loader2 } from 'lucide-react';
import { payrollAPI, usersAPI, type Payroll as PayrollType, type User } from '../services/api';
import './Payroll.css';

const formatCurrency = (amount: number) => {
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Payroll() {
    const [payrollPeriod, setPayrollPeriod] = useState('');
    const [payrolls, setPayrolls] = useState<PayrollType[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState<PayrollType | null>(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        period: '',
        basicSalary: 25000,
        overtimePay: 0,
        allowances: 0,
        sss: 0,
        philhealth: 0,
        pagibig: 100,
        tax: 0,
        tardiness: 0,
        other: 0
    });
    const [generateData, setGenerateData] = useState({ period: '', basicSalary: 25000 });

    const fetchData = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (payrollPeriod) params.period = payrollPeriod;
            const [payrollData, usersData] = await Promise.all([
                payrollAPI.getAll(params),
                usersAPI.getAll().catch(() => [] as User[])
            ]);
            setPayrolls(payrollData);
            setUsers(usersData);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await payrollAPI.create({
                userId: formData.userId,
                period: formData.period,
                basicSalary: formData.basicSalary,
                overtimePay: formData.overtimePay,
                allowances: formData.allowances,
                deductions: {
                    sss: formData.sss,
                    philhealth: formData.philhealth,
                    pagibig: formData.pagibig,
                    tax: formData.tax,
                    tardiness: formData.tardiness,
                    other: formData.other
                }
            });
            setShowModal(false);
            resetForm();
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to create payroll');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setSubmitting(true);
            const result = await payrollAPI.generate(generateData);
            alert(result.message);
            setShowGenerateModal(false);
            setGenerateData({ period: '', basicSalary: 25000 });
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to generate payroll');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: 'processed' | 'paid') => {
        try {
            await payrollAPI.update(id, { status });
            await fetchData();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update status');
        }
    };

    const resetForm = () => {
        setFormData({
            userId: '', period: '', basicSalary: 25000, overtimePay: 0, allowances: 0,
            sss: 0, philhealth: 0, pagibig: 100, tax: 0, tardiness: 0, other: 0
        });
    };

    const calculateDeductions = () => {
        const basic = formData.basicSalary;
        setFormData({
            ...formData,
            sss: Math.round(basic * 0.045 * 100) / 100,
            philhealth: Math.round(basic * 0.02 * 100) / 100,
            tax: Math.round(basic * 0.1 * 100) / 100
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
                    <h1 className="page-title">Payroll Management</h1>
                    <p className="page-subtitle">Compute and manage employee salaries</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="primary-btn" onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        <span>Add Payroll</span>
                    </button>
                    <button className="primary-btn" onClick={() => setShowGenerateModal(true)}>
                        <Calculator size={18} />
                        <span>Generate Payroll</span>
                    </button>
                </div>
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
                        <option value="">All Periods</option>
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
                            <th>Period</th>
                            <th>Basic Salary</th>
                            <th>Gross Pay</th>
                            <th>Deductions</th>
                            <th>Net Pay</th>
                            <th>Status</th>
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
                                <td>{record.period}</td>
                                <td className="salary-cell">{formatCurrency(record.basicSalary)}</td>
                                <td className="salary-cell">{formatCurrency(record.grossPay)}</td>
                                <td className="deduction-cell">{formatCurrency(record.totalDeductions)}</td>
                                <td className="net-pay-cell">{formatCurrency(record.netPay)}</td>
                                <td>
                                    <span className={`status-badge ${record.status}`}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="view-btn" onClick={() => setShowViewModal(record)}>
                                            <Eye size={14} />
                                            <span>View</span>
                                        </button>
                                        {record.status === 'pending' && (
                                            <button className="view-btn" style={{ background: '#22c55e', color: 'white' }} onClick={() => handleUpdateStatus(record._id, 'processed')}>
                                                Process
                                            </button>
                                        )}
                                        {record.status === 'processed' && (
                                            <button className="view-btn" style={{ background: '#5d5fdb', color: 'white' }} onClick={() => handleUpdateStatus(record._id, 'paid')}>
                                                Mark Paid
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Add Payroll Record</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Employee</label>
                                    <select value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required>
                                        <option value="">Select Employee</option>
                                        {users.filter(u => ['lecturer', 'adminstaff'].includes(u.role)).map(u => (
                                            <option key={u._id} value={u._id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Period</label>
                                    <input type="text" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} placeholder="e.g., December 1-15, 2025" required />
                                </div>
                                <div className="form-group">
                                    <label>Basic Salary</label>
                                    <input type="number" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: Number(e.target.value)})} onBlur={calculateDeductions} required />
                                </div>
                                <div className="form-group">
                                    <label>Overtime Pay</label>
                                    <input type="number" value={formData.overtimePay} onChange={e => setFormData({...formData, overtimePay: Number(e.target.value)})} />
                                </div>
                                <div className="form-group">
                                    <label>Allowances</label>
                                    <input type="number" value={formData.allowances} onChange={e => setFormData({...formData, allowances: Number(e.target.value)})} />
                                </div>
                                <div className="form-group">
                                    <label>SSS</label>
                                    <input type="number" value={formData.sss} onChange={e => setFormData({...formData, sss: Number(e.target.value)})} />
                                </div>
                                <div className="form-group">
                                    <label>PhilHealth</label>
                                    <input type="number" value={formData.philhealth} onChange={e => setFormData({...formData, philhealth: Number(e.target.value)})} />
                                </div>
                                <div className="form-group">
                                    <label>Pag-IBIG</label>
                                    <input type="number" value={formData.pagibig} onChange={e => setFormData({...formData, pagibig: Number(e.target.value)})} />
                                </div>
                                <div className="form-group">
                                    <label>Tax</label>
                                    <input type="number" value={formData.tax} onChange={e => setFormData({...formData, tax: Number(e.target.value)})} />
                                </div>
                                <div className="form-group">
                                    <label>Tardiness</label>
                                    <input type="number" value={formData.tardiness} onChange={e => setFormData({...formData, tardiness: Number(e.target.value)})} />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Create Payroll'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showGenerateModal && (
                <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2>Generate Payroll</h2>
                            <button className="close-btn" onClick={() => setShowGenerateModal(false)}><X size={20} /></button>
                        </div>
                        <p style={{ color: '#64748b', marginBottom: '16px' }}>This will generate payroll records for all employees.</p>
                        <div className="form-group">
                            <label>Period</label>
                            <input type="text" value={generateData.period} onChange={e => setGenerateData({...generateData, period: e.target.value})} placeholder="e.g., December 1-15, 2025" required />
                        </div>
                        <div className="form-group">
                            <label>Default Basic Salary</label>
                            <input type="number" value={generateData.basicSalary} onChange={e => setGenerateData({...generateData, basicSalary: Number(e.target.value)})} />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowGenerateModal(false)}>Cancel</button>
                            <button type="button" className="btn-primary" onClick={handleGenerate} disabled={submitting || !generateData.period}>
                                {submitting ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showViewModal && (
                <div className="modal-overlay" onClick={() => setShowViewModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Payslip Details</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(null)}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '16px 0' }}>
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
                            <p><strong>Tardiness:</strong> {formatCurrency(showViewModal.deductions.tardiness)}</p>
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
