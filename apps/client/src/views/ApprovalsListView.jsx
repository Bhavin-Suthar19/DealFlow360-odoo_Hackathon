import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import usePagination from '../hooks/usePagination';
import { ArrowRight, Filter, Search, X } from 'lucide-react';

export const ApprovalsListView = ({ approvals = [], quotations = [], onSelectApproval }) => {
  const [filterStatus, setFilterStatus] = useState('New Requests');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'New Requests', label: 'New Requests', count: approvals.filter((a) => a.status === 'Pending').length },
    { id: 'Pending', label: 'Pending', count: approvals.filter((a) => a.status === 'Pending').length },
    { id: 'Returned', label: 'Returned', count: approvals.filter((a) => a.status === 'Returned').length },
    { id: 'Approved', label: 'Approved', count: approvals.filter((a) => a.status === 'Approved').length },
    { id: 'Rejected', label: 'Rejected', count: approvals.filter((a) => a.status === 'Rejected').length },
    { id: 'All', label: 'All Records', count: approvals.length }
  ];

  // Filter logic: 'New Requests' filters to pending inbound escalation requests sorted newest first
  const filteredApprovals = useMemo(() => {
    let list = approvals;
    if (filterStatus === 'New Requests') {
      list = approvals
        .filter((a) => a.status === 'Pending')
        .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
    } else if (filterStatus === 'Pending') {
      list = approvals.filter((a) => a.status === 'Pending');
    } else if (filterStatus !== 'All') {
      list = approvals.filter((a) => a.status === filterStatus);
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter((item) => {
      // Check every string property of the item
      for (const key of Object.keys(item || {})) {
        const val = item[key];
        if (typeof val === 'string' && val.toLowerCase().includes(q)) return true;
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          for (const subKey of Object.keys(val)) {
            const subVal = val[subKey];
            if (typeof subVal === 'string' && subVal.toLowerCase().includes(q)) return true;
          }
        }
      }
      return false;
    });
  }, [approvals, filterStatus, searchQuery]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedApprovals,
    onPageChange,
    onPageSizeChange,
    resetPage
  } = usePagination(filteredApprovals, 10);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    resetPage();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approvals & Governance Queue</h1>
          <p className="text-sm text-slate-500">Review flagged deals requiring manager or finance approval</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card className="p-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                resetPage();
              }}
              placeholder="Search approvals by quote #, customer, role, rep, status..."
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#714B67] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  resetPage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Tabs / Pills with New Requests */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0 hidden sm:block" />
            {tabs.map((tab) => {
              const isActive = filterStatus === tab.id;
              const isNewRequestsTab = tab.id === 'New Requests';
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFilterChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#714B67] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {isNewRequestsTab && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card
        title={
          filterStatus === 'New Requests'
            ? 'New Inbound Escalation Requests'
            : `Governance Queue (${filterStatus})`
        }
        subtitle={`Showing ${filteredApprovals.length} records matching '${filterStatus}' filter`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Quote #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Customer Tier</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApprovals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    {searchQuery ? `No approval records matching "${searchQuery}".` : `No approval records matching status '${filterStatus}'.`}
                  </td>
                </tr>
              ) : (
                paginatedApprovals.map((app) => {
                  const appId = app.id || app._id;
                  const isNew = app.status === 'Pending';
                  return (
                    <tr key={appId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#714B67]">
                        <div className="flex items-center gap-1.5">
                          {app.quote_number}
                          {isNew && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{app.customer_name}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={app.customer_tier === 'Gold' ? 'warning' : 'default'}>{app.customer_tier || 'Standard'}</Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={app.risk_level === 'HIGH' ? 'danger' : app.risk_level === 'MEDIUM' ? 'warning' : 'success'}>
                          {app.risk_level || 'MEDIUM'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{app.blended_risk_score ?? 0}%</td>
                      <td className="py-3.5 px-4 text-slate-600">{app.assigned_user || app.assigned_to_role || 'Sales Manager'}</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            app.status === 'Approved'
                              ? 'success'
                              : app.status === 'Pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {app.status === 'Pending' ? 'New Request' : app.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button size="sm" variant="primary" icon={ArrowRight} onClick={() => onSelectApproval(appId)}>
                          Review Deal
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Card>
    </div>
  );
};

export default ApprovalsListView;
