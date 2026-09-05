import React from 'react';
import { Building2, FileText, MessageSquare, User, LogOut } from 'lucide-react';

export const CustomerPortalNavbar = ({ customerName = 'Acme Corp', onSwitchToInternal }) => {
  return (
    <header className="bg-slate-950 border-b border-indigo-900/40 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                DealFlow <span className="text-cyan-400">Customer Portal</span>
              </span>
              <span className="block text-[10px] text-slate-400">Logged in as {customerName}</span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <button className="flex items-center gap-2 text-cyan-400 font-medium cursor-pointer">
              <FileText className="w-4 h-4" /> My Quotation
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer">
              <MessageSquare className="w-4 h-4" /> Messages
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer">
              <User className="w-4 h-4" /> Account Profile
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToInternal}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" /> Back to Internal Platform
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerPortalNavbar;
