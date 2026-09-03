const mongoose = require('mongoose');
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const { Employee } = require('./src/models/Employee');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testAPIs() {
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
  
  // Test Expense Claim
  console.log('\n--- Testing Expense Claim ---');
  let res = await fetch(`${baseUrl}/expenses`, {
    method: 'POST', headers,
    body: JSON.stringify({ claimDate: '2026-09-03', category: 'Food', amount: 500, employee: user._id })
  });
  let data = await res.json();
  console.log('POST:', res.status, data.success ? 'Success' : data);
  const expenseId = data.data?._id;

  res = await fetch(`${baseUrl}/expenses`, { method: 'GET', headers });
  console.log('GET ALL:', res.status, (await res.json()).success ? 'Success' : 'Failed');

  if (expenseId) {
    res = await fetch(`${baseUrl}/expenses/${expenseId}`, { method: 'GET', headers });
    console.log('GET BY ID:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/expenses/${expenseId}`, { method: 'PUT', headers, body: JSON.stringify({ amount: 600 }) });
    console.log('PUT:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/expenses/${expenseId}`, { method: 'DELETE', headers });
    console.log('DELETE:', res.status, (await res.json()).success ? 'Success' : 'Failed');
  }

  // Test Performance Rating
  console.log('\n--- Testing Performance Rating ---');
  res = await fetch(`${baseUrl}/performance`, {
    method: 'POST', headers,
    body: JSON.stringify({ employee: employee._id, jobRole: 'Dev', ratingScore: 4 })
  });
  data = await res.json();
  console.log('POST:', res.status, data.success ? 'Success' : data);
  const perfId = data.data?._id;

  res = await fetch(`${baseUrl}/performance`, { method: 'GET', headers });
  console.log('GET ALL:', res.status, (await res.json()).success ? 'Success' : 'Failed');

  if (perfId) {
    res = await fetch(`${baseUrl}/performance/${perfId}`, { method: 'GET', headers });
    console.log('GET BY ID:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/performance/${perfId}`, { method: 'PUT', headers, body: JSON.stringify({ ratingScore: 5 }) });
    console.log('PUT:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/performance/${perfId}`, { method: 'DELETE', headers });
    console.log('DELETE:', res.status, (await res.json()).success ? 'Success' : 'Failed');
  }

  // Test Employee Target
  console.log('\n--- Testing Employee Target ---');
  res = await fetch(`${baseUrl}/targets`, {
    method: 'POST', headers,
    body: JSON.stringify({ employee: employee._id, kpiGoalTitle: 'Sales', targetMetricDescription: '100k', targetDeadline: '2026-12-31' })
  });
  data = await res.json();
  console.log('POST:', res.status, data.success ? 'Success' : data);
  const targetId = data.data?._id;

  res = await fetch(`${baseUrl}/targets`, { method: 'GET', headers });
  console.log('GET ALL:', res.status, (await res.json()).success ? 'Success' : 'Failed');

  if (targetId) {
    res = await fetch(`${baseUrl}/targets/${targetId}`, { method: 'GET', headers });
    console.log('GET BY ID:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/targets/${targetId}`, { method: 'PUT', headers, body: JSON.stringify({ initialProgress: 10 }) });
    console.log('PUT:', res.status, (await res.json()).success ? 'Success' : 'Failed');

    res = await fetch(`${baseUrl}/targets/${targetId}`, { method: 'DELETE', headers });
    console.log('DELETE:', res.status, (await res.json()).success ? 'Success' : 'Failed');
  }

  mongoose.disconnect();
}
testAPIs().catch(console.error);
