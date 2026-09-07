import React, { useState } from 'react';
import { 
  Calendar, Search, Download, FileText, Printer, Eye, Trash2, 
  ChevronLeft, ChevronRight, AlertCircle, LayoutGrid, X, Filter, Plus 
} from 'lucide-react';

const ChallanList = () => {
  // Empty data table setup as requested: "No data available in table"
  const [challans, setChallans] = useState([]);

  // States
  const [selectedCourier, setSelectedCourier] = useState('All Courier');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Column Visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    referenceNo: true,
    orderNo: true,
    courier: true,
    status: true,
    closingDate: true,
    totalAmount: true,
    createdBy: true,
    closedBy: true,
  });

  const [isColMenuOpen, setIsColMenuOpen] = useState(false);

  // Form State for Add Challan
  const [form, setForm] = useState({
    date: '2026-08-13',
    referenceNo: '',
    orderNo: '',
    courier: 'DHL Logistics',
    status: 'Pending',
    closingDate: '-',
    totalAmount: '',
    createdBy: 'mummakidz',
    closedBy: '-'
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: challans.length + 1,
      date: form.date,
      referenceNo: form.referenceNo || `CH-${Math.floor(100000 + Math.random() * 900000)}`,
      orderNo: form.orderNo || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      courier: form.courier,
      status: form.status,
      closingDate: form.closingDate,
      totalAmount: Number(form.totalAmount) || 0.00,
      createdBy: form.createdBy,
      closedBy: form.closedBy
    };
    setChallans([...challans, newRecord]);
    setIsAddModalOpen(false);
    // Reset Form
    setForm({
      date: '2026-08-13',
      referenceNo: '',
      orderNo: '',
      courier: 'DHL Logistics',
      status: 'Pending',
      closingDate: '-',
      totalAmount: '',
      createdBy: 'mummakidz',
      closedBy: '-'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Challan record?")) {
      setChallans(challans.filter(c => c.id !== id));
    }
  };

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const handleExportCSV = () => {
    alert("Exporting Challan list as CSV spreadsheet!");
  };

  const handleDownloadPDF = () => {
    alert("Generating and downloading Challans list PDF file...");
  };

  const handlePrint = () => {
    alert("Triggering browser print commands layout for Challans...");
  };

  // Search and status filters
  const filteredChallans = challans.filter(c => {
    const matchesSearch = c.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.courier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourier = selectedCourier === 'All Courier' || c.courier === selectedCourier;
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    
    return matchesSearch && matchesCourier && matchesStatus;
  });

  // Pagination calculation
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredChallans.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredChallans.length / recordsPerPage) || 1;

  const totalAmountSum = filteredChallans.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="min-h-screen bg-white text-black p-6 rounded-lg shadow-md border border-blue-500">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-blue-500 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Challan List</h1>
          <p className="text-sm text-gray-600">Track and manage inventory courier delivery challans logs.</p>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Column Visibility Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsColMenuOpen(!isColMenuOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-blue-500 rounded hover:bg-gray-50 bg-white transition-colors"
            >
              <LayoutGrid size={14} /> Column Visibility
            </button>
            
            {isColMenuOpen && (
              <div className="absolute right-0 z-15 mt-1.5 w-52 bg-white border border-blue-500 rounded shadow-xl p-2.5 space-y-1.5 text-xs text-gray-800">
                <p className="font-bold border-b border-blue-500/20 pb-1 text-gray-500 uppercase tracking-wider text-[9px]">Toggle Columns</p>
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded font-medium">
                    <input 
                      type="checkbox" 
                      checked={visibleColumns[col]} 
                      onChange={() => toggleColumn(col)}
                      className="rounded text-indigo-600 border-blue-500 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-blue-500 rounded hover:bg-gray-50 transition-colors"
          >
            <Download size={14} /> CSV
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-blue-500 rounded hover:bg-gray-50 transition-colors"
          >
            <FileText size={14} /> PDF
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-blue-500 rounded hover:bg-gray-50 transition-colors"
          >
            <Printer size={14} /> Print
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow transition-colors"
          >
            <Plus size={14} /> Create Challan
          </button>
        </div>
      </div>

      {/* Filter Options Controls Form Header */}
      <div className="bg-gray-50 border border-blue-500 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Courier Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Courier</label>
          <select 
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="w-full border border-blue-500 rounded px-2.5 py-1.5 text-xs bg-white text-black outline-none focus:border-blue-400"
          >
            <option value="All Courier">All Courier</option>
            <option value="DHL Logistics">DHL Logistics</option>
            <option value="FedEx Express">FedEx Express</option>
            <option value="Blue Dart">Blue Dart</option>
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Status</label>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-blue-500 rounded px-2.5 py-1.5 text-xs bg-white text-black outline-none focus:border-blue-400"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Submit query */}
        <div>
          <button 
            type="button"
            onClick={() => alert(`Filtering Challans for ${selectedCourier} and status ${selectedStatus}`)}
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-slate-800 rounded text-xs font-bold transition-colors shadow"
          >
            Submit Filter
          </button>
        </div>
      </div>

      {/* Filter and Limit Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Show</span>
          <select 
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-blue-500 rounded px-2.5 py-1 text-sm bg-white outline-none focus:border-blue-450 font-bold"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">Search:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-blue-500 rounded pl-16 pr-3 py-1.5 text-sm bg-white text-black outline-none focus:border-blue-450 font-medium"
          />
        </div>
      </div>

      {/* Table view log grid */}
      <div className="overflow-x-auto border border-blue-500 rounded-lg">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50 border-b border-blue-500">
              {visibleColumns.date && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Date</th>}
              {visibleColumns.referenceNo && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Reference No</th>}
              {visibleColumns.orderNo && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Order No</th>}
              {visibleColumns.courier && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Courier</th>}
              {visibleColumns.status && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Status</th>}
              {visibleColumns.closingDate && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Closing Date</th>}
              {visibleColumns.totalAmount && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Total Amount</th>}
              {visibleColumns.createdBy && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Created By</th>}
              {visibleColumns.closedBy && <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700">Closed By</th>}
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 text-right w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-500 bg-white">
            {currentRecords.length > 0 ? (
              currentRecords.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                  {visibleColumns.date && <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">{c.date}</td>}
                  {visibleColumns.referenceNo && <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{c.referenceNo}</td>}
                  {visibleColumns.orderNo && <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{c.orderNo}</td>}
                  {visibleColumns.courier && <td className="px-4 py-3 text-sm text-gray-800">{c.courier}</td>}
                  
                  {visibleColumns.status && (
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      <span className="inline-flex px-2.5 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        {c.status}
                      </span>
                    </td>
                  )}

                  {visibleColumns.closingDate && <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">{c.closingDate}</td>}
                  {visibleColumns.totalAmount && <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">${c.totalAmount.toFixed(2)}</td>}
                  {visibleColumns.createdBy && <td className="px-4 py-3 text-sm text-gray-600">{c.createdBy}</td>}
                  {visibleColumns.closedBy && <td className="px-4 py-3 text-sm text-gray-600 text-center">{c.closedBy}</td>}
                  
                  {/* Action buttons */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => alert(`View details: ${c.referenceNo}`)}
                        className="p-1.5 text-indigo-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="View Challan details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-12 text-center text-sm text-gray-500 bg-white font-medium">
                  <div className="flex flex-col items-center gap-2 justify-center">
                    <AlertCircle size={24} className="text-gray-400" />
                    <span>No data available in table</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Total Row */}
            <tr className="bg-gray-50/90 font-bold border-t border-blue-500">
              <td colSpan={visibleColumns.date ? 1 : 0}>Total</td>
              {visibleColumns.referenceNo && <td></td>}
              {visibleColumns.orderNo && <td></td>}
              {visibleColumns.courier && <td></td>}
              {visibleColumns.status && <td></td>}
              {visibleColumns.closingDate && <td></td>}
              {visibleColumns.totalAmount && <td className="px-4 py-3.5 text-sm font-black text-gray-900">${totalAmountSum.toFixed(2)}</td>}
              {visibleColumns.createdBy && <td></td>}
              {visibleColumns.closedBy && <td></td>}
              <td className="px-4 py-3.5"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="text-xs font-semibold text-gray-600">
          Showing {filteredChallans.length > 0 ? indexOfFirstRecord + 1 : 0} to {Math.min(indexOfLastRecord, filteredChallans.length)} of {filteredChallans.length} entries
        </div>

        <div className="inline-flex items-center border border-blue-500 rounded divide-x divide-blue-500 shadow-sm bg-white">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 text-gray-600 transition-colors ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 text-gray-600 transition-colors ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* --- CREATE CHALLAN MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg border border-blue-500 shadow-2xl max-w-md w-full p-6 relative text-black animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-blue-500 pb-2">
              Log Courier Challan Record
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Challan Date *</label>
                <input 
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Order No *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. ORD-980382"
                    value={form.orderNo}
                    onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
                    className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Courier Partner *</label>
                  <select
                    value={form.courier}
                    onChange={(e) => setForm({ ...form, courier: e.target.value })}
                    className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                  >
                    <option value="DHL Logistics">DHL Logistics</option>
                    <option value="FedEx Express">FedEx Express</option>
                    <option value="Blue Dart">Blue Dart</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Total Amount ($) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 150.00"
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-blue-500">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-blue-500 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-slate-800 rounded text-sm font-semibold shadow transition-colors"
                >
                  Create Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChallanList;
