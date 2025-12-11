const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Department = require('../models/Department');
const Settings = require('../models/Settings');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Demo users
const users = [
    {
        name: 'Super Admin',
        email: 'superadmin@hr3.com',
        password: 'SuperAdmin123!',
        role: 'superadmin',
        department: 'Administration'
    },
    {
        name: 'HR Admin',
        email: 'hradmin@hr3.com',
        password: 'HRAdmin123!',
        role: 'hradmin',
        department: 'Human Resources'
    },
    {
        name: 'Dean Johnson',
        email: 'dean@hr3.com',
        password: 'Dean123!',
        role: 'dean',
        department: 'Computer Science'
    },
    {
        name: 'Jane Smith',
        email: 'jane@hr3.com',
        password: 'Lecturer123!',
        role: 'lecturer',
        department: 'Computer Science'
    },
    {
        name: 'Mary Johnson',
        email: 'mary@hr3.com',
        password: 'AdminStaff123!',
        role: 'adminstaff',
        department: 'Registrar'
    }
];

// Demo departments
const departments = [
    {
        name: 'Computer Science',
        code: 'CS',
        description: 'Department of Computer Science and Information Technology',
        status: 'active'
    },
    {
        name: 'Human Resources',
        code: 'HR',
        description: 'Human Resources Department',
        status: 'active'
    },
    {
        name: 'Administration',
        code: 'ADMIN',
        description: 'Administrative and Management Department',
        status: 'active'
    },
    {
        name: 'Registrar',
        code: 'REG',
        description: 'Student Records and Registration Office',
        status: 'active'
    }
];

// Default settings
const defaultSettings = [
    { key: 'company_name', value: 'HR3 Management System', category: 'general', description: 'Organization name' },
    { key: 'work_hours_start', value: '08:00', category: 'attendance', description: 'Work start time' },
    { key: 'work_hours_end', value: '17:00', category: 'attendance', description: 'Work end time' },
    { key: 'late_threshold_minutes', value: 15, category: 'attendance', description: 'Minutes after start time to be marked late' },
    { key: 'overtime_rate', value: 1.25, category: 'payroll', description: 'Overtime pay multiplier' },
    { key: 'sss_rate', value: 0.045, category: 'payroll', description: 'SSS contribution rate' },
    { key: 'philhealth_rate', value: 0.02, category: 'payroll', description: 'PhilHealth contribution rate' },
    { key: 'pagibig_contribution', value: 100, category: 'payroll', description: 'Fixed Pag-IBIG contribution' },
    { key: 'tax_rate', value: 0.1, category: 'payroll', description: 'Withholding tax rate' },
    { key: 'vacation_leave_days', value: 15, category: 'leave', description: 'Annual vacation leave allowance' },
    { key: 'sick_leave_days', value: 15, category: 'leave', description: 'Annual sick leave allowance' }
];

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});
        await Settings.deleteMany({});
        console.log('Existing data cleared');

        // Seed departments
        const createdDepts = await Department.create(departments);
        console.log('Departments seeded:');
        createdDepts.forEach(d => console.log(`  - ${d.name} (${d.code})`));

        // Seed users
        const createdUsers = await User.create(users);
        console.log('Users seeded:');
        createdUsers.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.role}`));

        // Set department heads
        const deanUser = createdUsers.find(u => u.role === 'dean');
        const csDept = createdDepts.find(d => d.code === 'CS');
        if (deanUser && csDept) {
            csDept.headId = deanUser._id;
            await csDept.save();
            console.log(`Set ${deanUser.name} as head of ${csDept.name}`);
        }

        // Seed settings
        await Settings.create(defaultSettings);
        console.log('Default settings seeded');

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error.message);
        process.exit(1);
    }
};

seedData();
