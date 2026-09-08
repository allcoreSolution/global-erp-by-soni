import React, { useState } from 'react';
import {
  Plus, Search, Download, Upload, FileText, Eye, Edit, Trash2,
  Check, X, ChevronLeft, ChevronRight, AlertCircle, XCircle
} from 'lucide-react';

const Brand = () => {
  // Mock Brand Data
  const [brands, setBrands] = useState([
    { id: 1, name: 'Apple', image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=80&fit=crop&q=60', status: true },
    { id: 2, name: 'Samsung', image: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=80&fit=crop&q=60', status: true },
    { id: 3, name: 'Dell', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=80&fit=crop&q=60', status: true },
    { id: 4, name: 'Logitech', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=80&fit=crop&q=60', status: false },
    { id: 5, name: 'Sony', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&fit=crop&q=60', status: true },
    { id: 6, name: 'HP', image: 'https://images.unsplash.com/photo-1589561084283-930aa223f5f3?w=80&fit=crop&q=60', status: true },
    { id: 7, name: 'Asus', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=80&fit=crop&q=60', status: false },
    { id: 8, name: 'Lenovo', image: 'https://images.unsplash.com/photo-1588702547919-26089e690eca?w=80&fit=crop&q=60', status: true },
  ]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Form State for Add / Edit
  const [isEditMode, setIsEditMode] = useState(false);
  const [brandForm, setBrandForm] = useState({ name: '', image: '', status: true });

  // Handle Search
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredBrands.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredBrands.length / recordsPerPage);

  // Toggle status
  const handleToggleStatus = (id) => {
    setBrands(brands.map(b => b.id === id ? { ...b, status: !b.status } : b));
  };

  // Add / Edit Action handlers
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setBrandForm({ name: '', image: '', status: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand) => {
    setIsEditMode(true);
    setSelectedBrand(brand);
    setBrandForm({ name: brand.name, image: brand.image, status: brand.status });
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (brand) => {
    setSelectedBrand(brand);
    setIsViewModalOpen(true);
  };

  const handleDeleteBrand = (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      setBrands(brands.filter(b => b.id !== id));
    }
  };

  // Form Submit (Add/Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return;

    const fallbackImage = 'https://images.unsplash.com/photo-1546074177-ffedd79d4943?w=80&fit=crop&q=60';

    if (isEditMode) {
      setBrands(brands.map(b => b.id === selectedBrand.id ? {
        ...b,
        name: brandForm.name,
        image: brandForm.image || b.image || fallbackImage,
        status: brandForm.status
      } : b));
    } else {
      const newBrand = {
        id: brands.length + 1,
        name: brandForm.name,
        image: brandForm.image || fallbackImage,
        status: brandForm.status
      };
      setBrands([...brands, newBrand]);
    }
    setIsModalOpen(false);
  };

  // Mock Export function
  const handleExport = () => {
    alert("Exporting Brand list successfully as Excel/CSV!");
  };

  // Mock Import function
  const handleImport = () => {
    const file = prompt("Import spreadsheet: Enter file name to mock import:");
    if (file) {
      alert(`Brands from file "${file}" imported successfully!`);
    }
  };

  // Mock Download PDF
  const handleDownloadPDF = () => {
    alert("Downloading Brand list PDF file...");
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 rounded-lg shadow-md border border-blue-500">

      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-blue-500 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Brands</h1>
          <p className="text-sm text-gray-600">Manage products manufacturer and brand catalogs.</p>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleImport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-blue-500 rounded hover:bg-blue-50 transition-colors"
          >
            <Upload size={14} /> Import Brand
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-blue-500 rounded hover:bg-gray-50 transition-colors"
          >
            <Download size={14} /> Export Brand
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            <FileText size={14} /> PDF
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow transition-colors"
          >
            <Plus size={14} /> Add New Brand
          </button>
        </div>
      </div>

      {/* Filter and Limit Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Records per page:</span>
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-blue-500 rounded px-2.5 py-1 text-sm bg-white outline-none focus:border-blue-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Brand..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-blue-500 rounded pl-9 pr-3 py-1.5 text-sm bg-white text-black outline-none focus:border-blue-450 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Brands Table View */}
      <div className="overflow-x-auto border border-blue-500 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-blue-500">
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Image</th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Brand</th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700">Status</th>
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-500 bg-white">
            {currentRecords.length > 0 ? (
              currentRecords.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50/70 transition-colors">
                  {/* Brand Image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-10 h-10 object-contain rounded border border-blue-500 bg-gray-50"
                    />
                  </td>
                  {/* Brand Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {brand.name}
                  </td>
                  {/* Status Indicator Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${brand.status
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {brand.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* Actions (Toggle Status, View, Edit, Delete) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="inline-flex items-center gap-1.5">

                      {/* Toggle Status Button inside Action column */}
                      <button
                        onClick={() => handleToggleStatus(brand.id)}
                        className={`p-1.5 rounded transition-colors ${brand.status
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                          }`}
                        title={brand.status ? 'Deactivate Brand' : 'Activate Brand'}
                      >
                        {brand.status ? <Check size={16} /> : <XCircle size={16} />}
                      </button>

                      {/* View Action */}
                      <button
                        onClick={() => handleOpenViewModal(brand)}
                        className="p-1.5 text-indigo-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit Action */}
                      <button
                        onClick={() => handleOpenEditModal(brand)}
                        className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors"
                        title="Edit Brand"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Delete Brand"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center gap-2 justify-center">
                    <AlertCircle size={24} className="text-gray-400" />
                    <span>No brands found matching your search.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredBrands.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-xs font-semibold text-gray-600">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredBrands.length)} of {filteredBrands.length} records
          </div>

          <div className="inline-flex items-center border border-blue-500 rounded divide-x divide-blue-500 shadow-sm bg-white">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 text-gray-600 transition-colors ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3.5 py-1.5 text-xs font-bold transition-colors ${currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 text-gray-600 transition-colors ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT BRAND DIALOG MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg border border-blue-500 shadow-2xl max-w-md w-full p-6 relative text-black animate-in fade-in zoom-in-95 duration-200">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-blue-500 pb-2">
              {isEditMode ? 'Edit Brand Info' : 'Create New Brand'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Logitech"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">Brand Image Link</label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={brandForm.image}
                  onChange={(e) => setBrandForm({ ...brandForm, image: e.target.value })}
                  className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-black bg-white outline-none focus:border-blue-450 placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="modal-status"
                  checked={brandForm.status}
                  onChange={(e) => setBrandForm({ ...brandForm, status: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-650 bg-white border-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="modal-status" className="text-sm font-semibold text-gray-800 cursor-pointer">Set Brand as Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-blue-500">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-blue-500 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-slate-800 rounded text-sm font-semibold shadow transition-colors"
                >
                  {isEditMode ? 'Save Changes' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW BRAND DETAILS DIALOG MODAL --- */}
      {isViewModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg border border-blue-500 shadow-2xl max-w-md w-full p-6 relative text-black animate-in fade-in zoom-in-95 duration-200">

            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-blue-500 pb-2">
              Brand Overview Details
            </h3>

            <div className="flex flex-col items-center gap-4 py-4">
              <img
                src={selectedBrand.image}
                alt={selectedBrand.name}
                className="w-24 h-24 object-contain rounded border border-blue-500 p-2 bg-gray-50"
              />
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-900">{selectedBrand.name}</h4>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${selectedBrand.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {selectedBrand.status ? 'Operational Active' : 'Deactivated / Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-blue-500">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-slate-800 rounded text-sm font-semibold transition-colors"
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

export default Brand;
