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
  User
} from 'lucide-react';

export const MainNavbar = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  onLogout,
  pendingApprovalsCount = 0
}) => {
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['sales_rep', 'sales_manager', 'finance_ops', 'admin'] },
    { id: 'quotations', label: 'Quotations', icon: FileText, roles: ['sales_rep', 'sales_manager', 'admin'] },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, roles: ['sales_manager', 'finance_ops', 'admin'] },
    { id: 'fulfillment', label: 'Fulfillment', icon: Truck, roles: ['finance_ops', 'admin'] },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat, roles: ['finance_ops', 'admin'] },
    { id: 'invoices', label: 'Invoices', icon: CreditCard, roles: ['finance_ops', 'admin'] },
    { id: 'deal-health', label: 'Deal Health', icon: ShieldAlert, alert: true, roles: ['sales_manager', 'admin'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['sales_rep', 'sales_manager', 'finance_ops', 'admin'] },
    { id: 'products', label: 'Products', icon: Package, roles: ['sales_rep', 'sales_manager', 'admin'] },
    { id: 'config', label: 'Discount Config', icon: Sliders, roles: ['admin'] }
  ];

  const currentRole = currentUser?.role || 'sales_rep';
  const permittedNavItems = allNavItems.filter((item) => item.roles.includes(currentRole));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-[#714B67] border border-[#714B67]/40 flex items-center justify-center shadow-md shadow-[#714B67]/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                DealFlow<span className="text-[#714B67]">360</span>
              </span>
              <span className="block text-[10px] text-[#714B67] uppercase tracking-widest font-extrabold">
                Complete B2B Sales, Quotation & Revenue Ops Platform
              </span>
            </div>
          </div>

          {/* User Profile & Logout Controls */}
          <div className="flex items-center gap-3">
            {/* User Profile Quick Action */}
            <button
              onClick={() => setActiveTab('profile')}
              className="text-right flex items-center gap-2 group cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#714B67] text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-[#714B67]">{currentUser?.name || 'User'}</span>
                <span className="block text-[10px] text-[#714B67] font-semibold uppercase tracking-wider">
                  {currentRole.replace('_', ' ')}
                </span>
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Log Out"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-100">
          {permittedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#714B67] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
                {item.id === 'approvals' && pendingApprovalsCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse ${
                    isActive ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                  }`}>
                    {pendingApprovalsCount > 99 ? '99+' : pendingApprovalsCount}
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
