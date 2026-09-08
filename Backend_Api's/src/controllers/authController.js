const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecure_global_erp_secret_key_12345', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/SuperAdmin
const registerUser = async (req, res, next) => {
  const { username, email, password, roleName } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this email or username'));
    }

    // Find the role
    const role = await Role.findOne({ name: roleName || 'SalesStaff' });
    if (!role) {
      res.status(400);
      return next(new Error('Specified role does not exist'));
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role._id
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: role.name,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('role');

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role.name,
    permissions: req.user.role.permissions
  });
};

// @desc    Get roles (Admin Setup)
// @route   GET /api/auth/roles
// @access  Private
const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Update role config
// @route   POST /api/auth/roles
// @access  Private/SuperAdmin
const createOrUpdateRole = async (req, res, next) => {
  const { name, description, permissions } = req.body;

  try {
    let role = await Role.findOne({ name });
    if (role) {
      role.description = description || role.description;
      role.permissions = permissions || role.permissions;
      await role.save();
      res.json({ message: 'Role updated successfully', role });
    } else {
      role = await Role.create({ name, description, permissions });
      res.status(201).json({ message: 'Role created successfully', role });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getRoles,
  createOrUpdateRole
};
