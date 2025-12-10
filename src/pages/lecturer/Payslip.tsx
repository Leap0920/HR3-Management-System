import { Download } from 'lucide-react';
import './Payslip.css';

export default function Payslip() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Payslip</h1>
                    <p className="page-subtitle">View and download your salary information</p>
                </div>
            </div>

            <div className="payslip-container">
                {/* Header */}
                <div className="payslip-header">
                    <h2 className="company-name">HR3 Management System</h2>
                    <p className="payslip-period">Payslip for November 1-15, 2025</p>
                </div>

                {/* Employee Info */}
                <div className="employee-info">
                    <div className="info-row">
                        <div className="info-item">
                            <span className="info-label">Employee Name</span>
                            <span className="info-value">Jane Smith</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Employee ID</span>
                            <span className="info-value">jane@hr3.com</span>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <span className="info-label">Department</span>
                            <span className="info-value">Computer Science</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Position</span>
                            <span className="info-value">Lecturer</span>
                        </div>
                    </div>
                </div>

                {/* Earnings */}
                <div className="payslip-section">
                    <h3 className="section-heading">Earnings</h3>
                    <div className="payslip-row">
                        <span className="row-label">Basic Salary</span>
                        <span className="row-amount">₱25,000.00</span>
                    </div>
                    <div className="payslip-row">
                        <span className="row-label">Actual Work Hours</span>
                        <span className="row-amount-muted">160 hrs</span>
                    </div>
                    <div className="payslip-row">
                        <span className="row-label">Overtime Hours</span>
                        <span className="row-amount-muted">12 hrs</span>
                    </div>
                    <div className="payslip-row">
                        <span className="row-label text-primary">Overtime Pay</span>
                        <span className="row-amount text-primary">₱1,875.00</span>
                    </div>
                    <div className="payslip-row">
                        <span className="row-label text-primary">Allowances</span>
                        <span className="row-amount text-primary">₱2,000.00</span>
                    </div>
                    <div className="payslip-row gross-row">
                        <span className="row-label text-primary">Gross Pay</span>
                        <span className="row-amount text-primary">₱28,875.00</span>
                    </div>
                </div>

                {/* Deductions */}
                <div className="payslip-section">
                    <h3 className="section-heading">Deductions</h3>
                    <div className="payslip-row">
                        <div className="row-label-group">
                            <span className="row-label text-primary">TARDINESS (Late + Undertime)</span>
                            <span className="row-sublabel">Late: 15 min | Undertime: 10 min</span>
                        </div>
                        <span className="row-amount text-red">₱65.10</span>
                    </div>
                    <div className="payslip-row">
                        <span className="row-label text-primary">SSS Contribution</span>
                        <span className="row-amount">₱1,125.00</span>
                    </div>
                    <div className="payslip-row">
                        <span className="row-label text-primary">PhilHealth Contribution</span>
                        <span className="row-amount">₱400.00</span>
                    </div>
                    <div className="payslip-row">
                        <span className="row-label text-primary">Pag-IBIG Contribution</span>
                        <span className="row-amount">₱100.00</span>
                    </div>
                    <div className="payslip-row">
                        <span className="row-label text-primary">Withholding Tax</span>
                        <span className="row-amount">₱2,500.00</span>
                    </div>
                    <div className="payslip-row deductions-row">
                        <span className="row-label text-red">Total Deductions</span>
                        <span className="row-amount text-red">₱4190.10</span>
                    </div>
                </div>

                {/* Net Pay */}
                <div className="net-pay-section">
                    <span className="net-pay-label">Net Pay</span>
                    <span className="net-pay-amount">₱24684.90</span>
                </div>

                {/* Download Button */}
                <button className="download-payslip-btn">
                    <Download size={18} />
                    <span>Download Payslip (PDF)</span>
                </button>
            </div>
        </div>
    );
}
