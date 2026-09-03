const express = require('express');
const router = express.Router();
const {
  addLedgerAccount, 
  getLedgerAccounts,
  updateLedgerAccount,
  deleteLedgerAccount,
  addVoucher, 
  getVouchers
} = require('../controllers/accountController');
const { protect, checkPermission } = require('../middlewares/authMiddleware');

// Ledger Accounts Master
router.get('/ledgers', protect, getLedgerAccounts);
router.post('/ledgers', protect, checkPermission('manage_accounts'), addLedgerAccount);
router.put('/ledgers/:id', protect, checkPermission('manage_accounts'), updateLedgerAccount);
router.delete('/ledgers/:id', protect, checkPermission('manage_accounts'), deleteLedgerAccount);

// Journal Vouchers
router.get('/vouchers', protect, getVouchers);
router.post('/vouchers', protect, checkPermission('manage_accounts'), addVoucher);

module.exports = router;
