import React, { useState } from 'react';
import {
  Plus, Search, Download, Upload, FileText, Eye, Edit, Trash2,
  Check, X, ChevronLeft, ChevronRight, Printer, User, Phone,
  Mail, MapPin, Building, CreditCard, DollarSign, History
} from 'lucide-react';

const CustomerMaster = () => {
  // Mock Customer Data
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-001',
      name: 'Ramesh Kumar & Sons',
      type: 'Wholesaler',
      category: 'VIP',
      status: true,
      phone: '9876543210',
      email: 'ramesh@kumarandsons.com',
      billingAddress: { street: '12, Gandhi Nagar', city: 'Jaipur', state: 'Rajasthan', zip: '302015' },
      shippingAddress: { street: '12, Gandhi Nagar', city: 'Jaipur', state: 'Rajasthan', zip: '302015' },
      gstin: '08AAAAA1111A1Z1',
      pan: 'AAAAA1111A',
      bankName: 'State Bank of India',
      bankAccount: '12345678901',
      bankIfsc: 'SBIN0001234',
      openingBalance: 25000,
      balanceType: 'Dr',
      creditLimit: 500000,
      creditPeriod: 45,
      paymentTerms: 'Net 45',
      salesHistory: [
        { invoiceNo: 'INV-2024-001', date: '2024-05-10', amount: 15000, status: 'Paid' },
        { invoiceNo: 'INV-2024-008', date: '2024-05-20', amount: 20000, status: 'Unpaid' },
      ],
      paymentHistory: [
        { receiptNo: 'RCT-2024-001', date: '2024-05-12', amount: 15000, mode: 'NEFT', refNo: 'N123456' }
      ],
      salesReturnHistory: [
        { creditNoteNo: 'CRN-2024-002', date: '2024-05-22', amount: 2000, reason: 'Damaged Goods' }
      ]
    },
    {
      id: 'CUST-002',
      name: 'Apex Retailers',
      type: 'Retailer',
      category: 'Regular',
      status: true,
      phone: '8765432109',
      email: 'info@apexretailers.com',
      billingAddress: { street: '45, Station Road', city: 'Kota', state: 'Rajasthan', zip: '324001' },
      shippingAddress: { street: 'Warehouse B, Industrial Area', city: 'Kota', state: 'Rajasthan', zip: '324005' },
      gstin: '08BBBBB2222B2Z2',
      pan: 'BBBBB2222B',
      bankName: 'HDFC Bank',
      bankAccount: '987654321098',
      bankIfsc: 'HDFC0000456',
      openingBalance: 12000,
      balanceType: 'Cr',
      creditLimit: 150000,
      creditPeriod: 30,
      paymentTerms: 'Net 30',
      salesHistory: [
        { invoiceNo: 'INV-2024-003', date: '2024-05-14', amount: 8000, status: 'Paid' }
      ],
      paymentHistory: [
        { receiptNo: 'RCT-2024-002', date: '2024-05-15', amount: 8000, mode: 'UPI', refNo: 'U987654' }
      ],
      salesReturnHistory: []
    },
    {
      id: 'CUST-003',
      name: 'Global Distributors',
      type: 'Distributor',
      category: 'Corporate',
      status: false,
      phone: '7654321098',
      email: 'purchase@globaldist.com',
      billingAddress: { street: 'Plot 10, SEZ Zone', city: 'Noida', state: 'Uttar Pradesh', zip: '201301' },
      shippingAddress: { street: 'Plot 10, SEZ Zone', city: 'Noida', state: 'Uttar Pradesh', zip: '201301' },
      gstin: '09CCCCC3333C3Z3',
      pan: 'CCCCC3333C',
      bankName: 'ICICI Bank',
      bankAccount: '554433221100',
      bankIfsc: 'ICIC0000789',
      openingBalance: 0,
      balanceType: 'Dr',
      creditLimit: 1000000,
      creditPeriod: 60,
      paymentTerms: 'Net 60',
      salesHistory: [],
      paymentHistory: [],
      salesReturnHistory: []
    }
  ]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Form Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState('basic');

  // Detail Modal / Drawer
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('general');

  // Form State
  const initialFormState = {
    id: '',
    name: '',
    type: 'Retailer',
    category: 'Regular',
    status: true,
    phone: '',
    email: '',
    billingAddress: { street: '', city: '', state: '', zip: '' },
    shippingAddress: { street: '', city: '', state: '', zip: '' },
    gstin: '',
    pan: '',
    bankName: '',
    bankAccount: '',
    bankIfsc: '',
    openingBalance: 0,
    balanceType: 'Dr',
    creditLimit: 0,
    creditPeriod: 0,
    paymentTerms: 'Due on Receipt',
    salesHistory: [],
    paymentHistory: [],
    salesReturnHistory: []
  };
  const [customerForm, setCustomerForm] = useState(initialFormState);

  const [copyAddress, setCopyAddress] = useState(false);

  const handleCopyAddress = (e) => {
    const checked = e.target.checked;
    setCopyAddress(checked);
    if (checked) {
      setCustomerForm(prev => ({
        ...prev,
        shippingAddress: { ...prev.billingAddress }
      }));
    }
  };

  // Filter Logic
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cust.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cust.phone.includes(searchTerm);
    const matchesType = filterType ? cust.type === filterType : true;
    const matchesCategory = filterCategory ? cust.category === filterCategory : true;
    const matchesStatus = filterStatus ? (filterStatus === 'Active' ? cust.status === true : cust.status === false) : true;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCustomers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCustomers.length / recordsPerPage);

  const handleToggleStatus = (id) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, status: !c.status } : c));
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm(`Are you sure you want to delete customer ${id}?`)) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    const nextNum = customers.length + 1;
    const autoId = `CUST-${String(nextNum).padStart(3, '0')}`;
    setCustomerForm({ ...initialFormState, id: autoId });
    setCopyAddress(false);
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setIsEditMode(true);
    setSelectedCustomer(cust);
    setCustomerForm({ ...cust });
    setCopyAddress(JSON.stringify(cust.billingAddress) === JSON.stringify(cust.shippingAddress));
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  const handleOpenView = (cust) => {
    setViewCustomer(cust);
    setActiveViewTab('general');
    setIsViewOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!customerForm.name.trim()) return;

    if (isEditMode) {
      setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...customerForm } : c));
    } else {
      setCustomers([...customers, { ...customerForm }]);
    }
    setIsModalOpen(false);
  };

  // Real CSV Export
  const handleExport = () => {
    const headers = ['Customer ID', 'Customer Name', 'Type', 'Category', 'Phone', 'Email', 'Active'];
    const rows = customers.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.type,
      c.category,
      c.phone,
      c.email,
      c.status ? 'Yes' : 'No'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Real CSV Import
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const newCustomers = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 6) {
            newCustomers.push({
              id: cols[0] || `CUST-NEW-${Date.now()}-${i}`,
              name: cols[1] || 'Imported Customer',
              type: cols[2] || 'Retailer',
              category: cols[3] || 'Regular',
              status: cols[6] === 'Yes' ? true : false,
              phone: cols[4] || '',
              email: cols[5] || '',
              billingAddress: { street: 'Imported', city: 'Imported', state: 'Imported', zip: '' },
              shippingAddress: { street: 'Imported', city: 'Imported', state: 'Imported', zip: '' },
              gstin: '',
              pan: '',
              bankName: '',
              bankAccount: '',
              bankIfsc: '',
              openingBalance: 0,
              balanceType: 'Dr',
              creditLimit: 100000,
              creditPeriod: 30,
              paymentTerms: 'Net 30',
              salesHistory: [],
              paymentHistory: [],
              salesReturnHistory: []
            });
          }
        }
        if (newCustomers.length > 0) {
          setCustomers(prev => [...prev, ...newCustomers]);
          alert(`Successfully imported ${newCustomers.length} customers!`);
        } else {
          alert("No valid data found in CSV. Headers should match: Customer ID, Customer Name, Type, Category, Phone, Email, Active");
        }
      } catch (err) {
        alert("Error parsing CSV file.");
      }
    };
    reader.readAsText(file);
    // Reset file input value so onChange triggers again for same file name
    e.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateDue = (cust) => {
    const totalSales = cust.salesHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalPaid = cust.paymentHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalReturned = cust.salesReturnHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const openingBal = cust.balanceType === 'Dr' ? cust.openingBalance : -cust.openingBalance;
    return openingBal + totalSales - totalPaid - totalReturned;
  };

  return (
    <div className="bg-white text-gray-900 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 min-h-screen">
      {/* Hidden File Input for CSV Import */}
      <input
        type="file"
        id="customer-csv-import"
        accept=".csv"
        className="hidden"
        onChange={handleImportCSV}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800">Customer Master</h1>
          <p className="text-xs sm:text-sm text-gray-500">Add, edit, view, delete and manage financial transactions of clients.</p>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto no-print">
          <button
            onClick={() => document.getElementById('customer-csv-import').click()}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] sm:text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            <Upload size={13} /> Import CSV
          </button>
          <button
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] sm:text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] sm:text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
          >
            <Printer size={13} /> Print / PDF
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[10px] sm:text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow transition-colors"
          >
            <Plus size={13} /> Add Customer
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 mb-6 bg-slate-50 p-3 sm:p-4 rounded-lg no-print">
        <div className="relative col-span-1 sm:col-span-2 md:col-span-2">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, Name or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border border-slate-300 rounded-md text-xs py-2 px-2 bg-white focus:outline-none"
          >
            <option value="">All Customer Types</option>
            <option value="Retailer">Retailer</option>
            <option value="Wholesaler">Wholesaler</option>
            <option value="Distributor">Distributor</option>
          </select>
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full border border-slate-300 rounded-md text-xs py-2 px-2 bg-white focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-slate-300 rounded-md text-xs py-2 px-2 bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 mb-4">
        <table className="w-full text-left border-collapse text-[10px] sm:text-xs md:text-sm">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-gray-700">
              <th className="p-2 sm:p-3">Customer ID</th>
              <th className="p-2 sm:p-3">Name</th>
              <th className="p-2 sm:p-3">Type</th>
              <th className="p-2 sm:p-3">Category</th>
              <th className="p-2 sm:p-3">Contact</th>
              <th className="p-2 sm:p-3 text-right">Balance (₹)</th>
              <th className="p-2 sm:p-3 text-center no-print">Status</th>
              <th className="p-2 sm:p-3 text-center no-print">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRecords.length > 0 ? (
              currentRecords.map((cust) => {
                const balance = calculateDue(cust);
                return (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 sm:p-3 font-semibold text-indigo-600">{cust.id}</td>
                    <td className="p-2 sm:p-3">
                      <div className="font-medium text-gray-900">{cust.name}</div>
                      <div className="text-[9px] sm:text-[10px] text-gray-500 break-all">{cust.email}</div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium bg-slate-100 text-slate-700">
                        {cust.type}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium ${
                        cust.category === 'VIP' ? 'bg-amber-100 text-amber-800' :
                        cust.category === 'Corporate' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {cust.category}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="text-[10px] sm:text-xs text-gray-800">{cust.phone}</div>
                      <div className="text-[9px] sm:text-[10px] text-gray-500">{cust.billingAddress.city}, {cust.billingAddress.state}</div>
                    </td>
                    <td className={`p-2 sm:p-3 text-right font-medium ${balance >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹ {Math.abs(balance).toLocaleString()} {balance >= 0 ? 'Dr' : 'Cr'}
                    </td>
                    <td className="p-2 sm:p-3 text-center no-print">
                      <button
                        onClick={() => handleToggleStatus(cust.id)}
                        className={`px-2 py-0.5 rounded-full font-semibold text-[9px] sm:text-[10px] transition-colors ${
                          cust.status ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {cust.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-2 sm:p-3 text-center no-print">
                      <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                        <button
                          onClick={() => handleOpenView(cust)}
                          className="p-1 text-indigo-600 hover:bg-blue-50 rounded"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(cust.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500 text-xs sm:text-sm">
                  No customers found. Click "Add Customer" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200 gap-2 no-print">
          <div>
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredCustomers.length)} of {filteredCustomers.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="py-1 px-3 bg-white border border-slate-300 rounded font-semibold">{currentPage}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col my-auto">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 flex justify-between items-center">
              <h2 className="text-sm sm:text-base font-bold">
                {isEditMode ? `Edit Customer (${customerForm.id})` : 'Add New Customer'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex bg-slate-100 border-b border-slate-200 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar">
              {[
                { id: 'basic', label: 'Basic Info', icon: User },
                { id: 'address', label: 'Contact & Address', icon: MapPin },
                { id: 'financial', label: 'Tax & Financial', icon: CreditCard }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id)}
                  className={`flex items-center gap-1.5 py-2.5 px-4 sm:px-6 border-b-2 transition-colors whitespace-nowrap ${
                    activeFormTab === tab.id
                      ? 'border-blue-600 text-indigo-600 bg-white'
                      : 'border-transparent text-gray-600 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs sm:text-sm">
              {activeFormTab === 'basic' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Customer Code *</label>
                    <input
                      type="text"
                      disabled
                      value={customerForm.id}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs sm:text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={customerForm.name}
                      onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                      className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Customer Type</label>
                    <select
                      value={customerForm.type}
                      onChange={(e) => setCustomerForm({ ...customerForm, type: e.target.value })}
                      className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm bg-white focus:outline-none"
                    >
                      <option value="Retailer">Retailer</option>
                      <option value="Wholesaler">Wholesaler</option>
                      <option value="Distributor">Distributor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Customer Category / Group</label>
                    <select
                      value={customerForm.category}
                      onChange={(e) => setCustomerForm({ ...customerForm, category: e.target.value })}
                      className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm bg-white focus:outline-none"
                    >
                      <option value="Regular">Regular</option>
                      <option value="VIP">VIP</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={customerForm.status}
                        onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.checked })}
                        className="rounded text-indigo-600 h-4 w-4"
                      />
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase">Customer Active Status</span>
                    </label>
                  </div>
                </div>
              )}

              {activeFormTab === 'address' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. contact@client.com"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Billing Address */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-xs sm:text-sm text-slate-800 mb-2 sm:mb-3 flex items-center gap-1.5">
                        <MapPin size={14} className="text-indigo-600" /> Billing Address
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <textarea
                          placeholder="Street Address"
                          rows="2"
                          value={customerForm.billingAddress.street}
                          onChange={(e) => setCustomerForm({
                            ...customerForm,
                            billingAddress: { ...customerForm.billingAddress, street: e.target.value }
                          })}
                          className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none bg-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={customerForm.billingAddress.city}
                            onChange={(e) => setCustomerForm({
                              ...customerForm,
                              billingAddress: { ...customerForm.billingAddress, city: e.target.value }
                            })}
                            className="border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none bg-white"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={customerForm.billingAddress.state}
                            onChange={(e) => setCustomerForm({
                              ...customerForm,
                              billingAddress: { ...customerForm.billingAddress, state: e.target.value }
                            })}
                            className="border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none bg-white"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={customerForm.billingAddress.zip}
                          onChange={(e) => setCustomerForm({
                            ...customerForm,
                            billingAddress: { ...customerForm.billingAddress, zip: e.target.value }
                          })}
                          className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                          <MapPin size={14} className="text-emerald-600" /> Shipping Address
                        </h4>
                        <label className="flex items-center gap-1 cursor-pointer text-[10px] sm:text-xs text-indigo-600 font-medium">
                          <input
                            type="checkbox"
                            checked={copyAddress}
                            onChange={handleCopyAddress}
                            className="rounded h-3 w-3"
                          />
                          Copy Billing
                        </label>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <textarea
                          placeholder="Street Address"
                          rows="2"
                          disabled={copyAddress}
                          value={copyAddress ? customerForm.billingAddress.street : customerForm.shippingAddress.street}
                          onChange={(e) => setCustomerForm({
                            ...customerForm,
                            shippingAddress: { ...customerForm.shippingAddress, street: e.target.value }
                          })}
                          className={`w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none ${copyAddress ? 'bg-slate-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            disabled={copyAddress}
                            value={copyAddress ? customerForm.billingAddress.city : customerForm.shippingAddress.city}
                            onChange={(e) => setCustomerForm({
                              ...customerForm,
                              shippingAddress: { ...customerForm.shippingAddress, city: e.target.value }
                            })}
                            className={`border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none ${copyAddress ? 'bg-slate-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                          />
                          <input
                            type="text"
                            placeholder="State"
                            disabled={copyAddress}
                            value={copyAddress ? customerForm.billingAddress.state : customerForm.shippingAddress.state}
                            onChange={(e) => setCustomerForm({
                              ...customerForm,
                              shippingAddress: { ...customerForm.shippingAddress, state: e.target.value }
                            })}
                            className={`border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none ${copyAddress ? 'bg-slate-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          disabled={copyAddress}
                          value={copyAddress ? customerForm.billingAddress.zip : customerForm.shippingAddress.zip}
                          onChange={(e) => setCustomerForm({
                            ...customerForm,
                            shippingAddress: { ...customerForm.shippingAddress, zip: e.target.value }
                          })}
                          className={`w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none ${copyAddress ? 'bg-slate-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFormTab === 'financial' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Tax Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 08AAAAA1111A1Z1"
                        value={customerForm.gstin}
                        onChange={(e) => setCustomerForm({ ...customerForm, gstin: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">PAN Number</label>
                      <input
                        type="text"
                        placeholder="e.g. AAAAA1111A"
                        value={customerForm.pan}
                        onChange={(e) => setCustomerForm({ ...customerForm, pan: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-800 mb-2 sm:mb-3 flex items-center gap-1.5">
                      <Building size={14} className="text-indigo-600" /> Bank Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <input
                          type="text"
                          placeholder="Bank Name"
                          value={customerForm.bankName}
                          onChange={(e) => setCustomerForm({ ...customerForm, bankName: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Account Number"
                          value={customerForm.bankAccount}
                          onChange={(e) => setCustomerForm({ ...customerForm, bankAccount: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="IFSC Code"
                          value={customerForm.bankIfsc}
                          onChange={(e) => setCustomerForm({ ...customerForm, bankIfsc: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Credit Parameters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Opening Balance (₹)</label>
                      <input
                        type="number"
                        value={customerForm.openingBalance}
                        onChange={(e) => setCustomerForm({ ...customerForm, openingBalance: Number(e.target.value) })}
                        className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Balance Type</label>
                      <select
                        value={customerForm.balanceType}
                        onChange={(e) => setCustomerForm({ ...customerForm, balanceType: e.target.value })}
                        className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm bg-white focus:outline-none"
                      >
                        <option value="Dr">Dr (Receivable)</option>
                        <option value="Cr">Cr (Payable)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Credit Limit (₹)</label>
                      <input
                        type="number"
                        value={customerForm.creditLimit}
                        onChange={(e) => setCustomerForm({ ...customerForm, creditLimit: Number(e.target.value) })}
                        className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Credit Period (Days)</label>
                      <input
                        type="number"
                        value={customerForm.creditPeriod}
                        onChange={(e) => setCustomerForm({ ...customerForm, creditPeriod: Number(e.target.value) })}
                        className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Payment Terms</label>
                    <select
                      value={customerForm.paymentTerms}
                      onChange={(e) => setCustomerForm({ ...customerForm, paymentTerms: e.target.value })}
                      className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm bg-white focus:outline-none"
                    >
                      <option value="Due on Receipt">Due on Receipt</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                    </select>
                  </div>
                </div>
              )}
            </form>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded text-xs sm:text-sm hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-slate-800 rounded text-xs sm:text-sm font-semibold transition-colors"
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS DRAWER */}
      {isViewOpen && viewCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <div className="bg-white w-full sm:max-w-xl md:max-w-3xl h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-3 sm:p-4 bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono font-semibold">
                  {viewCustomer.id}
                </span>
                <h2 className="text-sm sm:text-base font-bold mt-1">{viewCustomer.name}</h2>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex bg-slate-100 border-b border-slate-200 text-[10px] sm:text-xs font-semibold overflow-x-auto no-scrollbar">
              {[
                { id: 'general', label: 'General & Tax', icon: User },
                { id: 'sales', label: 'Sales History', icon: FileText },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'returns', label: 'Returns', icon: History },
                { id: 'ledger', label: 'Ledger Accounts', icon: DollarSign }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveViewTab(tab.id)}
                  className={`flex items-center gap-1 py-3 px-4 sm:px-5 border-b-2 flex-shrink-0 transition-colors whitespace-nowrap ${
                    activeViewTab === tab.id
                      ? 'border-blue-600 text-indigo-600 bg-white'
                      : 'border-transparent text-gray-600 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs sm:text-sm">
              {activeViewTab === 'general' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Basic Details Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[10px] sm:text-xs text-gray-500">Customer Type</span>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm">{viewCustomer.type}</p>
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs text-gray-500">Category Group</span>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm">{viewCustomer.category}</p>
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs text-gray-500">Phone Number</span>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm">{viewCustomer.phone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs text-gray-500">Email ID</span>
                      <p className="font-semibold text-gray-800 break-all text-xs sm:text-sm">{viewCustomer.email || '-'}</p>
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 sm:p-3 bg-red-50 rounded-lg text-center border border-red-100">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold text-red-500">Credit Limit</span>
                      <p className="font-bold text-gray-800 mt-1 text-[11px] sm:text-xs md:text-sm">₹ {viewCustomer.creditLimit.toLocaleString()}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-500">Credit Period</span>
                      <p className="font-bold text-gray-800 mt-1 text-[11px] sm:text-xs md:text-sm">{viewCustomer.creditPeriod} Days</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-500">Terms</span>
                      <p className="font-bold text-gray-800 mt-1 text-[11px] sm:text-xs md:text-sm">{viewCustomer.paymentTerms}</p>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-200 p-3 rounded-lg">
                      <h4 className="font-bold text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-2">Billing Address</h4>
                      <p className="text-gray-800 text-xs sm:text-sm">{viewCustomer.billingAddress.street}</p>
                      <p className="text-gray-800 text-xs sm:text-sm">{viewCustomer.billingAddress.city}, {viewCustomer.billingAddress.state}</p>
                      <p className="text-gray-600 text-[10px] sm:text-xs">PIN: {viewCustomer.billingAddress.zip}</p>
                    </div>
                    <div className="border border-slate-200 p-3 rounded-lg">
                      <h4 className="font-bold text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-2">Shipping Address</h4>
                      <p className="text-gray-800 text-xs sm:text-sm">{viewCustomer.shippingAddress.street}</p>
                      <p className="text-gray-800 text-xs sm:text-sm">{viewCustomer.shippingAddress.city}, {viewCustomer.shippingAddress.state}</p>
                      <p className="text-gray-600 text-[10px] sm:text-xs">PIN: {viewCustomer.shippingAddress.zip}</p>
                    </div>
                  </div>

                  {/* Tax & Banking Details */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 font-bold text-[10px] sm:text-xs text-slate-700 uppercase">
                      Tax & Banking Credentials
                    </div>
                    <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-[10px] sm:text-xs text-gray-500">GSTIN</span>
                        <p className="font-mono font-semibold text-gray-800 text-xs sm:text-sm">{viewCustomer.gstin || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-xs text-gray-500">PAN</span>
                        <p className="font-mono font-semibold text-gray-800 text-xs sm:text-sm">{viewCustomer.pan || 'N/A'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[10px] sm:text-xs text-gray-500">Bank Account details</span>
                        <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                          {viewCustomer.bankName ? `${viewCustomer.bankName} - A/C: ${viewCustomer.bankAccount} (IFSC: ${viewCustomer.bankIfsc})` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeViewTab === 'sales' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Customer Invoices (Sales Log)</h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-gray-700">
                          <th className="p-2 sm:p-3">Invoice No</th>
                          <th className="p-2 sm:p-3">Date</th>
                          <th className="p-2 sm:p-3 text-right">Amount (₹)</th>
                          <th className="p-2 sm:p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewCustomer.salesHistory?.length > 0 ? (
                          viewCustomer.salesHistory.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 sm:p-3 font-semibold text-slate-800">{item.invoiceNo}</td>
                              <td className="p-2 sm:p-3 text-gray-600">{item.date}</td>
                              <td className="p-2 sm:p-3 text-right font-medium">₹ {item.amount.toLocaleString()}</td>
                              <td className="p-2 sm:p-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
                                  item.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="p-6 text-center text-gray-500">No Sales Transactions Logged.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeViewTab === 'payments' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Receipts & Payment History</h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-gray-700">
                          <th className="p-2 sm:p-3">Receipt No</th>
                          <th className="p-2 sm:p-3">Date</th>
                          <th className="p-2 sm:p-3">Mode</th>
                          <th className="p-2 sm:p-3">Ref No</th>
                          <th className="p-2 sm:p-3 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewCustomer.paymentHistory?.length > 0 ? (
                          viewCustomer.paymentHistory.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 sm:p-3 font-semibold text-slate-800">{item.receiptNo}</td>
                              <td className="p-2 sm:p-3 text-gray-600">{item.date}</td>
                              <td className="p-2 sm:p-3 text-gray-800 font-medium">{item.mode}</td>
                              <td className="p-2 sm:p-3 font-mono text-gray-600">{item.refNo}</td>
                              <td className="p-2 sm:p-3 text-right font-bold text-emerald-600">₹ {item.amount.toLocaleString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="p-6 text-center text-gray-500">No Payments Recorded.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeViewTab === 'returns' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Sales Return Log (Credit Notes)</h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-gray-700">
                          <th className="p-2 sm:p-3">Credit Note No</th>
                          <th className="p-2 sm:p-3">Date</th>
                          <th className="p-2 sm:p-3">Reason</th>
                          <th className="p-2 sm:p-3 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewCustomer.salesReturnHistory?.length > 0 ? (
                          viewCustomer.salesReturnHistory.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 sm:p-3 font-semibold text-slate-800">{item.creditNoteNo}</td>
                              <td className="p-2 sm:p-3 text-gray-600">{item.date}</td>
                              <td className="p-2 sm:p-3 text-gray-700">{item.reason}</td>
                              <td className="p-2 sm:p-3 text-right font-bold text-rose-600">₹ {item.amount.toLocaleString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="p-6 text-center text-gray-500">No Sales Return History recorded.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeViewTab === 'ledger' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Customer Ledger Account</h4>
                    <span className="text-[10px] sm:text-xs bg-slate-100 border px-3 py-1 rounded font-semibold whitespace-nowrap">
                      Running Due: ₹ {Math.abs(calculateDue(viewCustomer)).toLocaleString()} {calculateDue(viewCustomer) >= 0 ? 'Dr' : 'Cr'}
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 font-semibold border-b">
                          <th className="p-2">Date</th>
                          <th className="p-2">Particulars</th>
                          <th className="p-2 text-right">Debit (Dr) (₹)</th>
                          <th className="p-2 text-right">Credit (Cr) (₹)</th>
                          <th className="p-2 text-right">Running Balance (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="bg-slate-50 font-medium">
                          <td className="p-2 text-gray-500">-</td>
                          <td className="p-2 text-gray-800 font-semibold">Opening Balance</td>
                          <td className="p-2 text-right">
                            {viewCustomer.balanceType === 'Dr' ? `₹ ${viewCustomer.openingBalance.toLocaleString()}` : '-'}
                          </td>
                          <td className="p-2 text-right">
                            {viewCustomer.balanceType === 'Cr' ? `₹ ${viewCustomer.openingBalance.toLocaleString()}` : '-'}
                          </td>
                          <td className="p-2 text-right">
                            ₹ {viewCustomer.openingBalance.toLocaleString()} {viewCustomer.balanceType}
                          </td>
                        </tr>

                        {(() => {
                          const postings = [];
                          viewCustomer.salesHistory?.forEach(s => {
                            postings.push({ date: s.date, particulars: `Invoice Sales: ${s.invoiceNo}`, dr: s.amount, cr: 0 });
                          });
                          viewCustomer.paymentHistory?.forEach(p => {
                            postings.push({ date: p.date, particulars: `Payment Recvd (${p.mode}): ${p.receiptNo}`, dr: 0, cr: p.amount });
                          });
                          viewCustomer.salesReturnHistory?.forEach(r => {
                            postings.push({ date: r.date, particulars: `Credit Note Return: ${r.creditNoteNo}`, dr: 0, cr: r.amount });
                          });

                          postings.sort((a,b) => new Date(a.date) - new Date(b.date));

                          let runningVal = viewCustomer.balanceType === 'Dr' ? viewCustomer.openingBalance : -viewCustomer.openingBalance;
                          
                          return postings.map((post, idx) => {
                            runningVal = runningVal + post.dr - post.cr;
                            const balType = runningVal >= 0 ? 'Dr' : 'Cr';
                            return (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-2 text-gray-600">{post.date}</td>
                                <td className="p-2 text-gray-800">{post.particulars}</td>
                                <td className="p-2 text-right text-rose-600 font-semibold">{post.dr > 0 ? `₹ ${post.dr.toLocaleString()}` : '-'}</td>
                                <td className="p-2 text-right text-emerald-600 font-semibold">{post.cr > 0 ? `₹ ${post.cr.toLocaleString()}` : '-'}</td>
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
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-5 py-2 bg-slate-50/50 shadow-inner border border-slate-200 text-white rounded text-xs font-semibold hover:bg-slate-800"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMaster;
