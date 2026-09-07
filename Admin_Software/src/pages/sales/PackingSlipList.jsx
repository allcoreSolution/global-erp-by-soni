import React, { useState } from 'react';
import { 
  Plus, Search, Download, FileText, Printer, Eye, Trash2, 
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle, EyeOff, LayoutGrid 
} from 'lucide-react';

const PackingSlipList = () => {
  // Empty data table setup as requested: "No data available in table"
  const [packingSlips, setPackingSlips] = useState([]);
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Column Visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    reference: true,
    saleReference: true,
    deliveryReference: true,
    productList: true,
    amount: true,
    status: true,
  });

  const [isColMenuOpen, setIsColMenuOpen] = useState(false);

  // Form State for create packing slip
  const [form, setForm] = useState({
    reference: '',
    saleReference: '',
    deliveryReference: '',
    productList: '',
    amount: '',
    status: 'Pending'
  });

  // Handle create challan/packing slip submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: packingSlips.length + 1,
      reference: form.reference || `PS-${Math.floor(100000 + Math.random() * 900000)}`,
      saleReference: form.saleReference || `SL-${Math.floor(100000 + Math.random() * 900000)}`,
      deliveryReference: form.deliveryReference || `DL-${Math.floor(100000 + Math.random() * 900000)}`,
      productList: form.productList || 'Sample Product Name',
      amount: Number(form.amount) || 0.00,
      status: form.status
    };
    setPackingSlips([...packingSlips, newRecord]);
    setIsAddModalOpen(false);
    // Reset Form
    setForm({
      reference: '',
      saleReference: '',
      deliveryReference: '',
      productList: '',
      amount: '',
      status: 'Pending'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this packing slip?")) {
      setPackingSlips(packingSlips.filter(p => p.id !== id));
    }
  };

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const handleExportCSV = () => {
    alert("Exporting Packing Slips list as CSV spreadsheet file!");
  };

  const handleDownloadPDF = () => {
    alert("Generating and downloading Packing Slips list PDF document...");
  };

  const handlePrint = () => {
    alert("Triggering browser print command layout for packing slips...");
  };

  // Filter
  const filteredSlips = packingSlips.filter(p => 
    p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.saleReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productList.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSlips.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSlips.length / recordsPerPage) || 1;

  return (
    <div className="min-h-screen bg-white text-black p-6 rounded-lg shadow-md border border-blue-500">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-blue-500 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Packing Slips</h1>
          <p className="text-sm text-gray-600">Overview of generated packing slips and challan references.</p>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Column Visibility Dropdown toggle */}
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

      {/* Table view grids */}
      <div className="overflow-x-auto border border-blue-500 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-blue-500">
              {visibleColumns.reference && <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Reference</th>}
              {visibleColumns.saleReference && <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Sale Reference</th>}
              {visibleColumns.deliveryReference && <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Delivery Reference</th>}
              {visibleColumns.productList && <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Product List</th>}
              {visibleColumns.amount && <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Amount</th>}
              {visibleColumns.status && <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Status</th>}
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 text-right w-24">Option</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-500 bg-white">
            {currentRecords.length > 0 ? (
              currentRecords.map((slip) => (
                <tr key={slip.id} className="hover:bg-gray-50/70 transition-colors">
                  {visibleColumns.reference && <td className="px-6 py-4 text-sm font-semibold text-gray-900">{slip.reference}</td>}
                  {visibleColumns.saleReference && <td className="px-6 py-4 text-sm text-gray-600">{slip.saleReference}</td>}
                  {visibleColumns.deliveryReference && <td className="px-6 py-4 text-sm text-gray-600">{slip.deliveryReference}</td>}
                  {visibleColumns.productList && <td className="px-6 py-4 text-sm text-gray-800 font-medium">{slip.productList}</td>}
                  {visibleColumns.amount && <td className="px-6 py-4 text-sm font-bold text-gray-900">${slip.amount.toFixed(2)}</td>}
                  {visibleColumns.status && (
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        {slip.status}
                      </span>
                    </td>
                  )}
                  {/* Actions options */}
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => alert(`View challan packing details: ${slip.reference}`)}
                        className="p-1.5 text-indigo-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(slip.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500 bg-white font-medium">
                  <div className="flex flex-col items-center gap-2 justify-center">
                    <AlertCircle size={24} className="text-gray-400" />
                    <span>No data available in table</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="text-xs font-semibold text-gray-600">
          Showing {filteredSlips.length > 0 ? indexOfFirstRecord + 1 : 0} to {Math.min(indexOfLastRecord, filteredSlips.length)} of {filteredSlips.length} entries
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
              Create Challan / Packing Slip
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Sale Reference No *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. SL-20260813-094"
                  value={form.saleReference}
                  onChange={(e) => setForm({ ...form, saleReference: e.target.value })}
                  className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Delivery Reference No</label>
                <input 
                  type="text"
                  placeholder="e.g. DL-20260813-094"
                  value={form.deliveryReference}
                  onChange={(e) => setForm({ ...form, deliveryReference: e.target.value })}
                  className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Product Details List *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 5x iPhone 15 Pro, 2x Dell XPS"
                  value={form.productList}
                  onChange={(e) => setForm({ ...form, productList: e.target.value })}
                  className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Challan Amount ($) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 500.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
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
                  Generate Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PackingSlipList;
