import React from 'react';
import { Building2, FileText, MessageSquare, User, LogOut } from 'lucide-react';

export const CustomerPortalNavbar = ({ customerName = 'Acme Corp', onSwitchToInternal }) => {
  return (
    <header className="bg-white dark:bg-slate-950 border-b border-purple-200 dark:border-purple-900/40 sticky top-0 z-40 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                DealFlow <span className="text-purple-600 dark:text-purple-400">Customer Portal</span>
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">Logged in as {customerName}</span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <button className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium cursor-pointer">
              <FileText className="w-4 h-4" /> My Quotation
            </button>
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer">
              <MessageSquare className="w-4 h-4" /> Messages
            </button>
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer">
              <User className="w-4 h-4" /> Account Profile
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToInternal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Back to Internal Platform
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerPortalNavbar;
