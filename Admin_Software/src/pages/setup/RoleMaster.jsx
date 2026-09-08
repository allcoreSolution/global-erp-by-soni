import React, { useState } from 'react';
import { ShieldCheck, Download, Printer } from 'lucide-react';

const RoleMaster = () => {
  const [roles, setRoles] = useState([
    { name: 'Admin', desc: 'Full system-wide administrative access', usersCount: 1 },
    { name: 'Accountant', desc: 'Manage ledger, payments, bank receipts & taxes', usersCount: 1 },
    { name: 'Sales Lead', desc: 'Create sales orders, pos billing, and returns', usersCount: 1 },
    { name: 'Operator', desc: 'Data entry, stock count, and warehouse listings', usersCount: 1 }
  ]);

  const [selectedRole, setSelectedRole] = useState('Accountant');
  const [permissions, setPermissions] = useState({
    Sales: { view: true, add: true, edit: false, delete: false },
    Purchases: { view: true, add: false, edit: false, delete: false },
    Accounts: { view: true, add: true, edit: true, delete: false },
    Settings: { view: false, add: false, edit: false, delete: false }
  });

  const togglePermission = (module, action) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action]
      }
    }));
  };

  const handleSavePermissions = () => {
    alert(`Permissions configuration for role "${selectedRole}" saved successfully!`);
  };

  // CSV Export for permission matrix
  const handleExportCSV = () => {
    const headers = ['Module Name', 'View Permission', 'Add Permission', 'Edit Permission', 'Delete Permission'];
    const rows = Object.keys(permissions).map(module => [
      module,
      permissions[module].view ? 'Enabled' : 'Disabled',
      permissions[module].add ? 'Enabled' : 'Disabled',
      permissions[module].edit ? 'Enabled' : 'Disabled',
      permissions[module].delete ? 'Enabled' : 'Disabled'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Role_Permissions_Matrix_${selectedRole}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200/70 shadow-sm min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" size={22} /> Role Master & Permissions Settings
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500">
            Define corporate job roles and configure feature-wise permissions (view, add, edit, delete).
          </p>
        </div>
        
        {/* Actions header group */}
        <div className="flex items-center gap-2 no-print">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border rounded transition"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm transition"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Roles List */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Defined Roles</h3>
          <div className="space-y-2">
            {roles.map((r, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedRole(r.name)}
                className={`p-3 border rounded-xl cursor-pointer transition flex flex-col justify-between ${
                  selectedRole === r.name ? 'border-blue-500 bg-blue-50/10' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">{r.name}</span>
                  <span className="text-[9px] text-gray-500 bg-slate-100 px-2 py-0.5 rounded font-semibold">{r.usersCount} users</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Permissions Matrix: {selectedRole}</h3>
              <p className="text-[10px] text-gray-400">Configure what actions this role can perform.</p>
            </div>
            <button 
              onClick={handleSavePermissions}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-slate-800 font-bold text-[10px] rounded shadow-xs transition"
            >
              Save Permissions
            </button>
          </div>
          
          <div className="space-y-4 pt-2">
            {Object.keys(permissions).map((module) => (
              <div key={module} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center border-b pb-3">
                <span className="text-xs font-bold text-slate-800 sm:col-span-1">{module}</span>
                <div className="grid grid-cols-4 gap-2 sm:col-span-4 text-center">
                  {['view', 'add', 'edit', 'delete'].map((action) => (
                    <label 
                      key={action}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1.5 cursor-pointer p-2 bg-slate-50/50 hover:bg-slate-100 border rounded-lg transition select-none"
                    >
                      <input 
                        type="checkbox"
                        checked={permissions[module][action]}
                        onChange={() => togglePermission(module, action)}
                        className="rounded text-indigo-600 focus:ring-blue-500 self-center sm:self-auto"
                      />
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{action}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoleMaster;
