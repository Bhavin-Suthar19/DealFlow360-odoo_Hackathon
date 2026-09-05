import React from 'react';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Truck,
  Repeat,
  CreditCard,
  ShieldAlert,
  BarChart3,
  Package,
  Sliders,
  LogOut,
  UserCheck,
  Building2,
  Sun,
  Moon
} from 'lucide-react';

export const MainNavbar = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  theme,
  onToggleTheme,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: 1 },
    { id: 'fulfillment', label: 'Fulfillment', icon: Truck },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { id: 'invoices', label: 'Invoices', icon: CreditCard },
    { id: 'deal-health', label: 'Deal Health', icon: ShieldAlert, alert: true },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'config', label: 'Discount Config', icon: Sliders }
  ];

  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-40 shadow-xs backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/25">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                DealFlow<span className="text-purple-600 dark:text-purple-400">360</span>
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                Autonomous Sales Ops
              </span>
            </div>
          </div>

          {/* Persona & Theme Switcher Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>

            {/* Persona Selector */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
              <UserCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Role:</span>
              <select
                value={currentUser.role}
                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                className="bg-transparent text-purple-700 dark:text-purple-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="sales_rep" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sales Rep (Alex)</option>
                <option value="sales_manager" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sales Manager (J. Rao)</option>
                <option value="finance_ops" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Finance / Ops (M. Shah)</option>
                <option value="admin" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Admin (Elena)</option>
              </select>
            </div>

            {/* User Profile */}
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</span>
              <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Logout / Switch Persona"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-100 dark:border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.label}
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
                {item.alert && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default MainNavbar;
