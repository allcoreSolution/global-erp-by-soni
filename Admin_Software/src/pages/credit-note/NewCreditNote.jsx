import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Printer, Paperclip, ArrowLeft, Plus, Trash } from 'lucide-react';

const NewCreditNote = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    creditNoteNo: 'CN-' + Date.now().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10),
    customerId: 'CUST-001',
    originalInvoice: 'INV-2026-1122',
    reason: 'Sales Return (Incorrect Spec)',
    adjustAgainstInvoice: true,
    status: 'Pending',
    fileName: '',
    narration: '',
  });

  const [productsList, setProductsList] = useState([
    { id: 1, name: 'Premium Copper Wire 2.5mm', qty: 5, rate: 850, taxRate: 18, amount: 4250, taxAmount: 765, total: 5015 },
    { id: 2, name: 'PVC Modular Switch Box', qty: 20, rate: 120, taxRate: 12, amount: 2400, taxAmount: 288, total: 2688 }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    qty: 1,
    rate: 0,
    taxRate: 18
  });

  const [totals, setTotals] = useState({
    taxableAmount: 0,
    taxAmount: 0,
    totalAmount: 0
  });

  const [ledgerMessage, setLedgerMessage] = useState('');

  // Calculate totals whenever productsList changes
  useEffect(() => {
    let taxable = 0;
    let tax = 0;
    productsList.forEach(p => {
      taxable += p.amount;
      tax += p.taxAmount;
    });
    setTotals({
      taxableAmount: taxable,
      taxAmount: tax,
      totalAmount: taxable + tax
    });
  }, [productsList]);

  const handleAddProduct = () => {
    if (!newProduct.name) {
      alert("Please enter a product name.");
      return;
    }
    const amt = newProduct.qty * newProduct.rate;
    const taxAmt = (amt * newProduct.taxRate) / 100;
    const item = {
      id: Date.now(),
      name: newProduct.name,
      qty: Number(newProduct.qty),
      rate: Number(newProduct.rate),
      taxRate: Number(newProduct.taxRate),
      amount: amt,
      taxAmount: taxAmt,
      total: amt + taxAmt
    };
    setProductsList([...productsList, item]);
    setNewProduct({ name: '', qty: 1, rate: 0, taxRate: 18 });
  };

  const handleRemoveProduct = (id) => {
    setProductsList(productsList.filter(p => p.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productsList.length === 0) {
      alert("Please add at least one product or service detail.");
      return;
    }

    // Simulate Customer Ledger Impact
    const customerMap = {
      'CUST-001': 'Amit Sharma (Retail)',
      'CUST-002': 'Superstone Enterprises',
      'CUST-003': 'TechMech Solutions'
    };
    const custName = customerMap[form.customerId] || 'Selected Customer';
    
    let ledgerImpact = `Customer Ledger Update: Debited Sales Return / Discount Account & Credited "${custName}" receivable account for total ₹ ${totals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}. `;
    if (form.adjustAgainstInvoice) {
      ledgerImpact += `Amount adjusted directly against customer invoice Reference: "${form.originalInvoice}".`;
    } else {
      ledgerImpact += `Amount added as customer credit balance for future invoices.`;
    }

    setLedgerMessage(ledgerImpact);
    alert(`Credit Note ${form.creditNoteNo} saved successfully and customer ledger balances adjusted!`);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/credit-note/list')}
            className="p-1 hover:bg-slate-100 rounded text-gray-500 no-print"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">New Credit Note Voucher</h1>
            <p className="text-[11px] sm:text-xs text-gray-500">Record a customer sales return, tax write-off, or discount adjustment directly inside ledger journals.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors no-print"
        >
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      {ledgerMessage && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded text-xs flex flex-col gap-1">
          <div className="flex items-center gap-2 font-bold text-[12px]">
            <Check size={16} className="text-emerald-600" /> Credit Note Issued Successfully
          </div>
          <p className="text-gray-600 ml-6">{ledgerMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        {/* Header Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border">
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase mb-1">Credit Note No *</label>
            <input
              type="text"
              required
              value={form.creditNoteNo}
              onChange={(e) => setForm({ ...form, creditNoteNo: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs font-mono bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase mb-1">Date *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase mb-1">Customer Selection *</label>
            <select
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs bg-white"
            >
              <option value="CUST-001">Amit Sharma (Retail)</option>
              <option value="CUST-002">Superstone Enterprises</option>
              <option value="CUST-003">TechMech Solutions</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase mb-1">Original Invoice Ref *</label>
            <input
              type="text"
              required
              placeholder="e.g. INV-2026-1122"
              value={form.originalInvoice}
              onChange={(e) => setForm({ ...form, originalInvoice: e.target.value })}
              className="w-full border p-2 rounded focus:outline-none text-xs font-mono bg-white"
            />
          </div>
        </div>

        {/* Product / Service Item Rows */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-bold text-xs uppercase text-slate-700 border-b pb-2">Products / Services List</h3>

          <div className="overflow-x-auto text-[11px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-2">Item / Product / Service</th>
                  <th className="p-2 text-right">Quantity</th>
                  <th className="p-2 text-right">Rate (₹)</th>
                  <th className="p-2 text-right">Tax Rate (%)</th>
                  <th className="p-2 text-right">Taxable Amt</th>
                  <th className="p-2 text-right">GST Amount</th>
                  <th className="p-2 text-right">Total (₹)</th>
                  <th className="p-2 text-center no-print">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productsList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-2 font-medium text-gray-800">{p.name}</td>
                    <td className="p-2 text-right">{p.qty}</td>
                    <td className="p-2 text-right">₹ {p.rate.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right">{p.taxRate}%</td>
                    <td className="p-2 text-right">₹ {p.amount.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right text-red-650">₹ {p.taxAmount.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right font-bold text-emerald-700">₹ {p.total.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-center no-print">
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash size={12} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Inline add form */}
                <tr className="bg-slate-50/50 border-t no-print">
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="Add Product Name/Service"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="border p-1 w-full rounded text-xs bg-white"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={newProduct.qty}
                      onChange={(e) => setNewProduct({ ...newProduct, qty: Number(e.target.value) })}
                      className="border p-1 text-right w-16 rounded text-xs bg-white"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      placeholder="Rate"
                      value={newProduct.rate}
                      onChange={(e) => setNewProduct({ ...newProduct, rate: Number(e.target.value) })}
                      className="border p-1 text-right w-24 rounded text-xs bg-white"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={newProduct.taxRate}
                      onChange={(e) => setNewProduct({ ...newProduct, taxRate: Number(e.target.value) })}
                      className="border p-1 text-right w-20 rounded text-xs bg-white"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </td>
                  <td colSpan="3" className="p-2 text-right">
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-slate-800 rounded text-xs font-semibold flex items-center gap-1.5 ml-auto"
                    >
                      <Plus size={12} /> Add Item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Reason, Status and File attachment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase mb-1">Reason for Note *</label>
              <select
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none text-xs bg-white"
              >
                <option value="Sales Return (Incorrect Spec)">Sales Return (Incorrect Spec)</option>
                <option value="Rate Adjustment / Trade Discount">Rate Adjustment / Trade Discount</option>
                <option value="Goods Damaged in Transit">Goods Damaged in Transit</option>
                <option value="Tax Correction or GST Calculation fix">Tax Correction or GST Calculation fix</option>
                <option value="Others (Add to Narration)">Others (Add to Narration)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none text-xs bg-white"
              >
                <option value="Pending">Pending (Draft Approval)</option>
                <option value="Approved">Approved (Post directly)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-55 rounded border">
              <input
                type="checkbox"
                id="adjustInvoiceCheckbox"
                checked={form.adjustAgainstInvoice}
                onChange={(e) => setForm({ ...form, adjustAgainstInvoice: e.target.checked })}
                className="w-4 h-4 cursor-pointer text-indigo-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="adjustInvoiceCheckbox" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                Adjust amount directly against Original Customer Invoice (Ledger Update)
              </label>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-lg border flex flex-col justify-between">
            <h4 className="font-bold text-xs uppercase text-slate-700 border-b pb-1">Voucher Summary Table</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable Value (₹):</span>
                <span className="font-semibold text-gray-800">₹ {totals.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calculated GST Tax (₹):</span>
                <span className="font-semibold text-red-650">₹ {totals.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <hr className="my-1 border-gray-200" />
              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-800">Grand Total (₹):</span>
                <span className="font-bold text-emerald-700">₹ {totals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase mb-1">Attachment (Customer return note / proof)</label>
              <div className="flex items-center gap-2 border rounded p-1 text-xs bg-white">
                <Paperclip size={13} className="text-gray-400 ml-1" />
                <input
                  type="file"
                  onChange={(e) => setForm({ ...form, fileName: e.target.files[0]?.name || '' })}
                  className="hidden"
                  id="credit-attachment"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('credit-attachment').click()}
                  className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                >
                  Choose File
                </button>
                <span className="text-gray-500 truncate max-w-[150px]">{form.fileName || 'No file chosen'}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase mb-1">Detailed Narration Notes</label>
          <textarea
            rows="2"
            placeholder="Write detailed notes for reason of credit adjustment..."
            value={form.narration}
            onChange={(e) => setForm({ ...form, narration: e.target.value })}
            className="w-full border p-2 rounded focus:outline-none text-xs"
          />
        </div>

        <div className="flex gap-2 justify-end pt-3 border-t no-print">
          <button
            type="button"
            onClick={() => navigate('/credit-note/list')}
            className="px-4 py-2 border rounded hover:bg-slate-50 text-xs font-semibold"
          >
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-colors text-xs">
            Save Credit Note & Update Ledgers
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCreditNote;
