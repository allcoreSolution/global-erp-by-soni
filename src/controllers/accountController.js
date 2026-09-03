const { LedgerAccount, Voucher } = require('../models/Account');

// Create Ledger Account
const addLedgerAccount = async (req, res, next) => {
  try {
    const { name, group, openingBalance } = req.body;
    const account = await LedgerAccount.create({
      name, group, openingBalance, currentBalance: openingBalance || 0
    });
    res.status(201).json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

const getLedgerAccounts = async (req, res, next) => {
  try {
    const accounts = await LedgerAccount.find({ company: req.user?.companyId, company: req.user?.companyId });
    res.json({ success: true, data: accounts });
  } catch (error) {
    next(error);
  }
};

// Create Financial Voucher (Double Entry Verification)
const addVoucher = async (req, res, next) => {
  const { type, narrations, items } = req.body;

  try {
    if (!items || items.length < 2) {
      res.status(400);
      return next(new Error('At least two ledger transactions are required for double entry'));
    }

    let totalDebit = 0;
    let totalCredit = 0;

    for (const item of items) {
      const ledger = await LedgerAccount.findById(item.ledger);
      if (!ledger) {
        res.status(404);
        return next(new Error(`Ledger account not found: ${item.ledger}`));
      }

      if (item.type === 'Debit') {
        totalDebit += Number(item.amount);
      } else if (item.type === 'Credit') {
        totalCredit += Number(item.amount);
      }
    }

    // Double Entry verification
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      res.status(400);
      return next(new Error(`Unbalanced entry. Total Debits: ${totalDebit}, Total Credits: ${totalCredit}. They must balance.`));
    }

    // Generate Voucher Number
    const prefix = type.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const voucherNo = `${prefix}-${Date.now()}`;

    // Process Ledger Balance Updates
    for (const item of items) {
      const ledger = await LedgerAccount.findById(item.ledger);

      // Update balance based on entry type
      if (item.type === 'Debit') {
        ledger.currentBalance += Number(item.amount);
      } else {
        ledger.currentBalance -= Number(item.amount);
      }
      await ledger.save();
    }

    const voucher = await Voucher.create({
      voucherNo,
      type,
      narrations,
      items,
      totalAmount: totalDebit,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: voucher });
  } catch (error) {
    next(error);
  }
};

const getVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.find({ company: req.user?.companyId, company: req.user?.companyId }).populate('items.ledger').populate('createdBy', 'username email');
    res.json({ success: true, data: vouchers });
  } catch (error) {
    next(error);
  }
};

const updateLedgerAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, group, openingBalance } = req.body;
    
    const account = await LedgerAccount.findById(id);
    if (!account) {
      res.status(404);
      return next(new Error('Ledger account not found'));
    }

    // Update fields
    if (name) account.name = name;
    if (group) account.group = group;
    
    // If opening balance changes, we should technically recalculate current balance,
    // but for simplicity here we just update it if provided
    if (openingBalance !== undefined) {
      const difference = openingBalance - account.openingBalance;
      account.openingBalance = openingBalance;
      account.currentBalance += difference;
    }

    await account.save();
    res.json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

const deleteLedgerAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await LedgerAccount.findById(id);
    
    if (!account) {
      res.status(404);
      return next(new Error('Ledger account not found'));
    }

    await LedgerAccount.findByIdAndDelete(id);
    res.json({ success: true, message: 'Ledger account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addLedgerAccount,
  getLedgerAccounts,
  updateLedgerAccount,
  deleteLedgerAccount,
  addVoucher,
  getVouchers
};
