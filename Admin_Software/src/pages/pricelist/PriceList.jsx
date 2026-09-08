import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Search, X, Download, Upload, Printer } from 'lucide-react';

const PriceList = () => {
  const [priceLists, setPriceLists] = useState([
    { id: 'PL-001', name: 'VIP Customer Pricing', customerType: 'Wholesaler', status: true },
    { id: 'PL-002', name: 'Regular Retail Slab', customerType: 'Retailer', status: true },
    { id: 'PL-003', name: 'Corporate Special Tier', customerType: 'Distributor', status: false }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPL, setCurrentPL] = useState({ id: '', name: '', customerType: 'Retailer', status: true });

  const filtered = priceLists.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete price list ${id}?`)) {
      setPriceLists(priceLists.filter(p => p.id !== id));
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    const nextId = `PL-${String(priceLists.length + 1).padStart(3, '0')}`;
    setCurrentPL({ id: nextId, name: '', customerType: 'Retailer', status: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pl) => {
    setIsEditMode(true);
    setCurrentPL({ ...pl });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setPriceLists(priceLists.map(p => p.id === currentPL.id ? { ...currentPL } : p));
    } else {
      setPriceLists([...priceLists, { ...currentPL }]);
    }
    setIsModalOpen(false);
  };

  // Real CSV Export
  const handleExportCSV = () => {
    const headers = ['Price List Code', 'Price List Name', 'Customer Type', 'Active'];
    const rows = priceLists.map(pl => [
      pl.id,
      `"${pl.name.replace(/"/g, '""')}"`,
      pl.customerType,
      pl.status ? 'Yes' : 'No'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pricelists_export_${new Date().toISOString().slice(0, 10)}.csv`);
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
        const newPLs = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 3) {
            newPLs.push({
              id: cols[0] || `PL-NEW-${Date.now()}-${i}`,
              name: cols[1] || 'Imported Slab',
              customerType: cols[2] || 'Retailer',
              status: cols[3] === 'Yes' ? true : false
            });
          }
        }
        if (newPLs.length > 0) {
          setPriceLists(prev => [...prev, ...newPLs]);
          alert(`Successfully imported ${newPLs.length} price lists!`);
        } else {
          alert("Import failed. Headers should match: Price List Code, Price List Name, Customer Type, Active");
        }
      } catch (err) {
        alert("Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen">
      <input
        type="file"
        id="pricelist-csv-file"
        accept=".csv"
        className="hidden"
        onChange={handleImportCSV}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Price List Master</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Create pricing levels, set up standard discount slabs, and configure wholesales catalogs.</p>
        </div>
        
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto no-print">
          <button
            onClick={() => document.getElementById('pricelist-csv-file').click()}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] sm:text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            <Upload size={13} /> Import CSV
          </button>
          <button
            onClick={handleExportCSV}
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
            <Plus size={13} /> Add Price List
          </button>
        </div>
      </div>

      {/* Filter search */}
      <div className="relative mb-4 w-full max-w-sm no-print">
        <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by ID, Name or Customer Type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Table responsive */}
      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b font-semibold text-gray-700">
              <th className="p-2.5 sm:p-3">Price List Code</th>
              <th className="p-2.5 sm:p-3">Price List Name</th>
              <th className="p-2.5 sm:p-3">Customer Type</th>
              <th className="p-2.5 sm:p-3 text-center no-print">Status</th>
              <th className="p-2.5 sm:p-3 text-center no-print">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(pl => (
              <tr key={pl.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-2.5 sm:p-3 font-semibold text-indigo-600 font-mono">{pl.id}</td>
                <td className="p-2.5 sm:p-3 font-medium text-gray-900">{pl.name}</td>
                <td className="p-2.5 sm:p-3 text-gray-600">{pl.customerType}</td>
                <td className="p-2.5 sm:p-3 text-center no-print">
                  <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${pl.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {pl.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-2.5 sm:p-3 text-center no-print">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => handleOpenEdit(pl)} className="p-1 text-amber-600 hover:bg-amber-50 rounded">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(pl.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 overflow-y-auto no-print">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl border my-auto">
            <div className="bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 p-3.5 flex justify-between items-center">
              <h3 className="font-bold text-xs sm:text-sm">{isEditMode ? 'Edit Price List' : 'Add Price List'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Price List Code</label>
                <input type="text" disabled value={currentPL.id} className="w-full bg-slate-50 border p-2 rounded text-gray-500 text-xs cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Price List Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Wholesaler Slab"
                  value={currentPL.name}
                  onChange={(e) => setCurrentPL({ ...currentPL, name: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Target Customer Type</label>
                <select
                  value={currentPL.customerType}
                  onChange={(e) => setCurrentPL({ ...currentPL, customerType: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
                >
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={currentPL.status}
                    onChange={(e) => setCurrentPL({ ...currentPL, status: e.target.checked })}
                    className="rounded text-indigo-600 h-4 w-4"
                  />
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase">Active Status</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 border rounded hover:bg-slate-50 text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 text-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceList;
