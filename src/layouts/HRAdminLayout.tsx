import { Outlet } from 'react-router-dom';
import HRAdminSidebar from '../components/sidebars/HRAdminSidebar';
import Header from '../components/Header';
import './DashboardLayout.css';

export default function HRAdminLayout() {
    return (
        <div className="dashboard-layout">
            <HRAdminSidebar />
            <div className="main-content">
                <Header />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
