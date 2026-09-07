const express = require('express');
const router = express.Router();
const { protect, checkPermission } = require('../middlewares/authMiddleware');
const { registerCompany, getCompanies, toggleCompanyStatus } = require('../controllers/companyController');

// All company routes are strictly for SuperAdmin
// Since checkPermission('manage_companies') will pass for SuperAdmin automatically
router.use(protect);

// Allow only SuperAdmin (checking a specific permission they have, or simply writing a middleware)
const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.name === 'SuperAdmin') {
    return next();
  }
  res.status(403);
  next(new Error('Not authorized. Super Admin only.'));
};

router.use(superAdminOnly);

router.post('/register', registerCompany);
router.get('/', getCompanies);
router.put('/:id/toggle-status', toggleCompanyStatus);

module.exports = router;
