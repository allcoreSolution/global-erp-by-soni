const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecure_global_erp_secret_key_12345');

      // Get user from token and populate role
      req.user = await User.findById(decoded.id).select('-password').populate('role');
      
      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      if (!req.user.isActive) {
        res.status(403);
        return next(new Error('User account is deactivated'));
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

// Permission checker middleware
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        res.status(403);
        return next(new Error('Access denied: Role info missing'));
      }

      const role = req.user.role;

      // SuperAdmin gets all bypass access
      if (role.name === 'SuperAdmin') {
        return next();
      }

      // Check if permission exists in permissions array
      if (role.permissions.includes(permission)) {
        return next();
      }

      res.status(403);
      return next(new Error(`Access denied: Missing permission '${permission}'`));
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { protect, checkPermission };
