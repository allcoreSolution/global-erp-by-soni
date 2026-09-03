const mongoose = require('mongoose');

// General Ledger Account schema (Bank, Cash, Sales, Purchase accounts, etc.)
const ledgerAccountSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  group: { type: String, required: true }, // Assets, Liabilities, Income, Expenses
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, { timestamps: true });

// Account Transaction details
const transactionItemSchema = new mongoose.Schema({
  ledger: { type: mongoose.Schema.Types.ObjectId, ref: 'LedgerAccount', required: true },
  type: { type: String, enum: ['Debit', 'Credit'], required: true },
  amount: { type: Number, required: true, min: 0.01 }
});

// Journal Entry Voucher
const voucherSchema = new mongoose.Schema({
  voucherNo: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Journal', 'Receipt', 'Payment', 'Contra', 'Debit Note', 'Credit Note'], required: true },
  date: { type: Date, default: Date.now },
  narrations: { type: String, default: '' },
  items: [transactionItemSchema],
  totalAmount: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, { timestamps: true });

const LedgerAccount = mongoose.model('LedgerAccount', ledgerAccountSchema);
const Voucher = mongoose.model('Voucher', voucherSchema);



module.exports = { LedgerAccount, Voucher };
