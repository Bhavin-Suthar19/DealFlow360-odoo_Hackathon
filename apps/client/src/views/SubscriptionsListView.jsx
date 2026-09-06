import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Pagination from '../components/ui/Pagination';
import usePagination from '../hooks/usePagination';
import { ArrowRight, Search, X } from 'lucide-react';

export const SubscriptionsListView = ({ subscriptions = [], onSelectSubscription }) => {
  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubs = useMemo(() => {
    return subscriptions.filter((item) => {
      const matchesTab = item.status === activeTab;
      if (!matchesTab) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
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
  }, [subscriptions, activeTab, searchQuery]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedSubs,
    onPageChange,
    onPageSizeChange,
    resetPage
  } = usePagination(filteredSubs, 10);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetPage();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recurring Subscriptions</h1>
          <p className="text-sm text-slate-500">Automated recurring billing schedules and mid-cycle proration</p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
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
              placeholder="Search subscriptions by ID, customer, plan, cycle, date..."
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

          <Tabs
            tabs={[
              { id: 'Active', label: 'Active Subscriptions', badge: subscriptions.filter((s) => s.status === 'Active').length },
              { id: 'Paused', label: 'Paused', badge: subscriptions.filter((s) => s.status === 'Paused').length },
              { id: 'Cancelled', label: 'Cancelled', badge: subscriptions.filter((s) => s.status === 'Cancelled').length }
            ]}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        </div>
      </Card>

      {/* Subscription Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Subscription ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Subscription Plan</th>
                <th className="py-3.5 px-4">Cycle</th>
                <th className="py-3.5 px-4">Next Bill Date</th>
                <th className="py-3.5 px-4">Recurring Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSubs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    {searchQuery ? `No subscriptions matching "${searchQuery}".` : `No subscriptions found in '${activeTab}' status.`}
                  </td>
                </tr>
              ) : (
                paginatedSubs.map((sub) => {
                  const subId = sub._id || sub.id;
                  const custName = sub.customer_name || sub.customer_id?.name || 'Enterprise Customer';
                  const planName = sub.plan_name || sub.plan_id?.name || 'Enterprise Cloud Plan';
                  const cycle = sub.cycle || sub.plan_id?.cycle || 'monthly';
                  const nextDate = sub.next_bill_date ? new Date(sub.next_bill_date).toLocaleDateString() : 'Next Cycle';
                  const amount = Number(sub.amount || sub.recurring_amount || sub.plan_id?.base_fee || 0);

                  return (
                    <tr key={subId} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono text-xs text-[#714B67] font-bold">{subId}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{custName}</td>
                      <td className="py-3.5 px-4 text-slate-700">{planName}</td>
                      <td className="py-3.5 px-4 uppercase text-xs font-bold text-slate-500">{cycle}</td>
                      <td className="py-3.5 px-4 text-slate-600">{nextDate}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">${amount.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={sub.status === 'Active' ? 'success' : sub.status === 'Paused' ? 'warning' : 'danger'}>
                          {sub.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button size="sm" variant="ghost" icon={ArrowRight} onClick={() => onSelectSubscription(subId)}>
                          Manage
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

export default SubscriptionsListView;
