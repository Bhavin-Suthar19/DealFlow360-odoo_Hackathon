import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { LayoutGrid, List, Plus, ArrowRight } from 'lucide-react';

export const QuotationsKanbanView = ({ quotations = [], onSelectQuote, onCreateQuote }) => {
  const [viewMode, setViewMode] = useState('kanban');

  const columns = [
    { id: 'Draft', title: 'Draft', color: 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40' },
    { id: 'Pending Approval', title: 'Pending Approval', color: 'border-amber-300 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/10' },
    { id: 'Approved', title: 'Approved', color: 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/10' },
    { id: 'Negotiation', title: 'Negotiation', color: 'border-purple-300 dark:border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/10' },
    { id: 'Confirmed', title: 'Confirmed', color: 'border-cyan-300 dark:border-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/10' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Quotations Manager</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure, price, and track deal stages</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>
          </div>

          <Button variant="primary" icon={Plus} onClick={onCreateQuote}>
            New Quotation
          </Button>
        </div>
      </div>

      {/* View Rendering */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colQuotes = quotations.filter((q) => q.status === col.id);
            return (
              <div key={col.id} className={`rounded-xl border p-3.5 min-w-[240px] flex flex-col gap-3 ${col.color}`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/60">
                  <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{col.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {colQuotes.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[300px]">
                  {colQuotes.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 italic py-10">
                      No deals in {col.title}
                    </div>
                  ) : (
                    colQuotes.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => onSelectQuote(q.id)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{q.quote_number}</span>
                          <Badge variant={q.customer_tier === 'Gold' ? 'warning' : 'default'}>{q.customer_tier}</Badge>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{q.customer_name}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Rep: {q.sales_rep_name}</span>
                        </div>
                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900 dark:text-white">${q.total_amount.toLocaleString()}</span>
                          <Badge variant={q.blended_risk_score > 15 ? 'danger' : q.blended_risk_score > 5 ? 'warning' : 'success'}>
                            Risk: {q.blended_risk_score}%
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Quote #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Tier</th>
                  <th className="py-3.5 px-4">Sales Rep</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">{q.quote_number}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{q.customer_name}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={q.customer_tier === 'Gold' ? 'warning' : 'default'}>{q.customer_tier}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{q.sales_rep_name}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">${q.total_amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={q.blended_risk_score > 15 ? 'danger' : q.blended_risk_score > 5 ? 'warning' : 'success'}>
                        {q.blended_risk_score}%
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={q.status === 'Approved' ? 'success' : q.status === 'Pending Approval' ? 'warning' : 'primary'}>
                        {q.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button size="sm" variant="ghost" onClick={() => onSelectQuote(q.id)} icon={ArrowRight}>
                        Open Quote
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuotationsKanbanView;
