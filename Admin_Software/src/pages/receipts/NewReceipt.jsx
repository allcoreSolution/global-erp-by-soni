import React, { useState } from 'react';
import { FileText, User, CreditCard, Check, Printer } from 'lucide-react';

const NewReceipt = () => {
  const [form, setForm] = useState({
    rctNo: 'RCT-' + Date.now().toString().slice(-6),
    customer: 'Ramesh Kumar & Sons',
    date: new Date().toISOString().slice(0, 10),
    invoiceNo: 'INV-2024-001',
    amount: 0,
    mode: 'UPI',
    account: 'SBI Business A/C',
    refNo: '',
    remarks: '',
    advance: false,
    adjustment: 'Adjust Automatically'
  });

  const [ledgerMessage, setLedgerMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.amount <= 0) {
      alert("Please enter a valid receipt amount.");
      return;
    }
    // Simulate Customer Ledger Update
    const balMsg = `Success: Updated Customer Ledger! Credited ₹ ${form.amount.toLocaleString()} against customer "${form.customer}". New Ledger Balance updated.`;
    setLedgerMessage(balMsg);
    alert("Receipt saved successfully and customer ledger updated!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">New Receipt Voucher</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Record customer clearance payments, post accounts ledgers, and settle invoices bills.</p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors no-print"
        >
          <Printer size={14} /> Print Receipt
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
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Receipt Number *</label>
            <input
              type="text"
              required
              value={form.rctNo}
              onChange={(e) => setForm({ ...form, rctNo: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Date *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Select Customer *</label>
            <select
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="Ramesh Kumar & Sons">Ramesh Kumar & Sons (Due: ₹ 25,000)</option>
              <option value="Apex Retailers">Apex Retailers (Due: ₹ 12,000)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t pt-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Receipt Amount (₹) *</label>
            <input
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Against Invoice Reference</label>
            <select
              value={form.invoiceNo}
              onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="INV-2024-001">INV-2024-001 (Amount: ₹ 15,000)</option>
              <option value="INV-2024-003">INV-2024-003 (Amount: ₹ 8,000)</option>
              <option value="No Invoice">No Invoice (Advance Payment)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Payment Mode</label>
            <select
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="UPI">UPI / GPay</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t pt-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Clearance Bank / Cash Account</label>
            <input
              type="text"
              value={form.account}
              onChange={(e) => setForm({ ...form, account: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Reference Number / UTR / Cheque No</label>
            <input
              type="text"
              placeholder="e.g. UTR12345"
              value={form.refNo}
              onChange={(e) => setForm({ ...form, refNo: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Invoice Settle Adjustment</label>
            <select
              value={form.adjustment}
              onChange={(e) => setForm({ ...form, adjustment: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="Adjust Automatically">Adjust Automatically (FIFO)</option>
              <option value="Adjust Manually">Adjust Manually (Specific Bill)</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-4 flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.advance}
              onChange={(e) => setForm({ ...form, advance: e.target.checked })}
              className="rounded text-indigo-600 h-4 w-4"
            />
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase">Mark as Advance Receipt</span>
          </label>

          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Remarks / Internal notes</label>
            <textarea
              rows="2"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-3 border-t no-print">
          <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-colors text-xs">
            Save Receipt & Update Ledger
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewReceipt;
