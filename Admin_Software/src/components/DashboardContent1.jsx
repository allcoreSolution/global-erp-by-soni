import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ShoppingCart, Package, Building2, Landmark, UsersRound, FileCheck, FileBox, FileArchive, ArrowRight,
  TrendingUp, TrendingDown, Percent, ListPlus, Banknote, FileText
} from 'lucide-react';

export const QuickLinks = () => {
  const navigate = useNavigate();

  const links = [
    { icon: Users, title: 'CRM', subtitle: 'Leads & Customers', to: '/customers/customer-master', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-950/40' },
    { icon: ShoppingCart, title: 'SALES', subtitle: 'Quotations, Orders', to: '/sales/sale-list', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/40' },
    { icon: Package, title: 'PURCHASE', subtitle: 'Orders, Bills', to: '/purchases/purchase-list', color: 'text-red-500 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-950/40' },
    { icon: Building2, title: 'INVENTORY', subtitle: 'Stock, Items', to: '/products/product-list', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-950/40' },
    { icon: Landmark, title: 'ACCOUNTS', subtitle: 'Ledger, Journal', to: '/reports/accounts/ledger-voucher', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-950/40' },
    { icon: Banknote, title: 'BANKING', subtitle: 'Banking, Reconcile', to: '/reports/mis/management-dashboard', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/40' },
    { icon: UsersRound, title: 'HRM', subtitle: 'Employees, Payroll', to: '/employees/profile', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-950/40' },
    { icon: FileCheck, title: 'PAYROLL', subtitle: 'Salary, TDS, PF', to: '/employees/financial-docs', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-950/40' },
    { icon: FileBox, title: 'PROJECTS', subtitle: 'Asset Milestone', to: '/coming-soon', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-950/40' },
    { icon: FileArchive, title: 'DOCUMENTS', subtitle: 'Files, Notes', to: '/coming-soon', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/40' },
    { icon: ListPlus, title: 'More', subtitle: '', to: '/setup/help-support', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-transparent' }
  ];

  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
      {links.map((item, idx) => (
        <div 
          key={idx} 
          onClick={() => navigate(item.to)}
          className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-gray-100 dark:border-slate-800/80 shadow-sm cursor-pointer hover:shadow-md transition-all min-w-[140px] flex-shrink-0"
        >
          <div className={`p-2 rounded-md ${item.bg}`}>
            <item.icon size={20} className={item.color} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-800 dark:text-slate-200">{item.title}</div>
            {item.subtitle && <div className="text-[9px] text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.subtitle}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export const SummaryCards = () => {
  const navigate = useNavigate();

  const cards = [
    { title: 'TOTAL SALES', amount: '₹ 1,25,80,450', percent: '18.65%', up: true, icon: ShoppingCart, to: '/reports/mis/kpi-reports', color: 'bg-blue-500' },
    { title: 'TOTAL PURCHASE', amount: '₹ 85,40,230', percent: '8.32%', up: false, icon: Package, to: '/reports/mis/kpi-reports', color: 'bg-red-500' },
    { title: 'GROSS PROFIT', amount: '₹ 40,40,220', percent: '22.41%', up: true, icon: Percent, to: '/reports/mis/kpi-reports', color: 'bg-green-600' },
    { title: 'NET PROFIT', amount: '₹ 18,75,320', percent: '16.35%', up: true, icon: TrendingUp, to: '/reports/mis/kpi-reports', color: 'bg-teal-500' },
    { title: 'TOTAL EXPENSES', amount: '₹ 75,42,000', percent: '12.52%', up: true, icon: TrendingDown, to: '/reports/mis/kpi-reports', color: 'bg-orange-500' },
    { title: 'OUTSTANDING', amount: '₹ 21,20,660', link: 'View Details', icon: FileText, to: '/reports/mis/business-analysis', color: 'bg-purple-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          onClick={() => navigate(card.to)}
          className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-colors cursor-pointer hover:shadow-md"
        >
          <div>
            <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-1">{card.title}</div>
            <div className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-1">{card.amount}</div>
            {card.percent && (
              <div className={`text-[10px] font-bold flex items-center gap-1 ${card.up ? 'text-green-500' : 'text-red-500'}`}>
                {card.up ? <ArrowRight size={10} className="-rotate-45" /> : <ArrowRight size={10} className="rotate-45" />}
                {card.percent} <span className="text-gray-400 dark:text-gray-500 font-normal">vs Last Year</span>
              </div>
            )}
            {card.link && (
              <div className="text-[10px] font-medium text-blue-500 dark:text-blue-400 cursor-pointer hover:underline mt-1">{card.link}</div>
            )}
          </div>
          <div className={`${card.color} text-white p-3 rounded-lg flex-shrink-0`}>
            <card.icon size={22} strokeWidth={2} />
          </div>
        </div>
      ))}
    </div>
  );
};
