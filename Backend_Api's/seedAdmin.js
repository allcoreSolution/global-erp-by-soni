const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env
dotenv.config();

// Models load karo
const User = require('./src/models/User');
const Role = require('./src/models/Role');

const seedAdmin = async () => {
  try {
    // Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database Connected Successfully!');

    // 1. Create SuperAdmin Role
    let superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'SuperAdmin',
        description: 'Has all permissions',
        permissions: ['manage_users', 'manage_roles', 'manage_accounts', 'manage_sales', 'manage_products', 'manage_purchases']
      });
      console.log('SuperAdmin Role created!');
    } else {
      console.log('SuperAdmin Role already exists.');
    }

    // 2. Create Admin User
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: superAdminRole._id
      });
      console.log('Admin User Created Successfully!');
      console.log('Email: admin@example.com | Password: password123');
    } else {
      console.log('Admin User already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
