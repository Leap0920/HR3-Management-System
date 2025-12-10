import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LayoutGrid } from 'lucide-react';
import './Login.css';

const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'superadmin@hr3.com', pass: 'SuperAdmin123!', path: '/dashboard' },
  { role: 'HR Admin', email: 'hradmin@hr3.com', pass: 'HRAdmin123!', path: '/hr-admin' },
  { role: 'Dean', email: 'dean@hr3.com', pass: 'Dean123!', path: '/dean' },
  { role: 'Lecturer', email: 'jane@hr3.com', pass: 'Lecturer123!', path: '/lecturer' },
  { role: 'Admin Staff', email: 'mary@hr3.com', pass: 'AdminStaff123!', path: '/admin-staff' },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleDemoClick = (demoEmail: string, demoPass: string, path: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    // Simulate auto-login for demo
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find matching demo account to determine dashboard
    const account = DEMO_ACCOUNTS.find(acc => acc.email === email && acc.pass === password);
    if (account) {
      navigate(account.path);
    } else {
      // Default fallback for demo purposes
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        {/* Decorative background or branding can go here */}
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <div className="logo-container">
              <LayoutGrid size={40} color="var(--primary-color)" />
            </div>
            <h1>Sign In</h1>
            <p className="subtitle">Access your HR3 Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="your.email@hr3.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Sign In
            </button>
          </form>

          <div className="demo-accounts">
            <h3>Demo Accounts</h3>
            <div className="demo-list">
              {DEMO_ACCOUNTS.map((acc, index) => (
                <div
                  key={index}
                  className="demo-item"
                  onClick={() => handleDemoClick(acc.email, acc.pass, acc.path)}
                >
                  <p className="demo-role">{acc.role}: <span className="demo-email">{acc.email}</span></p>
                  <p className="demo-pass">| {acc.pass}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
