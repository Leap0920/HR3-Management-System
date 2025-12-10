const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Demo users to seed
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

const seedUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany({});
        console.log('Existing users cleared');

        // Insert new users
        const createdUsers = await User.create(users);
        console.log('Demo users seeded successfully:');
        createdUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error.message);
        process.exit(1);
    }
};

seedUsers();
