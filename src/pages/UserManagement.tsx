import { useState } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import './UserManagement.css';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'Active' | 'Inactive';
}

const USERS_DATA: User[] = [
    { id: 1, name: 'Super Admin', email: 'superadmin@hr3.com', role: 'Super Admin', department: 'Administration', status: 'Active' },
    { id: 2, name: 'HR Admin', email: 'hradmin@hr3.com', role: 'HR Admin', department: 'Human Resources', status: 'Active' },
    { id: 3, name: 'Dean Johnson', email: 'dean@hr3.com', role: 'Dean', department: 'Computer Science', status: 'Active' },
    { id: 4, name: 'Jane Smith', email: 'jane@hr3.com', role: 'Lecturer', department: 'Computer Science', status: 'Active' },
    { id: 5, name: 'Robert Chen', email: 'robert@hr3.com', role: 'Lecturer', department: 'Engineering', status: 'Active' },
    { id: 6, name: 'Mary Johnson', email: 'mary@hr3.com', role: 'Admin Staff', department: 'Administration', status: 'Active' },
];

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users] = useState<User[]>(USERS_DATA);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Manage system users and permissions</p>
                </div>
                <button className="primary-btn">
                    <Plus size={18} />
                    <span>Add User</span>
                </button>
            </div>

            <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search users by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="name-cell">{user.name}</td>
                                <td className="email-cell">{user.email}</td>
                                <td className="role-cell">{user.role}</td>
                                <td>{user.department}</td>
                                <td>
                                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button className="action-icon edit">
                                        <Pencil size={16} />
                                    </button>
                                    <button className="action-icon delete">
                                        <Trash2 size={16} />
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
