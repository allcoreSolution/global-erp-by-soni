import React, { useState } from 'react';
import { Tag, ShieldAlert, BarChart, Percent, Plus, X, Edit } from 'lucide-react';

const PricingRules = () => {
  const [rules, setRules] = useState([
    { id: 'RULE-001', product: 'TMT Steel Bar 12mm', type: 'Fixed', price: 450, discountPct: 5, discountAmt: 22.5, minQty: 100, maxQty: 1000, start: '2024-04-01', end: '2024-08-31' },
    { id: 'RULE-002', product: 'GI Pipe 2 Inches', type: 'Percentage', price: 1200, discountPct: 10, discountAmt: 120, minQty: 50, maxQty: 500, start: '2024-05-01', end: '2024-12-31' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState({
    id: '', product: '', type: 'Fixed', price: 0, discountPct: 0, discountAmt: 0, minQty: 1, maxQty: 9999, start: '', end: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  const handleOpenAdd = () => {
    setIsEdit(false);
    const nextId = `RULE-${String(rules.length + 1).padStart(3, '0')}`;
    setCurrentRule({
      id: nextId, product: '', type: 'Fixed', price: 0, discountPct: 0, discountAmt: 0, minQty: 1, maxQty: 9999, start: '', end: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rule) => {
    setIsEdit(true);
    setCurrentRule({ ...rule });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      setRules(rules.map(r => r.id === currentRule.id ? { ...currentRule } : r));
    } else {
      setRules([...rules, { ...currentRule }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete rule ${id}?`)) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Slab pricing & Discount rules</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Configure minimum ordering caps, special item rates, percent cuts, and custom schedules.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} /> Add Pricing Rule
        </button>
      </div>

      {/* Rules list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map(rule => (
          <div key={rule.id} className="border rounded-lg p-4 bg-slate-50 space-y-3 relative">
            <div className="flex justify-between items-start border-b pb-2">
              <div>
                <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{rule.id}</span>
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm mt-1">{rule.product}</h3>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => handleOpenEdit(rule)} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                  <Edit size={13} />
                </button>
                <button onClick={() => handleDelete(rule.id)} className="p-1 hover:bg-red-100 rounded text-red-600">
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
              <div>
                <span className="text-gray-500">Price Type:</span>
                <p className="font-semibold text-gray-800">{rule.type}</p>
              </div>
              <div>
                <span className="text-gray-500">Base Price:</span>
                <p className="font-semibold text-gray-800">₹ {rule.price.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Discount Pct:</span>
                <p className="font-bold text-emerald-600">{rule.discountPct}%</p>
              </div>
              <div>
                <span className="text-gray-500">Discount Amount:</span>
                <p className="font-semibold text-gray-800">₹ {rule.discountAmt.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Quantity Range:</span>
                <p className="font-semibold text-gray-800">{rule.minQty} - {rule.maxQty} Units</p>
              </div>
              <div>
                <span className="text-gray-500">Schedule:</span>
                <p className="font-semibold text-gray-800 text-[10px]">{rule.start} to {rule.end}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-xl border my-auto">
            <div className="bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 p-3.5 flex justify-between items-center">
              <h3 className="font-bold text-xs sm:text-sm">{isEdit ? 'Edit Pricing Rule' : 'Add Pricing Rule'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TMT Steel Bar"
                    value={currentRule.product}
                    onChange={(e) => setCurrentRule({ ...currentRule, product: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Price Type</label>
                  <select
                    value={currentRule.type}
                    onChange={(e) => setCurrentRule({ ...currentRule, type: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Price *</label>
                  <input
                    type="number"
                    required
                    value={currentRule.price}
                    onChange={(e) => setCurrentRule({ ...currentRule, price: Number(e.target.value) })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Discount %</label>
                  <input
                    type="number"
                    value={currentRule.discountPct}
                    onChange={(e) => setCurrentRule({ ...currentRule, discountPct: Number(e.target.value) })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Discount Amt</label>
                  <input
                    type="number"
                    value={currentRule.discountAmt}
                    onChange={(e) => setCurrentRule({ ...currentRule, discountAmt: Number(e.target.value) })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Min Quantity</label>
                  <input
                    type="number"
                    value={currentRule.minQty}
                    onChange={(e) => setCurrentRule({ ...currentRule, minQty: Number(e.target.value) })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Max Quantity</label>
                  <input
                    type="number"
                    value={currentRule.maxQty}
                    onChange={(e) => setCurrentRule({ ...currentRule, maxQty: Number(e.target.value) })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Effective From</label>
                  <input
                    type="date"
                    value={currentRule.start}
                    onChange={(e) => setCurrentRule({ ...currentRule, start: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Effective To</label>
                  <input
                    type="date"
                    value={currentRule.end}
                    onChange={(e) => setCurrentRule({ ...currentRule, end: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3.5 py-1.5 border rounded hover:bg-slate-50 text-xs">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 text-xs">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingRules;
