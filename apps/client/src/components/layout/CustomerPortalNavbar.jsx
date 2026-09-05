import React from 'react';
import { Building2, FileText, MessageSquare, User, LogOut } from 'lucide-react';

export const CustomerPortalNavbar = ({
  customerName = 'Acme Corp',
  onLogout,
  activeTab = 'quote',
  onNavigate
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#714B67] flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                DealFlow <span className="text-[#714B67]">Customer Portal</span>
              </span>
              <span className="block text-[10px] text-slate-500">Logged in as {customerName}</span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm h-full">
            <button
              onClick={() => onNavigate && onNavigate('quote')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'quote'
                  ? 'text-[#714B67] font-bold border-b-2 border-[#714B67] py-5'
                  : 'text-slate-600 hover:text-slate-900 font-medium py-5'
              }`}
            >
              <FileText className="w-4 h-4" /> My Quotation
            </button>
            <button
              onClick={() => onNavigate && onNavigate('rfq')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'rfq'
                  ? 'text-[#714B67] font-bold border-b-2 border-[#714B67] py-5'
                  : 'text-slate-600 hover:text-slate-900 font-medium py-5'
              }`}
            >
              <Building2 className="w-4 h-4" /> Ask for Quotation
            </button>
            <button
              onClick={() => onNavigate && onNavigate('messages')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'messages'
                  ? 'text-[#714B67] font-bold border-b-2 border-[#714B67] py-5'
                  : 'text-slate-600 hover:text-slate-900 font-medium py-5'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Messages
            </button>
            <button
              onClick={() => onNavigate && onNavigate('profile')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'profile'
                  ? 'text-[#714B67] font-bold border-b-2 border-[#714B67] py-5'
                  : 'text-slate-600 hover:text-slate-900 font-medium py-5'
              }`}
            >
              <User className="w-4 h-4" /> Account Profile
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerPortalNavbar;
