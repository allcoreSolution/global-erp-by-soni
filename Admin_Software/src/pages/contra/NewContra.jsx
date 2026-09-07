import React, { useState } from 'react';
import { Check, Printer, Paperclip } from 'lucide-react';

const NewContra = () => {
  const [form, setForm] = useState({
    contraNo: 'CNTR-' + Date.now().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10),
    fromAccount: 'Cash Account',
    toAccount: 'ICICI Current A/C',
    amount: 0,
    mode: 'Cash Deposit',
    refNo: '',
    narration: '',
    fileName: ''
  });

  const [ledgerMessage, setLedgerMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.amount <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }
    if (form.fromAccount === form.toAccount) {
      alert("Source and Destination accounts cannot be the same.");
      return;
    }
    // Simulate Double Ledger updates
    const balMsg = `Success: Posted Contra Entry! Debited ₹ ${form.amount.toLocaleString()} in "${form.toAccount}" and Credited ₹ ${form.amount.toLocaleString()} from "${form.fromAccount}". Ledgers updated.`;
    setLedgerMessage(balMsg);
    alert("Contra entry saved successfully and dual ledgers adjusted!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">New Contra Entry</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Record cash deposits, withdrawals, or direct bank to bank fund transfers inside ledger books.</p>
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
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Voucher Number *</label>
            <input
              type="text"
              required
              value={form.contraNo}
              onChange={(e) => setForm({ ...form, contraNo: e.target.value })}
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
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Transfer Mode</label>
            <select
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="Cash Deposit">Cash Deposit (Cash to Bank)</option>
              <option value="Cash Withdrawal">Cash Withdrawal (Bank to Cash)</option>
              <option value="Bank Transfer">Bank to Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border-t pt-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">From Account (Source Ledger) *</label>
            <select
              value={form.fromAccount}
              onChange={(e) => setForm({ ...form, fromAccount: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="Cash Account">Cash Account</option>
              <option value="ICICI Current A/C">ICICI Current A/C (...1199)</option>
              <option value="HDFC Business A/C">HDFC Business A/C (...0456)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">To Account (Destination Ledger) *</label>
            <select
              value={form.toAccount}
              onChange={(e) => setForm({ ...form, toAccount: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
            >
              <option value="ICICI Current A/C">ICICI Current A/C (...1199)</option>
              <option value="HDFC Business A/C">HDFC Business A/C (...0456)</option>
              <option value="Cash Account">Cash Account</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Amount to Transfer (₹) *</label>
            <input
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full border p-2 rounded focus:outline-none text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Cheque / Reference No.</label>
            <input
              type="text"
              placeholder="e.g. CHQ010203 / UTR99881"
              value={form.refNo}
              onChange={(e) => setForm({ ...form, refNo: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Attachment (Slip copy)</label>
            <div className="flex items-center gap-2 border rounded p-1 text-xs">
              <Paperclip size={13} className="text-gray-400 ml-1" />
              <input
                type="file"
                onChange={(e) => setForm({ ...form, fileName: e.target.files[0]?.name || '' })}
                className="hidden"
                id="contra-attachment-slip"
              />
              <button
                type="button"
                onClick={() => document.getElementById('contra-attachment-slip').click()}
                className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
              >
                Choose File
              </button>
              <span className="text-gray-500 truncate max-w-[150px]">{form.fileName || 'No file chosen'}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Narration / Detailed notes</label>
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
            Save Contra & Update Ledgers
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewContra;
