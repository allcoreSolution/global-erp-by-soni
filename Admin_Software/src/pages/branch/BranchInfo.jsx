import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, MapPin, Phone, Mail } from 'lucide-react';

const BranchInfo = () => {
  const [branches, setBranches] = useState([
    { id: 'BR-001', name: 'Jaipur HQ Office', code: 'JPHQ', type: 'Headquarters', address: 'IT Park, Phase 1, Jaipur, Rajasthan', phone: '0141-2233445', email: 'jaipur@company.com', gstin: '08AAAAA1111A1Z1' },
    { id: 'BR-002', name: 'Kota Regional Center', code: 'KT01', type: 'Regional Branch', address: 'Station Road, Kota, Rajasthan', phone: '0744-2244668', email: 'kota@company.com', gstin: '08BBBBB2222B2Z2' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBranch, setCurrentBranch] = useState({
    id: '', name: '', code: '', type: 'Retail Store', address: '', phone: '', email: '', gstin: ''
  });

  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setIsEdit(false);
    const nextId = `BR-${String(branches.length + 1).padStart(3, '0')}`;
    setCurrentBranch({ id: nextId, name: '', code: '', type: 'Retail Store', address: '', phone: '', email: '', gstin: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch) => {
    setIsEdit(true);
    setCurrentBranch({ ...branch });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      setBranches(branches.map(b => b.id === currentBranch.id ? { ...currentBranch } : b));
    } else {
      setBranches([...branches, { ...currentBranch }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete branch ${id}?`)) {
      setBranches(branches.filter(b => b.id !== id));
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Branch Information</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Configure corporate branch listings, physical addresses coordinates, and contact details.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} /> Add Branch
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

      {/* Table responsive */}
      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b font-semibold text-gray-700">
              <th className="p-2.5 sm:p-3">Code</th>
              <th className="p-2.5 sm:p-3">Branch Name</th>
              <th className="p-2.5 sm:p-3">Branch Type</th>
              <th className="p-2.5 sm:p-3">Contact</th>
              <th className="p-2.5 sm:p-3 font-mono">GSTIN</th>
              <th className="p-2.5 sm:p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-2.5 sm:p-3 font-semibold text-indigo-600 font-mono">{b.code}</td>
                <td className="p-2.5 sm:p-3">
                  <div className="font-medium text-gray-900">{b.name}</div>
                  <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10} />{b.address}</div>
                </td>
                <td className="p-2.5 sm:p-3 text-gray-650">{b.type}</td>
                <td className="p-2.5 sm:p-3">
                  <div>{b.phone}</div>
                  <div className="text-[10px] text-gray-400 break-all">{b.email}</div>
                </td>
                <td className="p-2.5 sm:p-3 font-mono text-gray-700">{b.gstin || '-'}</td>
                <td className="p-2.5 sm:p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => handleOpenEdit(b)} className="p-1 text-amber-600 hover:bg-amber-50 rounded">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
              <h3 className="font-bold text-xs sm:text-sm">{isEdit ? 'Edit Branch' : 'Add Branch'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Branch Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JPHQ"
                    value={currentBranch.code}
                    onChange={(e) => setCurrentBranch({ ...currentBranch, code: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Branch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur HQ"
                    value={currentBranch.name}
                    onChange={(e) => setCurrentBranch({ ...currentBranch, name: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Branch Type</label>
                  <select
                    value={currentBranch.type}
                    onChange={(e) => setCurrentBranch({ ...currentBranch, type: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="Regional Branch">Regional Branch</option>
                    <option value="Warehouse Store">Warehouse Store</option>
                    <option value="Retail Store">Retail Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="GSTIN"
                    value={currentBranch.gstin}
                    onChange={(e) => setCurrentBranch({ ...currentBranch, gstin: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3.5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={currentBranch.phone}
                    onChange={(e) => setCurrentBranch({ ...currentBranch, phone: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={currentBranch.email}
                    onChange={(e) => setCurrentBranch({ ...currentBranch, email: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Full Physical Address</label>
                <textarea
                  rows="2"
                  value={currentBranch.address}
                  onChange={(e) => setCurrentBranch({ ...currentBranch, address: e.target.value })}
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

export default BranchInfo;
