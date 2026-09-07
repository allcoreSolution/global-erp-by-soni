import React, { useState, useEffect } from 'react';
import { Search, Download, Printer, Filter, RefreshCw, Eye, BookOpen, CheckCircle } from 'lucide-react';

const DayBook = () => {
  // Demo Transactions Data
  const initialTransactions = [
    { id: 'SL-2026-009', type: 'Sales', party: 'Amit Sharma (Retail)', refNo: 'INV-2026-1122', debit: 14160, credit: 0, mode: 'Cash', user: 'Cashier-01', time: '10:15 AM' },
    { id: 'PR-2026-004', type: 'Purchase', party: 'Acme Distributors Ltd.', refNo: 'INV-2026-9811', debit: 0, credit: 17700, mode: 'Bank Transfer', user: 'Admin', time: '11:30 AM' },
    { id: 'REC-2026-012', type: 'Receipt', party: 'Superstone Enterprises', refNo: 'REC-9981', debit: 5900, credit: 0, mode: 'Cheque', user: 'Manager-02', time: '01:10 PM' },
    { id: 'PAY-2026-008', type: 'Payment', party: 'Electroparts India', refNo: 'PAY-8821', debit: 0, credit: 4500, mode: 'Cash', user: 'Cashier-01', time: '02:45 PM' },
    { id: 'CNTR-2026-011', type: 'Contra', party: 'Cash Deposit to HDFC', refNo: 'DEP-8844', debit: 10000, credit: 10000, mode: 'Cash', user: 'Admin', time: '03:15 PM' },
    { id: 'DN-2026-001', type: 'Debit Note', party: 'Acme Distributors Ltd.', refNo: 'DN-2026-001', debit: 17700, credit: 0, mode: 'Journal Adjustment', user: 'Admin', time: '04:00 PM' },
    { id: 'CN-2026-001', type: 'Credit Note', party: 'Amit Sharma (Retail)', refNo: 'CN-2026-001', debit: 0, credit: 14160, mode: 'Journal Adjustment', user: 'Manager-02', time: '04:30 PM' }
  ];

  // State Management
  const [transactions, setTransactions] = useState(initialTransactions);
  const [openingBalance, setOpeningBalance] = useState(50000); // Fixed demo opening balance
  const [filters, setFilters] = useState({
    dateFrom: new Date().toISOString().slice(0, 10),
    dateTo: new Date().toISOString().slice(0, 10),
    company: 'All',
    branch: 'All',
    type: 'All',
    party: '',
    user: 'All',
    mode: 'All'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [log, setLog] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    type: 'Journal',
    party: '',
    refNo: '',
    debit: 0,
    credit: 0,
    mode: 'Cash',
    user: 'Admin'
  });

  const addLog = (msg) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  // Dynamic calculations
  const [summary, setSummary] = useState({
    totalDebit: 0,
    totalCredit: 0,
    closingBalance: 0
  });

  useEffect(() => {
    let debits = 0;
    let credits = 0;
    transactions.forEach(t => {
      debits += t.debit;
      credits += t.credit;
    });
    setSummary({
      totalDebit: debits,
      totalCredit: credits,
      closingBalance: openingBalance + debits - credits
    });
  }, [transactions, openingBalance]);

  // Filtering Logic
  const handleApplyFilters = () => {
    addLog("Applying filter metrics to transaction books...");
    let filtered = initialTransactions.filter(t => {
      // Search Term check
      const matchSearch = searchTerm === '' || 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.refNo.toLowerCase().includes(searchTerm.toLowerCase());

      // Dropdown Type check
      const matchType = filters.type === 'All' || t.type === filters.type;

      // Dropdown User check
      const matchUser = filters.user === 'All' || t.user === filters.user;

      // Dropdown Payment Mode check
      const matchMode = filters.mode === 'All' || t.mode === filters.mode;

      // Party input check
      const matchParty = filters.party === '' || t.party.toLowerCase().includes(filters.party.toLowerCase());

      return matchSearch && matchType && matchUser && matchMode && matchParty;
    });

    setTransactions(filtered);
    addLog(`Success: Found ${filtered.length} entries matching criteria.`);
  };

  const handleResetFilters = () => {
    setFilters({
      dateFrom: new Date().toISOString().slice(0, 10),
      dateTo: new Date().toISOString().slice(0, 10),
      company: 'All',
      branch: 'All',
      type: 'All',
      party: '',
      user: 'All',
      mode: 'All'
    });
    setSearchTerm('');
    setTransactions(initialTransactions);
    addLog("Reset filters to default settings.");
  };

  const handleExportCSV = () => {
    addLog("Exporting Day Book logs to CSV sheet...");
    const headers = ['Time', 'Voucher ID', 'Transaction Type', 'Particulars / Account', 'Ref No', 'Debit (₹)', 'Credit (₹)', 'Payment Mode', 'User'];
    const rows = transactions.map(t => [
      t.time,
      t.id,
      t.type,
      t.party,
      t.refNo,
      t.debit,
      t.credit,
      t.mode,
      t.user
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `day_book_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("Success: Day Book CSV downloaded.");
  };

  const handlePrint = () => {
    addLog("Spooling printer job (Save as PDF) for day book ledger sheet...");
    window.print();
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    addLog(`Reading import file "${file.name}"...`);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const newEntries = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 9) {
            newEntries.push({
              time: cols[0] || '12:00 PM',
              id: cols[1] || `VOUCH-NEW-${Date.now()}-${i}`,
              type: cols[2] || 'Journal',
              party: cols[3] || 'Imported Account',
              refNo: cols[4] || '',
              debit: Number(cols[5]) || 0,
              credit: Number(cols[6]) || 0,
              mode: cols[7] || 'Cash',
              user: cols[8] || 'Admin'
            });
          }
        }
        if (newEntries.length > 0) {
          setTransactions(prev => [...prev, ...newEntries]);
          addLog(`Success: Imported ${newEntries.length} new Day Book vouchers!`);
          alert(`Successfully imported ${newEntries.length} transactions!`);
        } else {
          addLog("Warning: No valid rows parsed from CSV file.");
          alert("Import failed. CSV headers should match: Time, Voucher ID, Type, Particulars, Ref No, Debit, Credit, Payment Mode, User");
        }
      } catch (err) {
        addLog("Error: Failed to parse CSV correctly.");
      }
    };
    reader.readAsText(file);
  };
  const handleAddTransactionSubmit = (e) => {
    e.preventDefault();
    if (!addForm.party) {
      alert("Please enter a Party/Ledger name.");
      return;
    }
    const typeShortMap = {
      Sales: 'SL',
      Purchase: 'PR',
      Receipt: 'REC',
      Payment: 'PAY',
      Contra: 'CNTR',
      Journal: 'JR',
      'Debit Note': 'DN',
      'Credit Note': 'CN'
    };
    const prefix = typeShortMap[addForm.type] || 'VOUCH';
    const newTx = {
      id: `${prefix}-2026-${Date.now().toString().slice(-4)}`,
      type: addForm.type,
      party: addForm.party,
      refNo: addForm.refNo || 'N/A',
      debit: Number(addForm.debit) || 0,
      credit: Number(addForm.credit) || 0,
      mode: addForm.mode,
      user: addForm.user,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setTransactions(prev => [newTx, ...prev]);
    setIsAddModalOpen(false);
    addLog(`Manually created new ${addForm.type} voucher ${newTx.id} for "${addForm.party}"`);
    alert(`Voucher ${newTx.id} created successfully!`);
    setAddForm({
      type: 'Journal',
      party: '',
      refNo: '',
      debit: 0,
      credit: 0,
      mode: 'Cash',
      user: 'Admin'
    });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200/70 shadow-sm min-h-screen space-y-6">
      <input
        type="file"
        id="day-book-import-csv"
        accept=".csv"
        className="hidden"
        onChange={handleImportCSV}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-indigo-600" size={22} /> Day Book Register
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Audit daily cash ledger books, double-entry vouchers, and sales/purchase cashflows.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto no-print">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-650 text-white bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-semibold transition-colors"
          >
            + Add Transaction
          </button>
          <button
            onClick={() => document.getElementById('day-book-import-csv').click()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-xs font-semibold transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Printer size={14} /> Save as PDF / Print
          </button>
        </div>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-50 border border-blue-200 p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] uppercase tracking-wider font-bold text-gray-550">Opening Balance</span>
          <span className="text-sm sm:text-base font-extrabold text-gray-800">₹ {openingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="bg-blue-50/50 border border-blue-300 p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-600">Total Debit (+)</span>
          <span className="text-sm sm:text-base font-extrabold text-blue-700">₹ {summary.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="bg-rose-50/50 border border-rose-200 p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] uppercase tracking-wider font-bold text-rose-600">Total Credit (-)</span>
          <span className="text-sm sm:text-base font-extrabold text-rose-700">₹ {summary.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-250 p-3.5 rounded-lg flex flex-col justify-between col-span-2 md:col-span-2">
          <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-600">Closing Balance</span>
          <span className="text-sm sm:text-lg font-extrabold text-emerald-800">₹ {summary.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Multi Filters Division */}
      <div className="bg-slate-50 p-4 border border-blue-200 rounded-lg space-y-4 no-print">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Filter size={14} className="text-indigo-600" /> Filter Criteria Configuration
          </h3>
          <div className="flex gap-2">
            <button onClick={handleApplyFilters} className="px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded text-[11px] font-bold">
              Apply Filters
            </button>
            <button onClick={handleResetFilters} className="px-3 py-1 border border-gray-300 bg-white hover:bg-slate-100 text-gray-700 rounded text-[11px] font-bold">
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full border p-1.5 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full border p-1.5 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Company Selection</label>
            <select
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              className="w-full border p-1.5 rounded bg-white"
            >
              <option value="All">All Companies</option>
              <option value="Allcore Solution">Allcore Solution Private Limited</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Branch Name</label>
            <select
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              className="w-full border p-1.5 rounded bg-white"
            >
              <option value="All">All Branches</option>
              <option value="H.O. Delhi">Head Office - Delhi</option>
              <option value="B.O. Mumbai">Branch Office - Mumbai</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Transaction Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border p-1.5 rounded bg-white"
            >
              <option value="All">All Transactions</option>
              <option value="Sales">Sales</option>
              <option value="Purchase">Purchase</option>
              <option value="Receipt">Receipt</option>
              <option value="Payment">Payment</option>
              <option value="Contra">Contra</option>
              <option value="Journal">Journal</option>
              <option value="Debit Note">Debit Note</option>
              <option value="Credit Note">Credit Note</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Account / Party Name</label>
            <input
              type="text"
              placeholder="e.g. Amit Sharma / Acme"
              value={filters.party}
              onChange={(e) => setFilters({ ...filters, party: e.target.value })}
              className="w-full border p-1.5 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">User / Cashier</label>
            <select
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="w-full border p-1.5 rounded bg-white"
            >
              <option value="All">All Users</option>
              <option value="Admin">Admin</option>
              <option value="Cashier-01">Cashier-01</option>
              <option value="Manager-02">Manager-02</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Payment Mode</label>
            <select
              value={filters.mode}
              onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
              className="w-full border p-1.5 rounded bg-white"
            >
              <option value="All">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Journal Adjustment">Journal Adjustment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Day Book Table */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="font-bold text-[11px] sm:text-xs uppercase text-slate-700 tracking-wider">Today's Transactions Journals</h3>
          <div className="relative max-w-xs w-full no-print">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Particulars / ID / Ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border rounded overflow-x-auto text-[10px] sm:text-[11px]">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-2 whitespace-nowrap">Time</th>
                <th className="p-2 whitespace-nowrap">Voucher ID</th>
                <th className="p-2 whitespace-nowrap">Type</th>
                <th className="p-2 whitespace-nowrap">Particulars / Party Ledger</th>
                <th className="p-2 whitespace-nowrap font-mono">Invoice / Ref No</th>
                <th className="p-2 whitespace-nowrap text-right text-blue-700">Debit (+)</th>
                <th className="p-2 whitespace-nowrap text-right text-rose-700">Credit (-)</th>
                <th className="p-2 whitespace-nowrap">Payment Mode</th>
                <th className="p-2 whitespace-nowrap">Created By</th>
                <th className="p-2 whitespace-nowrap text-center no-print">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length > 0 ? (
                transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-2 text-gray-500 whitespace-nowrap">{t.time}</td>
                    <td className="p-2 font-mono font-bold text-indigo-600 whitespace-nowrap">{t.id}</td>
                    <td className="p-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                        t.type === 'Sales' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        t.type === 'Purchase' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        t.type === 'Receipt' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        'bg-slate-100 text-slate-700 border'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-2 font-medium text-gray-800">{t.party}</td>
                    <td className="p-2 font-mono text-gray-550">{t.refNo}</td>
                    <td className="p-2 text-right font-bold text-blue-700">
                      {t.debit > 0 ? `₹ ${t.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="p-2 text-right font-bold text-rose-700">
                      {t.credit > 0 ? `₹ ${t.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="p-2 text-gray-600 font-medium whitespace-nowrap">{t.mode}</td>
                    <td className="p-2 text-gray-500 whitespace-nowrap">{t.user}</td>
                    <td className="p-2 text-center no-print">
                      <button
                        onClick={() => {
                          setSelectedVoucher(t);
                          addLog(`Detailed preview launched for voucher: ${t.id}`);
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                      >
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500 italic">No transactions found for the day.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Detail Modal Overlay */}
      {selectedVoucher && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-lg border max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Voucher Receipt Ledger View</h3>
              <button onClick={() => setSelectedVoucher(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">×</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Voucher Number:</span> <span className="font-mono font-bold text-indigo-600">{selectedVoucher.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Trans Type:</span> <span className="font-bold text-gray-800">{selectedVoucher.type}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Party Ledger:</span> <span className="font-bold text-gray-800">{selectedVoucher.party}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Reference Ref:</span> <span className="font-mono text-gray-600">{selectedVoucher.refNo}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Debited Amount:</span> <span className="font-bold text-indigo-600">₹ {selectedVoucher.debit.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Credited Amount:</span> <span className="font-bold text-rose-600">₹ {selectedVoucher.credit.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment Mode:</span> <span className="font-bold text-slate-700">{selectedVoucher.mode}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Created User:</span> <span className="text-gray-700">{selectedVoucher.user} ({selectedVoucher.time})</span></div>
            </div>
            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => { window.print(); setSelectedVoucher(null); }}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 font-bold"
              >
                Print Voucher Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-lg border max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Add New Manual Transaction</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">×</button>
            </div>
            
            <form onSubmit={handleAddTransactionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Voucher Type *</label>
                <select
                  value={addForm.type}
                  onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none bg-white"
                >
                  <option value="Sales">Sales Voucher</option>
                  <option value="Purchase">Purchase Voucher</option>
                  <option value="Receipt">Receipt Voucher</option>
                  <option value="Payment">Payment Voucher</option>
                  <option value="Contra">Contra Voucher</option>
                  <option value="Journal">General Journal Entry</option>
                  <option value="Debit Note">Debit Note</option>
                  <option value="Credit Note">Credit Note</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Particulars / Party Ledger *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar / Office Expenses"
                  value={addForm.party}
                  onChange={(e) => setAddForm({ ...addForm, party: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ref / Invoice No</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-9922"
                    value={addForm.refNo}
                    onChange={(e) => setAddForm({ ...addForm, refNo: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Payment Mode</label>
                  <select
                    value={addForm.mode}
                    onChange={(e) => setAddForm({ ...addForm, mode: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Journal Adjustment">Journal Adjustment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Debit Amount (₹)</label>
                  <input
                    type="number"
                    value={addForm.debit}
                    onChange={(e) => setAddForm({ ...addForm, debit: Number(e.target.value) })}
                    className="w-full border p-2 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Credit Amount (₹)</label>
                  <input
                    type="number"
                    value={addForm.credit}
                    onChange={(e) => setAddForm({ ...addForm, credit: Number(e.target.value) })}
                    className="w-full border p-2 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border rounded hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Post Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Operational Logger Console */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 no-print">
        <h4 className="font-mono text-xs font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
          <CheckCircle size={13} className="text-emerald-600" /> Day Book System Activity Monitor
        </h4>
        <div className="font-mono text-[9px] sm:text-[10px] text-slate-600 h-24 overflow-y-auto space-y-1">
          {log.length > 0 ? (
            log.map((line, i) => <div key={i} className="text-slate-700">{line}</div>)
          ) : (
            <div className="text-gray-500 italic">Console initialized. Waiting for actions...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayBook;
