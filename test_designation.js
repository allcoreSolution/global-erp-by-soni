const mongoose = require('mongoose');
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const { Employee } = require('./src/models/Employee');
const Department = require('./src/models/Department');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testDesignationAPI() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for testing');

  // Create mock role, user, employee
  let role = await Role.findOne({ name: 'SuperAdmin' });
  if (!role) role = await Role.create({ name: 'SuperAdmin', permissions: ['manage_hrms'] });

  let user = await User.findOne({ username: 'testadmin' });
  if (!user) user = await User.create({ username: 'testadmin', email: 'test@admin.com', password: 'password', role: role._id, isActive: true });

  let employee = await Employee.findOne({ empId: 'TEST-001' });
  if (!employee) employee = await Employee.create({ empId: 'TEST-001', fullName: 'Test Employee', gender: 'Male', phone: '1234567890', emergencyRelation: 'Brother', emergencyPhone: '0987654321' });

  let department = await Department.findOne({ deptCode: 'ITS' });
  if (!department) department = await Department.create({ deptCode: 'ITS', departmentName: 'IT', deptHead: employee._id });

  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const baseUrl = 'http://localhost:5000/api';
  
  // Test Designation
  console.log('\n--- Testing Designation ---');
  const dName = 'Desig-' + Date.now();
  let res = await fetch(`${baseUrl}/designations`, {
    method: 'POST', headers,
    body: JSON.stringify({ roleCode: 'SDEV' + Date.now().toString().slice(-4), designationName: dName, department: department._id, reportingManager: employee._id })
  });
  let data = await res.json();
  console.log('POST:', res.status, data.success ? 'Success' : data);
  const desigId = data.data?._id;

  res = await fetch(`${baseUrl}/designations`, { method: 'GET', headers });
  console.log('GET ALL:', res.status, (await res.json()).success ? 'Success' : 'Failed');

  if (desigId) {
    res = await fetch(`${baseUrl}/designations/${desigId}`, { method: 'GET', headers });
    console.log('GET BY ID:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/designations/${desigId}`, { method: 'PUT', headers, body: JSON.stringify({ jobDescription: 'Test Update' }) });
    console.log('PUT:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/designations/${desigId}`, { method: 'DELETE', headers });
    console.log('DELETE:', res.status, (await res.json()).success ? 'Success' : 'Failed');
  }

  mongoose.disconnect();
}
testDesignationAPI().catch(console.error);
