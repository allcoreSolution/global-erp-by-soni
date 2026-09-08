import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Search, X, User, Phone, Mail, MapPin, Download, Upload, Printer } from 'lucide-react';

const EmployeeProfile = () => {
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-001',
      name: 'Amit Sharma',
      gender: 'Male',
      dob: '1992-04-12',
      phone: '9876543210',
      email: 'amit@company.com',
      address: '12, Malviya Nagar, Jaipur, Rajasthan',
      emergencyName: 'Rakesh Sharma (Father)',
      emergencyPhone: '9829012345',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&q=60'
    },
    {
      id: 'EMP-002',
      name: 'Pooja Verma',
      gender: 'Female',
      dob: '1995-08-22',
      phone: '8765432109',
      email: 'pooja@company.com',
      address: '45, Vaishali Nagar, Jaipur, Rajasthan',
      emergencyName: 'Suman Verma (Mother)',
      emergencyPhone: '9928098765',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=60'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmp, setCurrentEmp] = useState({
    id: '', name: '', gender: 'Male', dob: '', phone: '', email: '',
    address: '', emergencyName: '', emergencyPhone: '', photo: ''
  });

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete employee ${id}?`)) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    const nextId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    setCurrentEmp({
      id: nextId, name: '', gender: 'Male', dob: '', phone: '', email: '',
      address: '', emergencyName: '', emergencyPhone: '',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&q=60'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setIsEditMode(true);
    setCurrentEmp({ ...emp });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setEmployees(employees.map(emp => emp.id === currentEmp.id ? { ...currentEmp } : emp));
    } else {
      setEmployees([...employees, { ...currentEmp }]);
    }
    setIsModalOpen(false);
  };

  // Real CSV Export logic
  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Full Name', 'Gender', 'Date of Birth', 'Phone Number', 'Email ID', 'Address', 'Emergency Relation', 'Emergency Phone'];
    const rows = employees.map(emp => [
      emp.id,
      `"${emp.name.replace(/"/g, '""')}"`,
      emp.gender,
      emp.dob,
      emp.phone,
      emp.email,
      `"${emp.address.replace(/"/g, '""')}"`,
      `"${emp.emergencyName.replace(/"/g, '""')}"`,
      emp.emergencyPhone
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employees_profile_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Real CSV Import logic
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const newEmployees = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 6) {
            newEmployees.push({
              id: cols[0] || `EMP-NEW-${Date.now()}-${i}`,
              name: cols[1] || 'Imported Employee',
              gender: cols[2] || 'Male',
              dob: cols[3] || '',
              phone: cols[4] || '',
              email: cols[5] || '',
              address: cols[6] || '',
              emergencyName: cols[7] || '',
              emergencyPhone: cols[8] || '',
              photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&q=60'
            });
          }
        }
        if (newEmployees.length > 0) {
          setEmployees(prev => [...prev, ...newEmployees]);
          alert(`Successfully imported ${newEmployees.length} employees!`);
        } else {
          alert("Import failed. Headers should match: Employee ID, Full Name, Gender, Date of Birth, Phone Number, Email ID, Address, Emergency Relation, Emergency Phone");
        }
      } catch (err) {
        alert("Failed to parse the CSV file correctly.");
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
        id="employee-profile-csv"
        accept=".csv"
        className="hidden"
        onChange={handleImportCSV}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6 border-b pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Employee Profiles</h1>
          <p className="text-[11px] sm:text-xs text-gray-500">Manage basic bio-data, avatar profiles, contact registries, and emergency coordinates.</p>
        </div>
        
        {/* Profile Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto no-print">
          <button
            onClick={() => document.getElementById('employee-profile-csv').click()}
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
            <Plus size={13} /> Add Employee
          </button>
        </div>
      </div>

      {/* Filter search */}
      <div className="relative mb-4 w-full max-w-sm no-print">
        <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by ID or Name..."
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
              <th className="p-2 sm:p-3">Photo</th>
              <th className="p-2 sm:p-3">Employee ID</th>
              <th className="p-2 sm:p-3">Name</th>
              <th className="p-2 sm:p-3">Bio Info</th>
              <th className="p-2 sm:p-3">Contact</th>
              <th className="p-2 sm:p-3">Emergency Contact</th>
              <th className="p-2 sm:p-3 text-center no-print">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-2 sm:p-3">
                  <img src={emp.photo} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                </td>
                <td className="p-2 sm:p-3 font-semibold text-indigo-600 font-mono">{emp.id}</td>
                <td className="p-2 sm:p-3 font-medium text-gray-900">{emp.name}</td>
                <td className="p-2 sm:p-3">
                  <div>Gender: {emp.gender}</div>
                  <div className="text-[10px] text-gray-400">DOB: {emp.dob}</div>
                </td>
                <td className="p-2 sm:p-3">
                  <div>{emp.phone}</div>
                  <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{emp.email}</div>
                </td>
                <td className="p-2 sm:p-3">
                  <div>{emp.emergencyName}</div>
                  <div className="text-[10px] text-gray-400">{emp.emergencyPhone}</div>
                </td>
                <td className="p-2 sm:p-3 text-center no-print">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => handleOpenEdit(emp)} className="p-1 text-amber-600 hover:bg-amber-50 rounded">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
          <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-xl border my-auto">
            <div className="bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 p-3.5 flex justify-between items-center">
              <h3 className="font-bold text-xs sm:text-sm">{isEditMode ? 'Edit Employee Profile' : 'Add Employee Profile'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Employee ID</label>
                  <input type="text" disabled value={currentEmp.id} className="w-full bg-slate-50 border p-2 rounded text-gray-500 text-xs cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={currentEmp.name}
                    onChange={(e) => setCurrentEmp({ ...currentEmp, name: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Gender</label>
                  <select
                    value={currentEmp.gender}
                    onChange={(e) => setCurrentEmp({ ...currentEmp, gender: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none bg-white text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={currentEmp.dob}
                    onChange={(e) => setCurrentEmp({ ...currentEmp, dob: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3.5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={currentEmp.phone}
                    onChange={(e) => setCurrentEmp({ ...currentEmp, phone: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Email ID</label>
                  <input
                    type="email"
                    value={currentEmp.email}
                    onChange={(e) => setCurrentEmp({ ...currentEmp, email: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Current Address</label>
                <textarea
                  rows="2"
                  value={currentEmp.address}
                  onChange={(e) => setCurrentEmp({ ...currentEmp, address: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3.5 bg-slate-50 p-2.5 rounded">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Emergency Relation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh (Father)"
                    value={currentEmp.emergencyName}
                    onChange={(e) => setCurrentEmp({ ...currentEmp, emergencyName: e.target.value })}
                    className="w-full border p-2 rounded bg-white focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase mb-1">Emergency Phone *</label>
                  <input
                    type="tel"
                    required
                    value={currentEmp.emergencyPhone}
                    onChange={(e) => setCurrentEmp({ ...currentEmp, emergencyPhone: e.target.value })}
                    className="w-full border p-2 rounded bg-white focus:outline-none text-xs"
                  />
                </div>
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

export default EmployeeProfile;
