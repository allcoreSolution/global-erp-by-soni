import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

const TaxConfig = () => {
  const [taxes, setTaxes] = useState([
    { id: 'TX-001', name: 'Standard GST 18%', type: 'GST', rate: 18, cgst: 9, sgst: 9, igst: 18, cess: 0, inclusive: false },
    { id: 'TX-002', name: 'Super Luxury Slab 28%', type: 'GST', rate: 28, cgst: 14, sgst: 14, igst: 28, cess: 12, inclusive: false }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentTax, setCurrentTax] = useState({
    id: '', name: '', type: 'GST', rate: 18, cgst: 9, sgst: 9, igst: 18, cess: 0, inclusive: false
  });

  const filtered = taxes.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setIsEdit(false);
    const nextId = `TX-${String(taxes.length + 1).padStart(3, '0')}`;
    setCurrentTax({ id: nextId, name: '', type: 'GST', rate: 18, cgst: 9, sgst: 9, igst: 18, cess: 0, inclusive: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tax) => {
    setIsEdit(true);
    setCurrentTax({ ...tax });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      setTaxes(taxes.map(t => t.id === currentTax.id ? { ...currentTax } : t));
    } else {
      setTaxes([...taxes, { ...currentTax }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete tax slab ${id}?`)) {
      setTaxes(taxes.filter(t => t.id !== id));
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Tax Configurations</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Configure corporate SGST, CGST, IGST ratios, cess percentages, and inclusive/exclusive parameter flags.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} /> Add Tax Slab
        </button>
      </div>

      <div className="relative mb-4 w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Code or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Responsive table */}
      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b font-semibold text-gray-700">
              <th className="p-2.5 sm:p-3">Code</th>
              <th className="p-2.5 sm:p-3">Tax Slab Name</th>
              <th className="p-2.5 sm:p-3">GST %</th>
              <th className="p-2.5 sm:p-3">CGST / SGST / IGST</th>
              <th className="p-2.5 sm:p-3">Cess %</th>
              <th className="p-2.5 sm:p-3">Pricing Type</th>
              <th className="p-2.5 sm:p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(tax => (
              <tr key={tax.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-2.5 sm:p-3 font-semibold text-indigo-600 font-mono">{tax.id}</td>
                <td className="p-2.5 sm:p-3 font-medium text-gray-900">{tax.name}</td>
                <td className="p-2.5 sm:p-3 font-semibold">{tax.rate}%</td>
                <td className="p-2.5 sm:p-3 text-gray-500">C: {tax.cgst}% | S: {tax.sgst}% | I: {tax.igst}%</td>
                <td className="p-2.5 sm:p-3 text-gray-600">{tax.cess}%</td>
                <td className="p-2.5 sm:p-3 text-gray-600">{tax.inclusive ? 'Inclusive' : 'Exclusive'}</td>
                <td className="p-2.5 sm:p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => handleOpenEdit(tax)} className="p-1 text-amber-600 hover:bg-amber-50 rounded">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(tax.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-xl border my-auto">
            <div className="bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 p-3.5 flex justify-between items-center">
              <h3 className="font-bold text-xs sm:text-sm">{isEdit ? 'Edit Tax Slab' : 'Add Tax Slab'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Tax Code</label>
                  <input type="text" disabled value={currentTax.id} className="w-full bg-slate-50 border p-2 rounded text-gray-500 text-xs cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Tax Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard GST 18%"
                    value={currentTax.name}
                    onChange={(e) => setCurrentTax({ ...currentTax, name: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">GST Rate % *</label>
                  <input
                    type="number"
                    required
                    value={currentTax.rate}
                    onChange={(e) => {
                      const r = Number(e.target.value);
                      const half = r / 2;
                      setCurrentTax({ ...currentTax, rate: r, cgst: half, sgst: half, igst: r });
                    }}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Cess Rate %</label>
                  <input
                    type="number"
                    value={currentTax.cess}
                    onChange={(e) => setCurrentTax({ ...currentTax, cess: Number(e.target.value) })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-gray-400">CGST (Auto)</span>
                  <p className="font-bold text-gray-800">{currentTax.cgst}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400">SGST (Auto)</span>
                  <p className="font-bold text-gray-800">{currentTax.sgst}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400">IGST (Auto)</span>
                  <p className="font-bold text-gray-800">{currentTax.igst}%</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={currentTax.inclusive}
                    onChange={(e) => setCurrentTax({ ...currentTax, inclusive: e.target.checked })}
                    className="rounded text-indigo-600 h-4 w-4"
                  />
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase">Inclusive of pricing</span>
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

export default TaxConfig;
