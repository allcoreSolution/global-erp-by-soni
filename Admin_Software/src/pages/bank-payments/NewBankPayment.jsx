import React, { useState } from 'react';
import { FileText, User, CreditCard, Check, Printer } from 'lucide-react';

const NewBankPayment = () => {
  const [form, setForm] = useState({
    pmtNo: 'BPMT-' + Date.now().toString().slice(-6),
    bankAccount: 'ICICI Current A/C',
    supplier: 'Rathi Steel Traders Ltd',
    date: new Date().toISOString().slice(0, 10),
    invoiceNo: 'PINV-2024-001',
    amount: 0,
    refNo: '',
    bankCharges: 0,
    narration: '',
    reconciled: false
  });

  const [ledgerMessage, setLedgerMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.amount <= 0) {
      alert("Please enter a valid bank payment amount.");
      return;
    }
    // Simulate Bank Ledger Update
    const balMsg = `Success: Updated Bank Ledger! Debited ₹ ${form.amount.toLocaleString()} from account "${form.bankAccount}" to supplier "${form.supplier}" (Reference: ${form.refNo || 'N/A'}). Ledger reconciled.`;
    setLedgerMessage(balMsg);
    alert("Bank payment voucher saved successfully and bank ledger updated!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">New Bank Payment Voucher</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Record bank payouts, process check settlement transfers, bank charges, and reconciliation clearings.</p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors no-print"
        >
          <Printer size={14} /> Print Voucher
        </button>
      </div>

      {ledgerMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded text-xs flex items-center gap-2">
          <Check size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{ledgerMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Clearance ID *</label>
            <input
              type="text"
              required
              value={form.pmtNo}
              onChange={(e) => setForm({ ...form, pmtNo: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Payout Date *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Source Bank Account *</label>
            <select
              value={form.bankAccount}
              onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="ICICI Current A/C">ICICI Current A/C (...1199)</option>
              <option value="HDFC Business A/C">HDFC Business A/C (...0456)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t pt-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Supplier / Party Selection *</label>
            <select
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="Rathi Steel Traders Ltd">Rathi Steel Traders Ltd</option>
              <option value="Saraswati Plastics">Saraswati Plastics</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Amount Debited (₹) *</label>
            <input
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Against Invoice / Advance</label>
            <select
              value={form.invoiceNo}
              onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="PINV-2024-001">PINV-2024-001 (Amount: ₹ 45,000)</option>
              <option value="PINV-2024-002">PINV-2024-002 (Amount: ₹ 15,000)</option>
              <option value="Advance">Mark as Advance Payout</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t pt-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Reference / Cheque No.</label>
            <input
              type="text"
              placeholder="Cheque No or UTR reference"
              value={form.refNo}
              onChange={(e) => setForm({ ...form, refNo: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Bank Charges (₹)</label>
            <input
              type="number"
              value={form.bankCharges}
              onChange={(e) => setForm({ ...form, bankCharges: Number(e.target.value) })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Reconciliation Status</label>
            <select
              value={form.reconciled ? 'Reconciled' : 'Unreconciled'}
              onChange={(e) => setForm({ ...form, reconciled: e.target.value === 'Reconciled' })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs font-bold"
            >
              <option value="Unreconciled">Unreconciled / Pending Clearing</option>
              <option value="Reconciled">Reconciled / Cleared</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Narration / Remarks</label>
            <textarea
              rows="2"
              value={form.narration}
              onChange={(e) => setForm({ ...form, narration: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-3 border-t no-print">
          <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-colors text-xs">
            Save Bank Payment & Update Ledger
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBankPayment;
