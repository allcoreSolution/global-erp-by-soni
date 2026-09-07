import React, { useState } from 'react';
import {
  Plus, Search, Download, Upload, FileText, Eye, Edit, Trash2,
  Check, X, ChevronDown, ChevronRight, Printer, User, Phone,
  Mail, MapPin, Building, CreditCard, DollarSign, History,
  Calendar, Layers, ShieldCheck
} from 'lucide-react';

const SupplierMaster = () => {
  // Mock Supplier Data
  const [suppliers, setSuppliers] = useState([
    {
      id: 'SUP-001',
      name: 'Rathi Steel Traders',
      type: 'Manufacturer',
      category: 'Raw Materials',
      status: true,
      contactPerson: 'Sanjay Rathi',
      phone: '9414012345',
      email: 'sanjay@rathisteel.com',
      address: 'Plot No. 12, Industrial Area, Phase-I, Alwar, Rajasthan - 301001',
      gstin: '08RATHI1234A1Z0',
      pan: 'RATHI1234A',
      bankName: 'Punjab National Bank',
      bankAccount: '01234567890123',
      bankIfsc: 'PUNB0012300',
      openingBalance: 75000,
      balanceType: 'Cr', // Cr = Outstanding Payable, Dr = Advance paid
      creditPeriod: 60,
      paymentTerms: 'Net 60',
      purchaseHistory: [
        { billNo: 'BILL-2024-102', date: '2024-05-01', amount: 80000, status: 'Paid' },
        { billNo: 'BILL-2024-156', date: '2024-05-18', amount: 95000, status: 'Unpaid' },
      ],
      paymentHistory: [
        { paymentNo: 'PAY-2024-099', date: '2024-05-03', amount: 80000, mode: 'RTGS', refNo: 'R112233' }
      ],
      purchaseReturnHistory: [
        { debitNoteNo: 'DBN-2024-011', date: '2024-05-20', amount: 5000, reason: 'Defective pipes' }
      ]
    },
    {
      id: 'SUP-002',
      name: 'Krishna Enterprises',
      type: 'Distributor',
      category: 'Packaging',
      status: true,
      contactPerson: 'Krishna Murari',
      phone: '9928011223',
      email: 'krishna.murari@enterprise.com',
      address: 'Shop 5, Subhash Marg, C-Scheme, Jaipur, Rajasthan - 302001',
      gstin: '08KRISH5566B2Z9',
      pan: 'KRISH5566B',
      bankName: 'HDFC Bank',
      bankAccount: '50200012345678',
      bankIfsc: 'HDFC0000012',
      openingBalance: 15000,
      balanceType: 'Cr',
      creditPeriod: 30,
      paymentTerms: 'Net 30',
      purchaseHistory: [
        { billNo: 'BILL-2024-045', date: '2024-05-10', amount: 15000, status: 'Paid' }
      ],
      paymentHistory: [
        { paymentNo: 'PAY-2024-023', date: '2024-05-12', amount: 15000, mode: 'UPI', refNo: 'U223344' }
      ],
      purchaseReturnHistory: []
    },
    {
      id: 'SUP-003',
      name: 'Vikas Logistics & Co',
      type: 'Service Provider',
      category: 'Logistics',
      status: false,
      contactPerson: 'Vikas Yadav',
      phone: '9829098765',
      email: 'vikas@vikaslogistics.com',
      address: '22, Transport Nagar, Jaipur, Rajasthan - 302003',
      gstin: '08VIKAS9999C3Z1',
      pan: 'VIKAS9999C',
      bankName: 'Bank of Baroda',
      bankAccount: '112233445566',
      bankIfsc: 'BARB0TRANSP',
      openingBalance: 0,
      balanceType: 'Dr',
      creditPeriod: 15,
      paymentTerms: 'Due on Receipt',
      purchaseHistory: [],
      paymentHistory: [],
      purchaseReturnHistory: []
    }
  ]);

  // Section Accordion Toggle States (All headings in bold are dropdowns)
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    contactAddress: false,
    taxFinancial: false,
    transactionHistory: false,
    utilities: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Selected Supplier for details display inside tabs
  const [selectedSupplierId, setSelectedSupplierId] = useState('SUP-001');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // Form Modals for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('basic');

  const initialFormState = {
    id: '',
    name: '',
    type: 'Manufacturer',
    category: 'Raw Materials',
    status: true,
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    pan: '',
    bankName: '',
    bankAccount: '',
    bankIfsc: '',
    openingBalance: 0,
    balanceType: 'Cr',
    creditPeriod: 30,
    paymentTerms: 'Net 30',
    purchaseHistory: [],
    paymentHistory: [],
    purchaseReturnHistory: []
  };

  const [supplierForm, setSupplierForm] = useState(initialFormState);

  // Get currently active selected supplier data
  const currentSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // Filter Logic
  const filteredSuppliers = suppliers.filter(sup => {
    const matchesSearch = sup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sup.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sup.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? sup.type === filterType : true;
    const matchesCategory = filterCategory ? sup.category === filterCategory : true;
    const matchesStatus = filterStatus ? (filterStatus === 'Active' ? sup.status === true : sup.status === false) : true;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Pagination calculation
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSuppliers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSuppliers.length / recordsPerPage);

  // Actions
  const handleToggleStatus = (id) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, status: !s.status } : s));
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete supplier ${id}?`)) {
      setSuppliers(suppliers.filter(s => s.id !== id));
      if (selectedSupplierId === id) {
        setSelectedSupplierId(suppliers[0]?.id || '');
      }
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    const nextNum = suppliers.length + 1;
    const autoId = `SUP-${String(nextNum).padStart(3, '0')}`;
    setSupplierForm({ ...initialFormState, id: autoId });
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setIsEditMode(true);
    setSupplierForm({ ...sup });
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!supplierForm.name.trim()) return;

    if (isEditMode) {
      setSuppliers(suppliers.map(s => s.id === supplierForm.id ? { ...supplierForm } : s));
    } else {
      setSuppliers([...suppliers, { ...supplierForm }]);
      setSelectedSupplierId(supplierForm.id);
    }
    setIsModalOpen(false);
  };

  // Utilities Functions
  const handleExport = () => {
    alert("Supplier data exported successfully to CSV!");
  };

  const handleImport = () => {
    const file = prompt("Enter spreadsheet file path to mock import Suppliers:");
    if (file) {
      alert(`Imported suppliers list successfully from: ${file}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Payable Calculator factoring balances
  const calculatePayable = (sup) => {
    if (!sup) return 0;
    const totalPurchases = sup.purchaseHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalPaid = sup.paymentHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalReturned = sup.purchaseReturnHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;

    const openingBal = sup.balanceType === 'Cr' ? sup.openingBalance : -sup.openingBalance;
    const payable = openingBal + totalPurchases - totalPaid - totalReturned;
    return payable;
  };

  return (
    <div className="bg-slate-50 text-gray-900 p-6 rounded-xl shadow-md border border-slate-200 min-h-screen space-y-4">
      {/* Title Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Supplier Master Dashboard</h1>
          <p className="text-sm text-gray-500">Manage procurements, supplier profiles, purchase returns, and real-time ledger accounting.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow transition-colors"
        >
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      {/* DROPDOWN SECTION 5: UTILITIES */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('utilities')}
          className="w-full bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 font-bold p-3.5 flex justify-between items-center text-sm tracking-wider uppercase"
        >
          <span className="flex items-center gap-2">🛠️ Utilities & Filters</span>
          {openSections.utilities ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openSections.utilities && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-50 border-t border-slate-200">
            <div className="relative md:col-span-2">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, Name or Contact Person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-xs bg-white focus:outline-none"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-slate-300 rounded-md text-xs py-2 px-3 bg-white focus:outline-none"
              >
                <option value="">All Supplier Types</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Distributor">Distributor</option>
                <option value="Service Provider">Service Provider</option>
              </select>
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-md text-xs py-2 px-3 bg-white focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Packaging">Packaging</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={handleImport}
                title="Import Excel/CSV file"
                className="flex-1 py-1.5 border border-slate-300 rounded text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-slate-100 bg-white"
              >
                <Upload size={12} /> Import
              </button>
              <button
                onClick={handleExport}
                title="Export list to CSV"
                className="flex-1 py-1.5 border border-slate-300 rounded text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-slate-100 bg-white"
              >
                <Download size={12} /> Export
              </button>
              <button
                onClick={handlePrint}
                title="Print supplier master directory"
                className="p-2 border border-slate-300 rounded hover:bg-slate-100 bg-white"
              >
                <Printer size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DROPDOWN SECTION 1: BASIC INFORMATION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('basicInfo')}
          className="w-full bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 font-bold p-3.5 flex justify-between items-center text-sm tracking-wider uppercase"
        >
          <span className="flex items-center gap-2">🏭 Basic Information (Supplier List & CRUD)</span>
          {openSections.basicInfo ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openSections.basicInfo && (
          <div className="p-4 space-y-4">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-gray-700">
                    <th className="p-2.5">Supplier ID</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-right">Payable Balance (₹)</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRecords.length > 0 ? (
                    currentRecords.map((sup) => {
                      const payable = calculatePayable(sup);
                      const isSelected = selectedSupplierId === sup.id;
                      return (
                        <tr
                          key={sup.id}
                          onClick={() => setSelectedSupplierId(sup.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-2.5 font-bold text-indigo-600">{sup.id}</td>
                          <td className="p-2.5 font-medium text-gray-900">
                            <div>{sup.name}</div>
                            <div className="text-[10px] text-gray-400">Person: {sup.contactPerson}</div>
                          </td>
                          <td className="p-2.5 text-gray-600">{sup.type}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                              {sup.category}
                            </span>
                          </td>
                          <td className={`p-2.5 text-right font-semibold ${payable >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            ₹ {Math.abs(payable).toLocaleString()} {payable >= 0 ? 'Cr' : 'Dr'}
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(sup.id);
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sup.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {sup.status ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedSupplierId(sup.id);
                                  setOpenSections(prev => ({
                                    ...prev,
                                    contactAddress: true,
                                    taxFinancial: true,
                                    transactionHistory: true
                                  }));
                                }}
                                title="Expand Details Panels Below"
                                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(sup)}
                                className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(sup.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-gray-500">No suppliers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center text-[11px] text-gray-600 bg-slate-50 p-2 rounded">
                <span>Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers</span>
                <div className="flex gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1 border bg-white rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="py-1 px-2 border rounded bg-white font-bold">{currentPage}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1 border bg-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DROPDOWN SECTION 2: CONTACT & ADDRESS */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('contactAddress')}
          className="w-full bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 font-bold p-3.5 flex justify-between items-center text-sm tracking-wider uppercase"
        >
          <span className="flex items-center gap-2">📞 Contact & Address ({currentSupplier ? currentSupplier.name : 'No Supplier Selected'})</span>
          {openSections.contactAddress ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openSections.contactAddress && currentSupplier && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 border-t">
            <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-[13px] border-b pb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-indigo-600" /> Contact Details
              </h4>
              <div className="space-y-1">
                <p><span className="text-gray-500">Contact Representative:</span> <strong className="text-gray-900">{currentSupplier.contactPerson}</strong></p>
                <p><span className="text-gray-500">Phone Link:</span> <strong className="text-gray-900">{currentSupplier.phone}</strong></p>
                <p><span className="text-gray-500">Email Address:</span> <strong className="text-gray-900 break-all">{currentSupplier.email}</strong></p>
              </div>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-[13px] border-b pb-1.5 flex items-center gap-1.5">
                <MapPin size={14} className="text-rose-600" /> Main Office & Dispatch Address
              </h4>
              <p className="text-gray-700 leading-relaxed font-medium">
                {currentSupplier.address}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DROPDOWN SECTION 3: TAX & FINANCIAL */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('taxFinancial')}
          className="w-full bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 font-bold p-3.5 flex justify-between items-center text-sm tracking-wider uppercase"
        >
          <span className="flex items-center gap-2">💰 Tax & Financial Specifications ({currentSupplier ? currentSupplier.name : 'No Supplier Selected'})</span>
          {openSections.taxFinancial ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openSections.taxFinancial && currentSupplier && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 border-t">
            <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-[13px] border-b pb-1.5 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-600" /> Tax registrations
              </h4>
              <p><span className="text-gray-500">GSTIN Registration:</span> <strong className="font-mono text-gray-900">{currentSupplier.gstin || 'Unregistered'}</strong></p>
              <p><span className="text-gray-500">PAN ID Number:</span> <strong className="font-mono text-gray-900">{currentSupplier.pan}</strong></p>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-[13px] border-b pb-1.5 flex items-center gap-1.5">
                <Building size={14} className="text-indigo-600" /> Bank Clearing Data
              </h4>
              <p><span className="text-gray-500">Bank Name:</span> <strong className="text-gray-900">{currentSupplier.bankName}</strong></p>
              <p><span className="text-gray-500">Bank Account A/C:</span> <strong className="text-gray-900 font-mono">{currentSupplier.bankAccount}</strong></p>
              <p><span className="text-gray-500">IFSC Code:</span> <strong className="text-gray-900 font-mono">{currentSupplier.bankIfsc}</strong></p>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-[13px] border-b pb-1.5 flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-600" /> Procurement Credit Terms
              </h4>
              <p><span className="text-gray-500">Opening Balance:</span> <strong className="text-gray-900">₹ {currentSupplier.openingBalance.toLocaleString()} ({currentSupplier.balanceType})</strong></p>
              <p><span className="text-gray-500">Credit period limit:</span> <strong className="text-gray-900">{currentSupplier.creditPeriod} Days</strong></p>
              <p><span className="text-gray-500">Payment Term protocol:</span> <strong className="text-gray-900">{currentSupplier.paymentTerms}</strong></p>
            </div>
          </div>
        )}
      </div>

      {/* DROPDOWN SECTION 4: TRANSACTION & HISTORY */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('transactionHistory')}
          className="w-full bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 font-bold p-3.5 flex justify-between items-center text-sm tracking-wider uppercase"
        >
          <span className="flex items-center gap-2">📊 Transactions & Accounting History ({currentSupplier ? currentSupplier.name : 'No Supplier Selected'})</span>
          {openSections.transactionHistory ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openSections.transactionHistory && currentSupplier && (
          <div className="p-4 space-y-4 bg-slate-50 border-t">
            {/* Purchase & Return histories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1"><FileText size={12} /> Purchase History</h4>
                <div className="overflow-y-auto max-h-36 text-[10px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 sticky top-0">
                      <tr>
                        <th className="p-1">Bill No</th>
                        <th className="p-1">Date</th>
                        <th className="p-1 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentSupplier.purchaseHistory?.length > 0 ? (
                        currentSupplier.purchaseHistory.map((h, i) => (
                          <tr key={i}>
                            <td className="p-1 text-indigo-600 font-semibold">{h.billNo}</td>
                            <td className="p-1 text-gray-500">{h.date}</td>
                            <td className="p-1 text-right font-medium">₹ {h.amount.toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="3" className="p-2 text-center text-gray-400">No bills found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1"><CreditCard size={12} /> Payment History</h4>
                <div className="overflow-y-auto max-h-36 text-[10px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 sticky top-0">
                      <tr>
                        <th className="p-1">Pay No</th>
                        <th className="p-1">Mode</th>
                        <th className="p-1 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentSupplier.paymentHistory?.length > 0 ? (
                        currentSupplier.paymentHistory.map((p, i) => (
                          <tr key={i}>
                            <td className="p-1 text-gray-800">{p.paymentNo}</td>
                            <td className="p-1 text-gray-600">{p.mode}</td>
                            <td className="p-1 text-right text-emerald-600 font-bold">₹ {p.amount.toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="3" className="p-2 text-center text-gray-400">No payments found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1"><History size={12} /> Purchase Return History</h4>
                <div className="overflow-y-auto max-h-36 text-[10px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 sticky top-0">
                      <tr>
                        <th className="p-1">Debit Note</th>
                        <th className="p-1">Reason</th>
                        <th className="p-1 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentSupplier.purchaseReturnHistory?.length > 0 ? (
                        currentSupplier.purchaseReturnHistory.map((r, i) => (
                          <tr key={i}>
                            <td className="p-1 text-red-600 font-mono font-semibold">{r.debitNoteNo}</td>
                            <td className="p-1 text-gray-500 truncate max-w-20" title={r.reason}>{r.reason}</td>
                            <td className="p-1 text-right text-rose-600 font-medium">₹ {r.amount.toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="3" className="p-2 text-center text-gray-400">No returns found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Supplier Ledger Accounts Card */}
            <div className="bg-white p-3.5 rounded border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs border-b pb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1"><DollarSign size={14} /> Supplier Ledger Account Postings</h4>
                <div className="flex gap-4">
                  <span className="font-semibold text-gray-600">Total Outstanding Payable: </span>
                  <span className={`font-bold ${calculatePayable(currentSupplier) >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    ₹ {Math.abs(calculatePayable(currentSupplier)).toLocaleString()} {calculatePayable(currentSupplier) >= 0 ? 'Cr (Payable)' : 'Dr (Advance)'}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto text-[10px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b font-bold text-gray-700">
                      <th className="p-2">Date</th>
                      <th className="p-2">Particulars</th>
                      <th className="p-2 text-right">Debit (Dr) (₹)</th>
                      <th className="p-2 text-right">Credit (Cr) (₹)</th>
                      <th className="p-2 text-right">Running Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Opening Balance */}
                    <tr className="font-medium bg-slate-50">
                      <td className="p-2 text-gray-400">-</td>
                      <td className="p-2 font-semibold">Opening Balance</td>
                      <td className="p-2 text-right">{currentSupplier.balanceType === 'Dr' ? `₹ ${currentSupplier.openingBalance.toLocaleString()}` : '-'}</td>
                      <td className="p-2 text-right">{currentSupplier.balanceType === 'Cr' ? `₹ ${currentSupplier.openingBalance.toLocaleString()}` : '-'}</td>
                      <td className="p-2 text-right font-bold text-gray-800">
                        ₹ {currentSupplier.openingBalance.toLocaleString()} {currentSupplier.balanceType}
                      </td>
                    </tr>

                    {/* Ledger Posting Processing */}
                    {(() => {
                      const postings = [];
                      // Purchases = Cr
                      currentSupplier.purchaseHistory?.forEach(p => {
                        postings.push({
                          date: p.date,
                          particulars: `Purchase Bill: ${p.billNo}`,
                          dr: 0,
                          cr: p.amount
                        });
                      });

                      // Payments = Dr
                      currentSupplier.paymentHistory?.forEach(pm => {
                        postings.push({
                          date: pm.date,
                          particulars: `Supplier Payment RTGS/UPI: ${pm.paymentNo}`,
                          dr: pm.amount,
                          cr: 0
                        });
                      });

                      // Returns = Dr
                      currentSupplier.purchaseReturnHistory?.forEach(pr => {
                        postings.push({
                          date: pr.date,
                          particulars: `Purchase Return Debit Note: ${pr.debitNoteNo}`,
                          dr: pr.amount,
                          cr: 0
                        });
                      });

                      // Sorting
                      postings.sort((a, b) => new Date(a.date) - new Date(b.date));

                      let runningVal = currentSupplier.balanceType === 'Cr' ? currentSupplier.openingBalance : -currentSupplier.openingBalance;
                      return postings.map((post, idx) => {
                        runningVal = runningVal + post.cr - post.dr;
                        const balType = runningVal >= 0 ? 'Cr' : 'Dr';
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 text-gray-500">{post.date}</td>
                            <td className="p-2 text-gray-800">{post.particulars}</td>
                            <td className="p-2 text-right text-emerald-600 font-medium">{post.dr > 0 ? `₹ ${post.dr.toLocaleString()}` : '-'}</td>
                            <td className="p-2 text-right text-amber-600 font-medium">{post.cr > 0 ? `₹ ${post.cr.toLocaleString()}` : '-'}</td>
                            <td className="p-2 text-right font-bold text-gray-900">
                              ₹ {Math.abs(runningVal).toLocaleString()} {balType}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL FOR CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 flex justify-between items-center">
              <h2 className="text-base font-bold">
                {isEditMode ? `Edit Supplier (${supplierForm.id})` : 'Add New Supplier Credentials'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-slate-800">
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex bg-slate-100 border-b text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFormTab('basic')}
                className={`py-3 px-5 border-b-2 ${activeFormTab === 'basic' ? 'border-blue-600 text-indigo-600 bg-white' : 'border-transparent text-gray-600 hover:bg-slate-50'}`}
              >
                Basic & Contact Info
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('financial')}
                className={`py-3 px-5 border-b-2 ${activeFormTab === 'financial' ? 'border-blue-600 text-indigo-600 bg-white' : 'border-transparent text-gray-600 hover:bg-slate-50'}`}
              >
                Tax, Bank & Credit Terms
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {activeFormTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Supplier Code *</label>
                      <input
                        type="text"
                        disabled
                        value={supplierForm.id}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Supplier Business Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Balaji Steel Products"
                        value={supplierForm.name}
                        onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Supplier Type</label>
                      <select
                        value={supplierForm.type}
                        onChange={(e) => setSupplierForm({ ...supplierForm, type: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      >
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Service Provider">Service Provider</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Category Type</label>
                      <select
                        value={supplierForm.category}
                        onChange={(e) => setSupplierForm({ ...supplierForm, category: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      >
                        <option value="Raw Materials">Raw Materials</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Logistics">Logistics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Active Status</label>
                      <select
                        value={supplierForm.status ? 'Active' : 'Inactive'}
                        onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value === 'Active' })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="Name of SPOC"
                        value={supplierForm.contactPerson}
                        onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10 digit phone number"
                        value={supplierForm.phone}
                        onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. sales@vendor.com"
                        value={supplierForm.email}
                        onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">Supplier Address Location *</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="Enter office, factory or godown address..."
                      value={supplierForm.address}
                      onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                      className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeFormTab === 'financial' && (
                <div className="space-y-4">
                  {/* Tax */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        placeholder="GST registration code"
                        value={supplierForm.gstin}
                        onChange={(e) => setSupplierForm({ ...supplierForm, gstin: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">PAN card Number</label>
                      <input
                        type="text"
                        placeholder="Vendor PAN Identification"
                        value={supplierForm.pan}
                        onChange={(e) => setSupplierForm({ ...supplierForm, pan: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Bank info */}
                  <div className="bg-slate-50 p-3.5 rounded border">
                    <h4 className="font-semibold text-slate-800 text-[11px] mb-2 uppercase tracking-wide">Bank Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Bank Name"
                          value={supplierForm.bankName}
                          onChange={(e) => setSupplierForm({ ...supplierForm, bankName: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Account A/C Number"
                          value={supplierForm.bankAccount}
                          onChange={(e) => setSupplierForm({ ...supplierForm, bankAccount: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="IFSC Bank code"
                          value={supplierForm.bankIfsc}
                          onChange={(e) => setSupplierForm({ ...supplierForm, bankIfsc: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Opening Balance (₹)</label>
                      <input
                        type="number"
                        value={supplierForm.openingBalance}
                        onChange={(e) => setSupplierForm({ ...supplierForm, openingBalance: Number(e.target.value) })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Balance Post type</label>
                      <select
                        value={supplierForm.balanceType}
                        onChange={(e) => setSupplierForm({ ...supplierForm, balanceType: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      >
                        <option value="Cr">Cr (Outstanding Payable)</option>
                        <option value="Dr">Dr (Advance paid)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Credit Period (Days)</label>
                      <input
                        type="number"
                        value={supplierForm.creditPeriod}
                        onChange={(e) => setSupplierForm({ ...supplierForm, creditPeriod: Number(e.target.value) })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 uppercase mb-1">Payment Protocol</label>
                      <select
                        value={supplierForm.paymentTerms}
                        onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none"
                      >
                        <option value="Due on Receipt">Due on Receipt</option>
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 45">Net 45</option>
                        <option value="Net 60">Net 60</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded text-xs hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-slate-800 rounded text-xs font-semibold"
              >
                Save Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierMaster;
