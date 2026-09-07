import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, CheckCircle2, AlertCircle, 
  Paperclip, ArrowRight, HelpCircle, Save, Info
} from 'lucide-react';

const LEDGER_ACCOUNTS = [
  'Cash A/c',
  'HDFC Bank A/c',
  'ICICI Bank A/c',
  'SBI Bank A/c',
  'Rent Expense A/c',
  'Security Deposit A/c',
  'Commission Paid A/c',
  'Salaries A/c',
  'Depreciation A/c',
  'Accumulated Depreciation A/c',
  'Office Equipments A/c',
  'Computers & Printers A/c',
  'Sundry Debtors - Ramesh Kumar & Sons',
  'Sundry Debtors - Apex Retailers',
  'Sundry Debtors - Global Distributors',
  'Sundry Creditors - Allied Suppliers',
  'Sundry Creditors - Bharat Tech Group',
  'CGST Input Tax A/c',
  'SGST Input Tax A/c',
  'IGST Input Tax A/c',
  'CGST Output Tax A/c',
  'SGST Output Tax A/c',
  'IGST Output Tax A/c'
];

const NewJournal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Form Fields
  const [journalNo, setJournalNo] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [narration, setNarration] = useState('');
  const [status, setStatus] = useState('Pending');
  const [attachment, setAttachment] = useState(null);

  // Journal Items (Grid Rows)
  const [rows, setRows] = useState([
    { type: 'Dr', account: '', debit: '', credit: '', narration: '' },
    { type: 'Cr', account: '', debit: '', credit: '', narration: '' }
  ]);

  // Load existing for Edit Mode
  useEffect(() => {
    const saved = localStorage.getItem('journal_entries');
    let currentJournals = saved ? JSON.parse(saved) : [];
    
    if (isEditMode) {
      const existing = currentJournals.find(j => j.id === id);
      if (existing) {
        setJournalNo(existing.id);
        setDate(existing.date);
        setReference(existing.reference);
        setNarration(existing.narration);
        setStatus(existing.status);
        // Map items back to rows
        setRows(existing.items.map(item => ({
          type: item.type,
          account: item.account,
          debit: item.type === 'Dr' ? String(item.amount) : '',
          credit: item.type === 'Cr' ? String(item.amount) : '',
          narration: item.narration || ''
        })));
        if (existing.attachmentName) {
          setAttachment({ name: existing.attachmentName });
        }
      } else {
        alert('Journal voucher not found!');
        navigate('/journal/list');
      }
    } else {
      // Auto Generate Voucher Number
      const nextNum = currentJournals.length + 1;
      setJournalNo(`JV-2024-${String(nextNum).padStart(3, '0')}`);
    }
  }, [id, isEditMode, navigate]);

  // Calculations
  const totalDebit = rows.reduce((sum, row) => sum + (row.type === 'Dr' ? Number(row.debit || 0) : 0), 0);
  const totalCredit = rows.reduce((sum, row) => sum + (row.type === 'Cr' ? Number(row.credit || 0) : 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  // Check if rows are valid
  const hasEmptyAccounts = rows.some(r => !r.account);
  const isValid = isBalanced && !hasEmptyAccounts;

  const handleAddRow = () => {
    // Add a row with alternating default type
    const lastRow = rows[rows.length - 1];
    const newType = lastRow && lastRow.type === 'Dr' ? 'Cr' : 'Dr';
    setRows([...rows, { type: newType, account: '', debit: '', credit: '', narration: '' }]);
  };

  const handleRemoveRow = (idx) => {
    if (rows.length <= 2) {
      alert('A journal entry must contain at least 2 rows (1 Debit and 1 Credit).');
      return;
    }
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleRowChange = (idx, field, value) => {
    const updated = [...rows];
    
    if (field === 'type') {
      updated[idx].type = value;
      // Reset amounts when type changes
      updated[idx].debit = '';
      updated[idx].credit = '';
    } else if (field === 'debit') {
      updated[idx].debit = value;
      updated[idx].credit = '';
    } else if (field === 'credit') {
      updated[idx].credit = value;
      updated[idx].debit = '';
    } else {
      updated[idx][field] = value;
    }
    
    setRows(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment({ name: file.name, size: file.size });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const saved = localStorage.getItem('journal_entries');
    let currentJournals = saved ? JSON.parse(saved) : [];

    const newJournal = {
      id: journalNo,
      date,
      reference,
      narration,
      status,
      items: rows.map(r => ({
        type: r.type,
        account: r.account,
        amount: r.type === 'Dr' ? Number(r.debit) : Number(r.credit),
        narration: r.narration
      })),
      totalAmount: totalDebit,
      attachmentName: attachment ? attachment.name : null
    };

    if (isEditMode) {
      currentJournals = currentJournals.map(j => j.id === journalNo ? newJournal : j);
    } else {
      currentJournals.push(newJournal);
    }

    localStorage.setItem('journal_entries', JSON.stringify(currentJournals));
    navigate('/journal/list');
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Go Back */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-50/50 shadow-inner border border-slate-200 p-4 rounded-lg border border-gray-100 dark:border-slate-200 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/journal/list')}
            className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-850 rounded-full transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-blue-900 dark:text-slate-700 tracking-wide uppercase">
              {isEditMode ? 'Edit Journal Entry' : 'New Journal Entry'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Create double-entry ledger adjustments and rectifications
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Form Body Fields (Left Column) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-slate-50/50 shadow-inner border border-slate-200 p-6 rounded-lg border border-gray-100 dark:border-slate-200 shadow-sm space-y-4 transition-colors">
            
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Voucher No</label>
                <input 
                  type="text" 
                  value={journalNo}
                  readOnly
                  className="w-full py-2 px-3 bg-gray-100 dark:bg-slate-850 border border-gray-200 dark:border-slate-200 rounded text-xs font-bold text-gray-700 dark:text-slate-200 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Voucher Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-200 rounded text-xs text-gray-700 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Reference No</label>
                <input 
                  type="text" 
                  placeholder="Enter manual ref/docs no"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-200 rounded text-xs text-gray-700 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Approval Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-200 rounded text-xs text-gray-700 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* General Narration */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">General Narration</label>
              <textarea 
                rows="2"
                placeholder="Write a brief explanation of why this entry is being created..."
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                required
                className="w-full py-2 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-200 rounded text-xs text-gray-700 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Entry Grid */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-800 dark:text-slate-700 uppercase tracking-wider">Debit / Credit Accounts Grid</span>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-indigo-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-900/40 text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  Add Row
                </button>
              </div>

              <div className="overflow-x-auto border dark:border-slate-200 rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-850 border-b border-gray-200 dark:border-slate-850 text-gray-700 dark:text-slate-350 font-bold uppercase">
                      <th className="py-2.5 px-3 w-24">Type</th>
                      <th className="py-2.5 px-3">Ledger Account</th>
                      <th className="py-2.5 px-3 w-32 text-right">Debit (₹)</th>
                      <th className="py-2.5 px-3 w-32 text-right">Credit (₹)</th>
                      <th className="py-2.5 px-3">Particular Narration</th>
                      <th className="py-2.5 px-3 w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-150 dark:border-slate-200 hover:bg-gray-50/50 dark:hover:bg-slate-850/30 transition-colors">
                        {/* Type Select */}
                        <td className="py-2 px-3">
                          <select
                            value={row.type}
                            onChange={(e) => handleRowChange(idx, 'type', e.target.value)}
                            className="w-full p-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-200 rounded text-xs font-bold text-gray-700 dark:text-slate-200"
                          >
                            <option value="Dr">Dr</option>
                            <option value="Cr">Cr</option>
                          </select>
                        </td>

                        {/* Ledger Select */}
                        <td className="py-2 px-3">
                          <select
                            value={row.account}
                            onChange={(e) => handleRowChange(idx, 'account', e.target.value)}
                            required
                            className="w-full p-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-200 rounded text-xs text-gray-700 dark:text-slate-250 font-medium"
                          >
                            <option value="">-- Choose Account --</option>
                            {LEDGER_ACCOUNTS.map((acc, aIdx) => (
                              <option key={aIdx} value={acc}>{acc}</option>
                            ))}
                          </select>
                        </td>

                        {/* Debit Input */}
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            value={row.debit}
                            onChange={(e) => handleRowChange(idx, 'debit', e.target.value)}
                            disabled={row.type === 'Cr'}
                            required={row.type === 'Dr'}
                            className="w-full p-1 text-right bg-white dark:bg-slate-800 disabled:bg-gray-100 dark:disabled:bg-slate-50/50 shadow-inner border border-slate-200 border border-gray-200 dark:border-slate-200 rounded text-xs font-mono text-gray-700 dark:text-slate-200"
                          />
                        </td>

                        {/* Credit Input */}
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            value={row.credit}
                            onChange={(e) => handleRowChange(idx, 'credit', e.target.value)}
                            disabled={row.type === 'Dr'}
                            required={row.type === 'Cr'}
                            className="w-full p-1 text-right bg-white dark:bg-slate-800 disabled:bg-gray-100 dark:disabled:bg-slate-50/50 shadow-inner border border-slate-200 border border-gray-200 dark:border-slate-200 rounded text-xs font-mono text-gray-700 dark:text-slate-200"
                          />
                        </td>

                        {/* Particular Narration */}
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="Narration for this specific line item..."
                            value={row.narration}
                            onChange={(e) => handleRowChange(idx, 'narration', e.target.value)}
                            className="w-full p-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-200 rounded text-xs text-gray-700 dark:text-slate-250"
                          />
                        </td>

                        {/* Delete Row */}
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(idx)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Bottom Calculation Row */}
                    <tr className="bg-slate-50 dark:bg-slate-850 font-bold border-t border-gray-300 dark:border-slate-200 text-gray-800 dark:text-slate-250">
                      <td colSpan="2" className="py-3 px-3 text-right uppercase tracking-wider">Total:</td>
                      <td className="py-3 px-3 text-right font-mono text-indigo-600 dark:text-blue-400">₹ {totalDebit.toLocaleString('en-IN')}.00</td>
                      <td className="py-3 px-3 text-right font-mono text-indigo-600 dark:text-blue-400">₹ {totalCredit.toLocaleString('en-IN')}.00</td>
                      <td colSpan="2" className="py-3 px-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attachment Dropzone */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Supporting Document Attachment</label>
              <div className="border-2 border-dashed border-gray-200 dark:border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-850/30 hover:bg-gray-100 dark:hover:bg-slate-850/50 transition-colors relative cursor-pointer">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Paperclip size={24} className="text-gray-400 mb-2" />
                <span className="text-xs font-semibold text-gray-600 dark:text-slate-350">
                  {attachment ? `Attached: ${attachment.name}` : 'Click here or drag files to attach'}
                </span>
                <span className="text-[9px] text-gray-400 mt-1">Accepts PDF, JPG, PNG up to 5MB</span>
              </div>
            </div>

          </div>
        </div>

        {/* Validation and Preview Pane (Right Column) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Validity Status */}
          <div className="bg-white dark:bg-slate-50/50 shadow-inner border border-slate-200 p-4 rounded-lg border border-gray-100 dark:border-slate-200 shadow-sm transition-colors">
            <h3 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase mb-3 tracking-wider">Voucher Validation</h3>
            
            <div className="space-y-3">
              {/* Debit == Credit Check */}
              <div className="flex items-start gap-2.5">
                {totalDebit === totalCredit && totalDebit > 0 ? (
                  <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="text-[11px] font-bold text-gray-700 dark:text-slate-350">Debit & Credit Balance</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    {totalDebit === totalCredit && totalDebit > 0 
                      ? 'Voucher debits match credits perfectly.' 
                      : `Debit & Credit differ by ₹ ${difference.toLocaleString('en-IN')}.00.`}
                  </div>
                </div>
              </div>

              {/* Accounts selected check */}
              <div className="flex items-start gap-2.5">
                {!hasEmptyAccounts ? (
                  <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="text-[11px] font-bold text-gray-700 dark:text-slate-350">Accounts Configuration</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    {!hasEmptyAccounts 
                      ? 'All row accounts are configured.' 
                      : 'Please choose accounts for all line items.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-200 dark:bg-slate-800 my-4"></div>

            {/* Difference Indicator */}
            {difference > 0 && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-2.5 rounded border border-red-200 dark:border-red-950/40 text-[11px] mb-4 font-semibold">
                Unbalanced Voucher: Debit and Credit columns must match. Difference of ₹ {difference.toLocaleString('en-IN')}.00 remaining.
              </div>
            )}

            {/* Save Buttons */}
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full flex items-center justify-center gap-2 text-slate-800 text-xs font-semibold py-2.5 rounded shadow transition-all cursor-pointer
                ${isValid 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
            >
              <Save size={14} />
              Save Voucher
            </button>
          </div>

          {/* Ledger Update Preview Box */}
          <div className="bg-white dark:bg-slate-50/50 shadow-inner border border-slate-200 p-4 rounded-lg border border-gray-100 dark:border-slate-200 shadow-sm transition-colors">
            <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
              <Info size={14} className="text-blue-500" />
              Ledger Update Preview
            </div>
            
            <p className="text-[9px] text-gray-400 dark:text-gray-500 mb-3">
              Preview of how the transaction will impact target accounts:
            </p>

            <div className="space-y-2">
              {rows.map((row, rIdx) => {
                if (!row.account) return null;
                const value = row.type === 'Dr' ? Number(row.debit || 0) : Number(row.credit || 0);
                return (
                  <div key={rIdx} className="flex justify-between items-center text-[10px] p-2 bg-gray-50 dark:bg-slate-850/50 rounded border dark:border-slate-200">
                    <span className="font-semibold text-gray-700 dark:text-slate-300 truncate max-w-[140px]">{row.account}</span>
                    <span className={`font-bold ${row.type === 'Dr' ? 'text-green-600' : 'text-red-500'}`}>
                      {row.type === 'Dr' ? `+ ₹ ${value.toLocaleString('en-IN')}` : `- ₹ ${value.toLocaleString('en-IN')}`} 
                      <span className="text-[8px] font-normal text-gray-400 ml-1">({row.type})</span>
                    </span>
                  </div>
                );
              })}
              {rows.filter(r => r.account).length === 0 && (
                <div className="text-[10px] text-gray-400 text-center py-4">
                  Select accounts to see simulated ledger updates.
                </div>
              )}
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default NewJournal;
