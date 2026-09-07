import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';

const lineData = [
  { name: 'Apr', sales: 60, purchase: 40 },
  { name: 'May', sales: 75, purchase: 50 },
  { name: 'Jun', sales: 55, purchase: 35 },
  { name: 'Jul', sales: 70, purchase: 45 },
  { name: 'Aug', sales: 60, purchase: 40 },
  { name: 'Sep', sales: 85, purchase: 55 },
  { name: 'Oct', sales: 75, purchase: 45 },
  { name: 'Nov', sales: 90, purchase: 60 },
  { name: 'Dec', sales: 70, purchase: 45 },
  { name: 'Jan', sales: 85, purchase: 55 },
  { name: 'Feb', sales: 100, purchase: 65 },
  { name: 'Mar', sales: 80, purchase: 50 },
];

const pieData = [
  { name: 'Purchase', value: 28540, color: '#3b82f6' }, // blue
  { name: 'Salary', value: 18420, color: '#eab308' }, // yellow
  { name: 'Rent & Utilities', value: 9850, color: '#ef4444' }, // red
  { name: 'Marketing', value: 6540, color: '#f97316' }, // orange
  { name: 'Transport', value: 5420, color: '#10b981' }, // emerald
  { name: 'Other', value: 6670, color: '#06b6d4' }, // cyan
];

export const DashboardCharts = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Business Overview Line Chart */}
      <div 
        onClick={() => navigate('/reports/mis/performance-analysis')}
        className="lg:col-span-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-lg shadow-sm p-4 transition-colors cursor-pointer hover:shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-blue-900 dark:text-slate-100 tracking-wide uppercase">Business Overview <span className="text-gray-400 dark:text-gray-500 font-normal normal-case">(This Year)</span></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 mr-4 text-xs font-medium dark:text-slate-300">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Sales</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Purchase</div>
            </div>
            <div className="text-xs border dark:border-slate-800 dark:text-slate-300 rounded px-2 py-1 flex items-center gap-1 cursor-pointer">This Year <ChevronDown size={14} /></div>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">(In Lakh)</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} tickFormatter={(val) => `${val}L`} />
              <RechartsTooltip contentStyle={{ fontSize: '12px', backgroundColor: '#1e293b', border: 'none', color: '#f1f5f9' }} />
              <Line type="linear" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="linear" dataKey="purchase" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Expenses Doughnut Chart */}
      <div 
        onClick={() => navigate('/reports/mis/kpi-reports')}
        className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-lg shadow-sm p-4 flex flex-col transition-colors cursor-pointer hover:shadow-md"
      >
         <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-blue-900 dark:text-slate-100 tracking-wide uppercase">Top Expenses <span className="text-gray-400 dark:text-gray-500 font-normal normal-case">(This Year)</span></div>
          <div className="text-xs border dark:border-slate-800 dark:text-slate-300 rounded px-2 py-1 flex items-center gap-1 cursor-pointer">This Year <ChevronDown size={14} /></div>
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-1/2 h-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={0} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-sm font-bold text-gray-800 dark:text-slate-100">₹ 75,42,000</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400">Total Expenses</span>
            </div>
          </div>
          <div className="w-1/2 pl-4">
            <ul className="space-y-3">
              {pieData.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-gray-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 dark:text-gray-455 w-6 text-right">{(item.value / 75420 * 100).toFixed(0)}%</span>
                    <span className="font-medium text-gray-600 dark:text-slate-400 w-14 text-right">(₹ {(item.value / 1000).toFixed(1).replace('.0','')}k)</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Outstanding Details */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-lg shadow-sm p-4 flex flex-col justify-between transition-colors">
        <div>
          <div className="text-sm font-bold text-blue-900 dark:text-slate-100 tracking-wide uppercase mb-6">Outstanding Details</div>
          
          <div className="space-y-4 text-sm font-medium">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-slate-350">Sundry Debtors</span>
              <span className="text-green-600 dark:text-green-400">₹ 12,45,230.00 Dr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-slate-350">Sundry Creditors</span>
              <span className="text-red-500 dark:text-red-400">₹ 8,75,430.00 Cr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-slate-350">Others Receivable</span>
              <span className="text-green-600 dark:text-green-400">₹ 2,20,000.00 Dr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-slate-350">Others Payable</span>
              <span className="text-red-500 dark:text-red-400">₹ 1,80,000.00 Cr</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
            <span className="text-sm font-bold text-blue-900 dark:text-slate-200">Net Outstanding</span>
            <span className="text-lg font-bold text-blue-900 dark:text-blue-400">₹ 21,20,660.00</span>
          </div>
          <button 
            onClick={() => navigate('/reports/mis/business-analysis')}
            className="w-full bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold py-2.5 rounded-md border border-blue-200 dark:border-blue-900/40 transition-all"
          >
            View All Outstanding
          </button>
        </div>
      </div>
    </div>
  );
};
