import React, { useState, createContext, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Calculator,
  User,
  Briefcase,
  Layers,
  Banknote,
  Repeat,
  RotateCcw,
  Receipt,
  CreditCard,
  Building,
  FileBox,
  Truck,
  Heart,
  UserPlus,
  ShieldAlert,
  Star,
  X,
  Calendar,
  TrendingUp
} from 'lucide-react';

const SidebarContext = createContext();

const MenuItem = ({ icon: Icon, text, hasDropdown, active = false, shortcut = '', to = "/coming-soon", subItems }) => {
  const { openMenu, setOpenMenu } = useContext(SidebarContext);
  const isOpen = openMenu === text;

  if (subItems && subItems.length > 0) {
    return (
      <div>
        <div
          onClick={() => setOpenMenu(isOpen ? null : text)}
          className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-sm text-gray-300 hover:bg-slate-800 hover:text-white`}
        >
          <div className="flex items-center gap-3">
            <Icon size={16} className="text-gray-400" />
            <span>{text}</span>
          </div>
          <div>
            {isOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
          </div>
        </div>
        {isOpen && (
          <div className="pl-6 bg-[#071324] border-l-2 border-blue-600/30">
            {subItems.map((sub, idx) => (
              <NavLink
                key={idx}
                to={sub.to}
                className={({ isActive }) => `flex items-center py-1.5 px-3 text-xs transition-colors
                ${isActive ? 'text-white font-semibold bg-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
              >
                {sub.text}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-sm group
      ${isActive || active ? 'text-white bg-slate-800' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-gray-400 group-hover:text-white" />
        <span>{text}</span>
      </div>
      <div className="flex items-center gap-2">
        {shortcut && <span className="text-[10px] text-gray-500 bg-slate-800 px-1 rounded">{shortcut}</span>}
        {hasDropdown && <ChevronRight size={14} className="text-gray-500" />}
      </div>
    </NavLink>
  );
};

const MenuSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mt-2">
      <div
        className="flex items-center justify-between px-3 py-1.5 cursor-pointer text-blue-400 text-xs font-semibold tracking-wider hover:text-blue-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>
      {isOpen && <div className="mt-1">{children}</div>}
    </div>
  );
};

const Sidebar = ({ onClose }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  return (
    <SidebarContext.Provider value={{ openMenu, setOpenMenu, openSection, setOpenSection }}>
      <div className="w-[260px] bg-[#0a192f] text-white flex-shrink-0 flex flex-col h-full overflow-hidden select-none">
      {/* Logo Area */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-[#071324]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center text-blue-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
              <path d="M12 9l3 7H9l3-7z" fill="#3b82f6" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold leading-tight tracking-wide flex items-center gap-1">
              ALLCORE
            </div>
            <div className="text-[11px] text-blue-400 font-semibold tracking-widest mt-0.5">SOLUTION ERP</div>
            <div className="text-[9px] text-gray-400 mt-0.5 tracking-wider">One System. All Solutions.</div>
          </div>
        </div>
        {/* Mobile Close Button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1">
            <X size={20} />
          </button>
        )}
      </div>


      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pb-4 overflow-x-hidden no-scrollbar">
        <div className="mt-2">
          <MenuItem icon={LayoutDashboard} text="Dashboard" to="/" />
        </div>

        <MenuSection title="MASTERS" defaultOpen={true}>
          <MenuItem icon={User} text="Customer Master" to="/customers/customer-master" />
          <MenuItem
            icon={Truck}
            text="Supplier Master"
            subItems={[
              { text: 'Basic Information', to: '/suppliers/basic-info' },
              { text: 'Contact & Address', to: '/suppliers/contact-address' },
              { text: 'Tax & Financial', to: '/suppliers/tax-financial' },
              { text: 'Transaction & History', to: '/suppliers/transaction-history' },
              { text: 'Utilities', to: '/suppliers/utilities' }
            ]}
          />
          <MenuItem
            icon={Package}
            text="Item / Product Master"
            subItems={[
              { text: 'Add Product', to: '/products/add-product' },
              { text: 'Brand', to: '/products/brand' },
              { text: 'Category', to: '/products/category' },
              { text: 'Unit', to: '/products/unit' },
              { text: 'Product List', to: '/products/product-list' },
              { text: 'Add Adjustment', to: '/products/add-adjustment' },
              { text: 'Adjustment List', to: '/products/adjustment-list' },
              { text: 'Stock Count', to: '/products/stock-count' }
            ]}
          />

          <MenuItem
            icon={FileText}
            text="Price List Master"
            subItems={[
              { text: 'Price List', to: '/price-list/list' },
              { text: 'Pricing Rules', to: '/price-list/rules' },
              { text: 'Mapping', to: '/price-list/mapping' },
              { text: 'Utilities', to: '/price-list/utilities' }
            ]}
          />
          <MenuItem
            icon={Calculator}
            text="Tax Master"
            subItems={[
              { text: 'Tax Configuration', to: '/tax/config' },
              { text: 'Tax Mapping', to: '/tax/mapping' },
              { text: 'Utilities', to: '/tax/utilities' }
            ]}
          />
          <MenuItem
            icon={Building}
            text="Company Master"
            subItems={[
              { text: 'Company Profile', to: '/company/profile' },
              { text: 'Tax & Legal', to: '/company/tax-legal' },
              { text: 'Business Settings', to: '/company/business-settings' },
              { text: 'Bank & Structure', to: '/company/bank-structure' },
              { text: 'Status', to: '/company/status' }
            ]}
          />
          <MenuItem
            icon={Layers}
            text="Branch Master"
            subItems={[
              { text: 'Branch Information', to: '/branch/info' },
              { text: 'Management', to: '/branch/management' },
              { text: 'Branch Data', to: '/branch/data' },
              { text: 'Utilities', to: '/branch/utilities' }
            ]}
          />

        </MenuSection>

        <MenuSection title="TRANSACTIONS" defaultOpen={true}>
          <MenuItem
            icon={ShoppingCart}
            text="Sales"
            subItems={[
              { text: 'Add Sale', to: '/sales/add-sale' },
              { text: 'Sale List', to: '/sales/sale-list' },
              { text: 'POS', to: '/sales/pos' },
              { text: 'Packing Slip List', to: '/sales/packing-slip-list' },
              { text: 'Challan List', to: '/sales/challan-list' },
              { text: 'Driver List', to: '/sales/driver-list' },
              { text: 'Gift Card List', to: '/sales/gift-card-list' },
              { text: 'Coupon List', to: '/sales/coupon-list' },
              { text: 'Courier List', to: '/sales/courier-list' },
              { text: 'Sale Return', to: '/sales/sale-return' },
              { text: 'Sale Exchange List', to: '/sales/sale-exchange-list' }
            ]}
          />
          <MenuItem
            icon={FileBox}
            text="Purchase"
            subItems={[
              { text: 'Add Purchase', to: '/purchases/add-purchase' },
              { text: 'Purchase List', to: '/purchases/purchase-list' },
              { text: 'Import Purchase by CSV', to: '/purchases/import-purchase' },
              { text: 'Purchase Return', to: '/purchases/purchase-return' }
            ]}
          />
          <MenuItem
            icon={Receipt}
            text="Receipt"
            subItems={[
              { text: 'Receipt List', to: '/receipt/list' },
              { text: 'New Receipt', to: '/receipt/new' }
            ]}
          />
          <MenuItem
            icon={CreditCard}
            text="Payment"
            subItems={[
              { text: 'Payment List', to: '/payment/list' },
              { text: 'New Payment', to: '/payment/new' }
            ]}
          />
          <MenuItem
            icon={Banknote}
            text="Bank Receipt"
            subItems={[
              { text: 'Bank Receipt List', to: '/bank-receipt/list' },
              { text: 'New Bank Receipt', to: '/bank-receipt/new' }
            ]}
          />
          <MenuItem
            icon={CreditCard}
            text="Bank Payment"
            subItems={[
              { text: 'Bank Payment List', to: '/bank-payment/list' },
              { text: 'New Bank Payment', to: '/bank-payment/new' }
            ]}
          />
          <MenuItem
            icon={Repeat}
            text="Contra Entry"
            subItems={[
              { text: 'Contra List', to: '/contra/list' },
              { text: 'New Contra', to: '/contra/new' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="Journal Entry"
            subItems={[
              { text: 'Journal List', to: '/journal/list' },
              { text: 'New Journal', to: '/journal/new' }
            ]}
          />
          <MenuItem
            icon={Package}
            text="Stock Entry"
            subItems={[
              { text: 'Stock Entry List', to: '/stock-entry/list' },
              { text: 'New Stock Entry', to: '/stock-entry/new' }
            ]}
          />
          <MenuItem
            icon={Repeat}
            text="Stock Transfer"
            subItems={[
              { text: 'Transfer List', to: '/stock-transfer/list' },
              { text: 'New Transfer', to: '/stock-transfer/new' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="Debit Note"
            subItems={[
              { text: 'Debit Note List', to: '/debit-note/list' },
              { text: 'New Debit Note', to: '/debit-note/new' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="Credit Note"
            subItems={[
              { text: 'Credit Note List', to: '/credit-note/list' },
              { text: 'New Credit Note', to: '/credit-note/new' }
            ]}
          />
          <MenuItem icon={FileText} text="Day Book" to="/day-book" />
        </MenuSection>

        <MenuSection title="HRMS" defaultOpen={true}>
          <MenuItem
            icon={Users}
            text="Employee Management"
            subItems={[
              { text: 'Employee Profile', to: '/employees/profile' },
              { text: 'Job Information', to: '/employees/job-info' },
              { text: 'Financial & Documents', to: '/employees/financial-docs' },
              { text: 'Employee Directory', to: '/employees/records' },
              { text: 'Utilities', to: '/employees/utilities' }
            ]}
          />
          <MenuItem
            icon={Calendar}
            text="Attendance & Leave"
            subItems={[
              { text: 'Daily Attendance', to: '/hrms/attendance/daily' },
              { text: 'Leave Requests', to: '/hrms/attendance/leaves' },
              { text: 'Holiday Calendar', to: '/hrms/attendance/holidays' }
            ]}
          />
          <MenuItem
            icon={Calculator}
            text="Payroll & Salary"
            subItems={[
              { text: 'Salary Structure', to: '/hrms/payroll/structure' },
              { text: 'Generate Pay Slips', to: '/hrms/payroll/slips' },
              { text: 'PF & ESI Reports', to: '/hrms/payroll/pf-esi' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="Expense Claims"
            subItems={[
              { text: 'Reimbursement Claims', to: '/hrms/expenses/claims' },
              { text: 'Claim Status Log', to: '/hrms/expenses/log' }
            ]}
          />
          <MenuItem
            icon={TrendingUp}
            text="Performance & KPI"
            subItems={[
              { text: 'Appraisal Ratings', to: '/hrms/performance/appraisals' },
              { text: 'Employee Targets', to: '/hrms/performance/targets' }
            ]}
          />
          <MenuItem
            icon={Settings}
            text="HR Setup"
            subItems={[
              { text: 'Department Master', to: '/department/list' },
              { text: 'Designation Master', to: '/designation/list' },
              { text: 'Shift & Timings', to: '/hrms/setup/shifts' },
              { text: 'Master Settings', to: '/hrms/setup/master-settings' }
            ]}
          />
        </MenuSection>

        <MenuSection title="REPORTS" defaultOpen={true}>
          <MenuItem
            icon={FileText}
            text="Accounts Reports"
            subItems={[
              { text: 'Ledger & Voucher Reports', to: '/reports/accounts/ledger-voucher' },
              { text: 'Financial Reports', to: '/reports/accounts/financial' },
              { text: 'Analysis', to: '/reports/accounts/analysis' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="Stock Reports"
            subItems={[
              { text: 'Stock Reports', to: '/reports/stock/ledger' },
              { text: 'Product Reports', to: '/reports/stock/product' },
              { text: 'Control Reports', to: '/reports/stock/control' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="Sales Reports"
            subItems={[
              { text: 'Sales Summary', to: '/reports/sales/summary' },
              { text: 'Analysis', to: '/reports/sales/analysis' },
              { text: 'Financial', to: '/reports/sales/financial' },
              { text: 'Top Performance', to: '/reports/sales/performance' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="Purchase Reports"
            subItems={[
              { text: 'Purchase Summary', to: '/reports/purchases/summary' },
              { text: 'Analysis', to: '/reports/purchases/analysis' },
              { text: 'Financial', to: '/reports/purchases/financial' },
              { text: 'Performance', to: '/reports/purchases/performance' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="MIS Reports"
            subItems={[
              { text: 'Management Dashboard', to: '/reports/mis/management-dashboard' },
              { text: 'Performance Analysis', to: '/reports/mis/performance-analysis' },
              { text: 'Business Analysis', to: '/reports/mis/business-analysis' },
              { text: 'KPI Reports', to: '/reports/mis/kpi-reports' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="GST Reports"
            subItems={[
              { text: 'GST Sales', to: '/reports/gst/sales' },
              { text: 'GST Purchase', to: '/reports/gst/purchase' },
              { text: 'Tax Analysis', to: '/reports/gst/tax-analysis' },
              { text: 'Reconciliation', to: '/reports/gst/reconciliation' }
            ]}
          />
          <MenuItem
            icon={FileText}
            text="TDS Reports"
            subItems={[
              { text: 'TDS Sales', to: '/reports/tds/sales' },
              { text: 'TDS Purchase', to: '/reports/tds/purchase' },
              { text: 'Tax Analysis', to: '/reports/tds/tax-analysis' },
              { text: 'Reconciliation', to: '/reports/tds/reconciliation' }
            ]}
          />
        </MenuSection>

        <MenuSection title="SETUP" defaultOpen={true}>
          <MenuItem icon={Settings} text="System Settings" to="/setup/system-settings" />
          <MenuItem icon={Repeat} text="Backup & Restore" to="/setup/backup-restore" />
          <MenuItem icon={Layers} text="Utilities" to="/setup/utilities" />
          <MenuItem
            icon={Users}
            text="User & Role Master"
            subItems={[
              { text: 'User Master', to: '/setup/user-master' },
              { text: 'Role Master', to: '/setup/role-master' }
            ]}
          />
        </MenuSection>

        <MenuSection title="FAVOURITES" defaultOpen={true}>
          <div className="flex gap-1 p-2 flex-wrap">
            {[
              { icon: ShoppingCart, text: 'Sale Entry', key: 'F2', to: '/sales/add-sale' },
              { icon: FileBox, text: 'Purchase', key: 'F3', to: '/purchases/add-purchase' },
              { icon: Receipt, text: 'Receipt', key: 'F4', to: '/receipt/new' },
              { icon: CreditCard, text: 'Payment', key: 'F5', to: '/payment/new' },
              { icon: Banknote, text: 'Bk.Recipt', key: 'F6', to: '/bank-receipt/new' }
            ].map((fav, i) => (
              <Link to={fav.to} key={i} className="flex flex-col items-center justify-center p-2 hover:bg-slate-800 rounded cursor-pointer w-16 text-center group">
                <fav.icon size={16} className="text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-gray-300 leading-tight">{fav.text}</span>
                <span className="text-[8px] text-gray-500 mt-1">({fav.key})</span>
              </Link>
            ))}
          </div>
        </MenuSection>

      </div>
    </div>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
