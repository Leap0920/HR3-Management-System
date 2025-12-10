import { Outlet } from 'react-router-dom';
import AdminStaffSidebar from '../components/sidebars/AdminStaffSidebar';
import Header from '../components/Header';
import './DashboardLayout.css';

export default function AdminStaffLayout() {
    return (
        <div className="dashboard-layout">
            <AdminStaffSidebar />
            <div className="main-content">
                <Header />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
