import React, { useState } from 'react';
import { Tag, ShieldAlert, Edit, Trash2, Search, Plus, X } from 'lucide-react';

const TaxMapping = () => {
  const [mappings, setMappings] = useState([
    { id: 'TM-001', hsn: '7214', category: 'Steel Items', salesTax: 'Standard GST 18%', purchaseTax: 'Standard GST 18%', exemption: 'No Exemption' },
    { id: 'TM-002', hsn: '7306', category: 'Pipes & Fittings', salesTax: 'Standard GST 18%', purchaseTax: 'Standard GST 18%', exemption: 'No Exemption' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMap, setCurrentMap] = useState({ id: '', hsn: '', category: 'Steel Items', salesTax: 'Standard GST 18%', purchaseTax: 'Standard GST 18%', exemption: 'No Exemption' });
  const [isEdit, setIsEdit] = useState(false);

  const handleOpenAdd = () => {
    setIsEdit(false);
    const nextId = `TM-${String(mappings.length + 1).padStart(3, '0')}`;
    setCurrentMap({ id: nextId, hsn: '', category: 'Steel Items', salesTax: 'Standard GST 18%', purchaseTax: 'Standard GST 18%', exemption: 'No Exemption' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (map) => {
    setIsEdit(true);
    setCurrentMap({ ...map });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      setMappings(mappings.map(m => m.id === currentMap.id ? { ...currentMap } : m));
    } else {
      setMappings([...mappings, { ...currentMap }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete tax mapping ${id}?`)) {
      setMappings(mappings.filter(m => m.id !== id));
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">HSN / SAC Tax Mapping</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Bind standard purchase/sales tax slabs with product HSN/SAC codes and tax exemption categories.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} /> Add HSN Map
        </button>
      </div>

      {/* Grid mappings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        {mappings.map(m => (
          <div key={m.id} className="bg-slate-50 border rounded-lg p-4 space-y-2 relative">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-indigo-600 font-mono">HSN Code: {m.hsn}</span>
              <div className="flex gap-1.5">
                <button onClick={() => handleOpenEdit(m)} className="p-1 hover:bg-slate-200 rounded text-amber-600">
                  <Edit size={13} />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-1 hover:bg-red-50 rounded text-red-600">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="space-y-1 text-[11px] sm:text-xs">
              <p><span className="text-gray-500">Mapping Code:</span> <strong className="text-gray-800">{m.id}</strong></p>
              <p><span className="text-gray-500">Tax Category:</span> <strong className="text-gray-800">{m.category}</strong></p>
              <p><span className="text-gray-500">Sales Tax:</span> <strong className="text-gray-900 text-indigo-600">{m.salesTax}</strong></p>
              <p><span className="text-gray-500">Purchase Tax:</span> <strong className="text-gray-900 text-emerald-600">{m.purchaseTax}</strong></p>
              <p><span className="text-gray-500">Exemption:</span> <strong className="text-gray-800">{m.exemption}</strong></p>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl border my-auto">
            <div className="bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 p-3.5 flex justify-between items-center">
              <h3 className="font-bold text-xs sm:text-sm">{isEdit ? 'Edit HSN Map' : 'Add HSN Map'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Mapping ID</label>
                <input type="text" disabled value={currentMap.id} className="w-full bg-slate-50 border p-2 rounded text-gray-500 text-xs cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">HSN / SAC Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7214"
                  value={currentMap.hsn}
                  onChange={(e) => setCurrentMap({ ...currentMap, hsn: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Tax Category</label>
                <input
                  type="text"
                  value={currentMap.category}
                  onChange={(e) => setCurrentMap({ ...currentMap, category: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Sales Tax Slab</label>
                  <select
                    value={currentMap.salesTax}
                    onChange={(e) => setCurrentMap({ ...currentMap, salesTax: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
                  >
                    <option value="Standard GST 18%">Standard GST 18%</option>
                    <option value="Super Luxury Slab 28%">Super Luxury Slab 28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Purchase Tax Slab</label>
                  <select
                    value={currentMap.purchaseTax}
                    onChange={(e) => setCurrentMap({ ...currentMap, purchaseTax: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
                  >
                    <option value="Standard GST 18%">Standard GST 18%</option>
                    <option value="Super Luxury Slab 28%">Super Luxury Slab 28%</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Tax Exemption Reason</label>
                <input
                  type="text"
                  placeholder="e.g. SEZ Exemption"
                  value={currentMap.exemption}
                  onChange={(e) => setCurrentMap({ ...currentMap, exemption: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none text-xs"
                />
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

export default TaxMapping;
