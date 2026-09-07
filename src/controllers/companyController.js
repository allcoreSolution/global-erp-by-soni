const Company = require('../models/Company');
const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Register a new company and create its Admin user
// @route   POST /api/companies/register
// @access  Private/SuperAdmin
const registerCompany = async (req, res, next) => {
  const { companyName, companyEmail, companyPhone, companyAddress, adminEmail, adminPassword } = req.body;

  try {
    // Check if company email already exists
    const companyExists = await Company.findOne({ email: companyEmail });
    if (companyExists) {
      res.status(400);
      return next(new Error('Company with this email already exists'));
    }

    // Check if admin email already exists
    const userExists = await User.findOne({ email: adminEmail });
    if (userExists) {
      res.status(400);
      return next(new Error('Admin email already exists in the system'));
    }

    // Create the Company
    const company = await Company.create({
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      address: companyAddress
    });

    // Ensure Admin Role exists
    let adminRole = await Role.findOne({ name: 'Admin' });
    if (!adminRole) {
      adminRole = await Role.create({
        name: 'Admin',
        description: 'Company Admin',
        permissions: ['manage_all_company_data']
      });
    }

    // Create the Admin User for this company
    const adminUser = await User.create({
      username: adminEmail.split('@')[0], // Generate username from email
      email: adminEmail,
      password: adminPassword,
      role: adminRole._id,
      company: company._id
    });

    res.status(201).json({
      message: 'Company and Admin created successfully',
      company,
      adminUser: {
        _id: adminUser._id,
        email: adminUser.email,
        role: 'Admin'
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/SuperAdmin
const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({}).sort({ createdAt: -1 });
    
    // Attach admin info to each company
    const companiesWithAdmin = await Promise.all(companies.map(async (company) => {
      const admin = await User.findOne({ company: company._id, role: await Role.findOne({name: 'Admin'}) }).select('username email');
      return {
        ...company._doc,
        adminUser: admin
      };
    }));

    res.json(companiesWithAdmin);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle company status (Block/Unblock)
// @route   PUT /api/companies/:id/toggle-status
// @access  Private/SuperAdmin
const toggleCompanyStatus = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404);
      return next(new Error('Company not found'));
    }

    company.isActive = !company.isActive;
    await company.save();

    // Also toggle the active status of all users belonging to this company
    await User.updateMany(
      { company: company._id },
      { $set: { isActive: company.isActive } }
    );

    res.json({ message: `Company has been ${company.isActive ? 'activated' : 'blocked'}`, company });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCompany,
  getCompanies,
  toggleCompanyStatus
};
