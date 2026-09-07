import React, { useState } from 'react';
import { Landmark, Plus, Trash2, X, Percent, Wallet, FileText, ArrowRight } from 'lucide-react';

const SalaryStructure = () => {
  const [structures, setStructures] = useState([
    { id: 'SAL-01', name: 'Executive Standard', basic: 15000, hra: 6000, da: 3000, allowance: 4000, pf: 1800, esi: 500, ctc: 28000 },
    { id: 'SAL-02', name: 'Senior Managerial', basic: 45000, hra: 18000, da: 9000, allowance: 12000, pf: 5400, esi: 0, ctc: 84000 },
    { id: 'SAL-03', name: 'Technical Lead', basic: 60000, hra: 24000, da: 12000, allowance: 15000, pf: 7200, esi: 0, ctc: 111000 },
    { id: 'SAL-04', name: 'Support Associate', basic: 12000, hra: 4800, da: 2400, allowance: 3000, pf: 1440, esi: 400, ctc: 22200 }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStruct, setNewStruct] = useState({
    name: '',
    basic: '',
    hra: '',
    da: '',
    allowance: '',
    pf: '',
    esi: ''
  });

  const handleAddStructure = (e) => {
    e.preventDefault();
    if (!newStruct.name || !newStruct.basic) {
      alert("Name and Basic salary are required!");
      return;
    }
    const nextId = `SAL-${String(structures.length + 1).padStart(2, '0')}`;
    const basic = Number(newStruct.basic);
    const hra = Number(newStruct.hra) || Math.round(basic * 0.4); // 40% HRA fallback
    const da = Number(newStruct.da) || Math.round(basic * 0.2); // 20% DA fallback
    const allowance = Number(newStruct.allowance) || 0;
    const pf = Number(newStruct.pf) || Math.round(basic * 0.12); // 12% PF fallback
    const esi = Number(newStruct.esi) || 0;
    const ctc = basic + hra + da + allowance + pf + esi;

    const added = {
      id: nextId,
      name: newStruct.name,
      basic,
      hra,
      da,
      allowance,
      pf,
      esi,
      ctc
    };

    setStructures([...structures, added]);
    setShowAddModal(false);
    setNewStruct({ name: '', basic: '', hra: '', da: '', allowance: '', pf: '', esi: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this salary structure?")) {
      setStructures(structures.filter(s => s.id !== id));
    }
  };

  const getNetSalary = (s) => {
    return s.basic + s.hra + s.da + s.allowance - (s.pf + s.esi);
  };

  const stats = {
    total: structures.length,
    avgCtc: Math.round(structures.reduce((acc, s) => acc + s.ctc, 0) / (structures.length || 1)),
    maxCtc: Math.max(...structures.map(s => s.ctc)),
    minCtc: Math.min(...structures.map(s => s.ctc))
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200/70 shadow-sm min-h-screen space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Landmark className="text-indigo-600" size={24} /> Salary Structure Configurator
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500">
            Define structural payroll heads (Basic, HRA, DA, Allowances, PF & ESI contributions) for automatic ledger computations.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 no-print">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
          >
            <Plus size={14} /> Define New Structure
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-50 dark:bg-slate-50/50 shadow-inner border border-slate-200 border dark:border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase">Defined Rules</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-700 mt-1">{stats.total}</div>
          </div>
          <div className="bg-blue-100 text-indigo-600 p-2.5 rounded-lg">
            <FileText size={18} />
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-emerald-700 uppercase">Average Monthly CTC</div>
            <div className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mt-1">₹{stats.avgCtc.toLocaleString()}</div>
          </div>
          <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-lg">
            <Wallet size={18} />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-purple-700 uppercase">Highest Scale (CTC)</div>
            <div className="text-xl font-bold text-purple-800 dark:text-purple-400 mt-1">₹{stats.maxCtc.toLocaleString()}</div>
          </div>
          <div className="bg-purple-100 text-purple-600 p-2.5 rounded-lg">
            <ArrowRight size={18} className="-rotate-45" />
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-amber-700 uppercase">Lowest Scale (CTC)</div>
            <div className="text-xl font-bold text-amber-800 dark:text-amber-400 mt-1">₹{stats.minCtc.toLocaleString()}</div>
          </div>
          <div className="bg-amber-100 text-amber-600 p-2.5 rounded-lg">
            <Percent size={18} />
          </div>
        </div>

      </div>

      {/* Salary Structure Table Grid */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="bg-slate-50/50 p-4 border-b border-gray-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Salary Grade Breakdown Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/50 border-b border-gray-200 text-gray-500 font-semibold">
              <tr>
                <th className="p-3">Grade ID</th>
                <th className="p-3">Grade Name</th>
                <th className="p-3 text-right">Basic Pay (₹)</th>
                <th className="p-3 text-right">HRA (₹)</th>
                <th className="p-3 text-right">DA (₹)</th>
                <th className="p-3 text-right">Allowances (₹)</th>
                <th className="p-3 text-right text-rose-600">Deductions (PF+ESI)</th>
                <th className="p-3 text-right text-emerald-600">Net Take-Home (₹)</th>
                <th className="p-3 text-right">Gross CTC (₹)</th>
                <th className="p-3 text-right no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {structures.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/30 font-medium">
                  <td className="p-3 font-semibold text-gray-800">{s.id}</td>
                  <td className="p-3 text-slate-800 font-bold">{s.name}</td>
                  <td className="p-3 text-right font-mono">₹{s.basic.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono">₹{s.hra.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono">₹{s.da.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono">₹{s.allowance.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-rose-600">₹{(s.pf + s.esi).toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-emerald-600 font-bold">₹{getNetSalary(s).toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-indigo-600 font-extrabold">₹{s.ctc.toLocaleString()}</td>
                  <td className="p-3 text-right no-print">
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="p-1 hover:bg-slate-100 rounded text-rose-600 transition"
                      title="Delete Structure"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEFINE NEW STRUCTURE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-50/50 shadow-inner border border-slate-200/50 flex items-center justify-center z-50 p-4 no-print">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-sm overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-3 border-b flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider">Define New Salary Scale</span>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddStructure} className="p-4 space-y-3 font-semibold">
              <div>
                <label className="block text-gray-600 mb-1">Grade / Structure Name *</label>
                <input 
                  type="text" 
                  value={newStruct.name}
                  onChange={(e) => setNewStruct({...newStruct, name: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Sales Executive Scale B"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 mb-1">Basic Salary (₹/mo) *</label>
                  <input 
                    type="number" 
                    value={newStruct.basic}
                    onChange={(e) => setNewStruct({...newStruct, basic: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 20000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">HRA (₹/mo)</label>
                  <input 
                    type="number" 
                    value={newStruct.hra}
                    onChange={(e) => setNewStruct({...newStruct, hra: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Auto 40%"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 mb-1">DA (₹/mo)</label>
                  <input 
                    type="number" 
                    value={newStruct.da}
                    onChange={(e) => setNewStruct({...newStruct, da: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Auto 20%"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Other Allowances (₹/mo)</label>
                  <input 
                    type="number" 
                    value={newStruct.allowance}
                    onChange={(e) => setNewStruct({...newStruct, allowance: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 3000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 mb-1">PF Deduction (₹/mo)</label>
                  <input 
                    type="number" 
                    value={newStruct.pf}
                    onChange={(e) => setNewStruct({...newStruct, pf: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Auto 12%"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">ESI Deduction (₹/mo)</label>
                  <input 
                    type="number" 
                    value={newStruct.esi}
                    onChange={(e) => setNewStruct({...newStruct, esi: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded text-gray-650 hover:bg-gray-50 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-slate-800 rounded font-bold shadow-xs"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalaryStructure;
