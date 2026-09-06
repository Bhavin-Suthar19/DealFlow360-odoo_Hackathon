import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import Pagination from '../components/ui/Pagination';
import usePagination from '../hooks/usePagination';
import {
  ShieldAlert,
  Clock,
  AlertTriangle,
  Send,
  Bell,
  RefreshCw,
  ShieldCheck,
  Search,
  X,
  List,
  LayoutGrid
} from 'lucide-react';

export const DealHealthDashboardView = ({ alerts = [], quotations = [], onEscalate, onNudge, onRecalculate }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('list'); // 'list' | 'card'

  const stalledCount = alerts.filter((a) => a.alert_type === 'Stalled Deal').length;
  const anomalyCount = alerts.filter((a) => a.alert_type === 'Discount Anomaly').length;

  const filteredAlerts = useMemo(() => {
    return alerts.filter((al) => {
      let matchesTab = true;
      if (activeTab === 'Stalled') matchesTab = al.alert_type === 'Stalled Deal' || al.alert_type === 'Stalled Negotiation';
      else if (activeTab === 'Anomaly') matchesTab = al.alert_type === 'Discount Anomaly';
      else if (activeTab === 'Escalated') matchesTab = al.status === 'Escalated';

      if (!searchQuery.trim()) return matchesTab;
      const q = searchQuery.toLowerCase().trim();

      let matchesSearch = false;
      for (const key of Object.keys(al || {})) {
        const val = al[key];
        if (typeof val === 'string' && val.toLowerCase().includes(q)) {
          matchesSearch = true;
          break;
        }
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          for (const subKey of Object.keys(val)) {
            const subVal = val[subKey];
            if (typeof subVal === 'string' && subVal.toLowerCase().includes(q)) {
              matchesSearch = true;
              break;
            }
          }
        }
      }

      return matchesTab && matchesSearch;
    });
  }, [alerts, activeTab, searchQuery]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedAlerts,
    onPageChange,
    onPageSizeChange,
    resetPage
  } = usePagination(filteredAlerts, 10);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetPage();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deal Health & Anomaly Engine</h1>
          <p className="text-sm text-slate-500">Autonomous detection of stalled quotes, margin slippages, and anomalies</p>
        </div>
        <Button variant="primary" icon={RefreshCw} onClick={onRecalculate}>
          Run Detection Recalculation
        </Button>
      </div>

      {/* Metrics List Layout */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Stalled Deals */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
                  Stalled Deals (&gt;7 Days Idle)
                </span>
                <Badge variant="danger" className="mt-1">Escalation Required</Badge>
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{stalledCount}</span>
          </div>

          {/* Discount Anomalies */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
                  Discount Anomalies
                </span>
                <Badge variant="warning" className="mt-1">Margin Slippage</Badge>
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{anomalyCount}</span>
          </div>

          {/* Delivery Slippage Risk */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-[#714B67]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#714B67] uppercase tracking-wider block">
                  Delivery Slippage Risk
                </span>
                <Badge variant="success" className="mt-1">All Stock Reserved</Badge>
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900 font-mono">0</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs, Search & Layout Switcher */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'All', label: 'All Alerts', badge: alerts.length },
              { id: 'Stalled', label: 'Stalled Deals', badge: stalledCount },
              { id: 'Anomaly', label: 'Discount Anomalies', badge: anomalyCount },
              { id: 'Escalated', label: 'Escalated', badge: alerts.filter((a) => a.status === 'Escalated').length }
            ]}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  resetPage();
                }}
                placeholder="Search alert by quote #, customer, or detail..."
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#714B67] transition-all"
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

            {/* Layout Mode Switcher */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
              <button
                type="button"
                onClick={() => setLayoutMode('list')}
                title="List layout"
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  layoutMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('card')}
                title="Card layout"
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  layoutMode === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Flagged Anomaly Display (List or Card Layout) */}
      <Card title="Flagged Deal Health Anomalies" subtitle="Real-time alerts generated by autonomous background detection engine">
        {layoutMode === 'card' ? (
          <div className="p-4 space-y-4">
            {paginatedAlerts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic">
                {searchQuery ? `No alerts matching "${searchQuery}".` : 'No health anomalies found in this category.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedAlerts.map((al) => {
                  const alertId = al._id || al.id;
                  const quoteNumber = al.quote_number || al.quotation_id?.quote_number || 'Quote Alert';
                  const customerName = al.customer_name || al.quotation_id?.customer_name || 'Enterprise Customer';
                  const detail = al.detail || al.details || 'Anomaly detected in deal velocity or margin structure.';
                  const dateStr = al.flagged_at || al.createdAt ? new Date(al.flagged_at || al.createdAt).toLocaleDateString() : 'Active';

                  const linkedQuote = quotations.find(
                    (q) =>
                      q._id === al.quotation_id ||
                      q.id === al.quotation_id ||
                      (q.quote_number && q.quote_number === quoteNumber)
                  );
                  const quoteStatus = linkedQuote?.status || (typeof al.quotation_id === 'object' ? al.quotation_id?.status : null);
                  const isEscalated =
                    al.status === 'Escalated' ||
                    ['Pending Manager Approval', 'Pending Finance Approval', 'Approved', 'Confirmed'].includes(quoteStatus);

                  return (
                    <div
                      key={alertId}
                      className="border border-slate-200 rounded-xl p-4 bg-white hover:border-[#714B67]/30 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-sm text-[#714B67]">{quoteNumber}</span>
                          <Badge variant={al.alert_type === 'Stalled Deal' || al.alert_type === 'Stalled Negotiation' ? 'danger' : 'warning'}>
                            {al.alert_type}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900">{customerName}</h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{detail}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{dateStr}</span>
                        {isEscalated ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Escalated
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Button size="sm" variant="warning" icon={Bell} onClick={() => onNudge(alertId)}>
                              Nudge
                            </Button>
                            <Button size="sm" variant="danger" icon={Send} onClick={() => onEscalate(alertId)}>
                              Escalate
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Quote #</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Alert Type</th>
                  <th className="py-3.5 px-4">Anomaly Detail</th>
                  <th className="py-3.5 px-4">Flagged Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      {searchQuery ? `No alerts matching "${searchQuery}".` : 'No health anomalies found in this category.'}
                    </td>
                  </tr>
                ) : (
                  paginatedAlerts.map((al) => {
                    const alertId = al._id || al.id;
                    const quoteNumber = al.quote_number || al.quotation_id?.quote_number || 'Quote Alert';
                    const customerName = al.customer_name || al.quotation_id?.customer_name || 'Enterprise Customer';
                    const detail = al.detail || al.details || 'Anomaly detected in deal velocity or margin structure.';
                    const dateStr = al.flagged_at || al.createdAt ? new Date(al.flagged_at || al.createdAt).toLocaleDateString() : 'Active';

                    const linkedQuote = quotations.find(
                      (q) =>
                        q._id === al.quotation_id ||
                        q.id === al.quotation_id ||
                        (q.quote_number && q.quote_number === quoteNumber)
                    );
                    const quoteStatus = linkedQuote?.status || (typeof al.quotation_id === 'object' ? al.quotation_id?.status : null);
                    const isEscalated =
                      al.status === 'Escalated' ||
                      ['Pending Manager Approval', 'Pending Finance Approval', 'Approved', 'Confirmed'].includes(quoteStatus);

                    return (
                      <tr key={alertId} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-[#714B67]">{quoteNumber}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">{customerName}</td>
                        <td className="py-3.5 px-4">
                          <Badge variant={al.alert_type === 'Stalled Deal' || al.alert_type === 'Stalled Negotiation' ? 'danger' : 'warning'}>
                            {al.alert_type}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">{detail}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">{dateStr}</td>
                        <td className="py-3.5 px-4">
                          <Badge variant={al.status === 'Escalated' || isEscalated ? 'danger' : al.status === 'Nudged' ? 'purple' : 'default'}>
                            {isEscalated ? 'Escalated' : al.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isEscalated ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Escalated to Leadership
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="warning" icon={Bell} onClick={() => onNudge(alertId)}>
                                Nudge Rep
                              </Button>
                              <Button size="sm" variant="danger" icon={Send} onClick={() => onEscalate(alertId)}>
                                Escalate
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

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

export default DealHealthDashboardView;
