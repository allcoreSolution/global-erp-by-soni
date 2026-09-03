const mongoose = require('mongoose');
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const { Employee } = require('./src/models/Employee');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testDepartmentAPI() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for testing');

  // Create mock role, user, employee
  let role = await Role.findOne({ name: 'SuperAdmin' });
  if (!role) role = await Role.create({ name: 'SuperAdmin', permissions: ['manage_hrms'] });

  let user = await User.findOne({ username: 'testadmin' });
  if (!user) user = await User.create({ username: 'testadmin', email: 'test@admin.com', password: 'password', role: role._id, isActive: true });

  let employee = await Employee.findOne({ empId: 'TEST-001' });
  if (!employee) employee = await Employee.create({ empId: 'TEST-001', fullName: 'Test Employee', gender: 'Male', phone: '1234567890', emergencyRelation: 'Brother', emergencyPhone: '0987654321' });

  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const baseUrl = 'http://localhost:5000/api';
  
  // Test Department
  console.log('\n--- Testing Department ---');
  const dName = 'Dept-' + Date.now();
  let res = await fetch(`${baseUrl}/departments`, {
    method: 'POST', headers,
    body: JSON.stringify({ deptCode: 'ITS' + Date.now().toString().slice(-4), departmentName: dName, deptHead: employee._id })
  });
  let data = await res.json();
  console.log('POST:', res.status, data.success ? 'Success' : data);
  const deptId = data.data?._id;

  res = await fetch(`${baseUrl}/departments`, { method: 'GET', headers });
  console.log('GET ALL:', res.status, (await res.json()).success ? 'Success' : 'Failed');

  if (deptId) {
    res = await fetch(`${baseUrl}/departments/${deptId}`, { method: 'GET', headers });
    console.log('GET BY ID:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/departments/${deptId}`, { method: 'PUT', headers, body: JSON.stringify({ budgetAllocation: 10000 }) });
    console.log('PUT:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/departments/${deptId}`, { method: 'DELETE', headers });
    console.log('DELETE:', res.status, (await res.json()).success ? 'Success' : 'Failed');
  }

  mongoose.disconnect();
}
testDepartmentAPI().catch(console.error);
