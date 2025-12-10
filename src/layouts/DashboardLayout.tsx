import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './DashboardLayout.css';

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
