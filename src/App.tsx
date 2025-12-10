import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import ShiftSchedule from './pages/ShiftSchedule';
import Attendance from './pages/Attendance';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="schedule" element={<ShiftSchedule />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<div className="page-content"><h1 className="page-title">Leave Management</h1><p>Coming soon...</p></div>} />
          <Route path="payroll" element={<div className="page-content"><h1 className="page-title">Payroll</h1><p>Coming soon...</p></div>} />
          <Route path="reports" element={<div className="page-content"><h1 className="page-title">Reports</h1><p>Coming soon...</p></div>} />
          <Route path="settings" element={<div className="page-content"><h1 className="page-title">System Settings</h1><p>Coming soon...</p></div>} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

