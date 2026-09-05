import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { LayoutGrid, List, Plus, ArrowRight } from 'lucide-react';

export const QuotationsKanbanView = ({ quotations = [], onSelectQuote, onCreateQuote }) => {
  const [viewMode, setViewMode] = useState('kanban');

  const columns = [
    { id: 'RFQ Received', title: '1. RFQ Received', color: 'border-blue-300 bg-blue-50/40' },
    { id: 'Draft', title: '2. Draft (Rep)', color: 'border-slate-300 bg-slate-100/50' },
    { id: 'Pending Customer Approval', title: '3. Customer Review', color: 'border-purple-300 bg-purple-50/40' },
    { id: 'Under Negotiation', title: '4. Counter / Negotiation', color: 'border-cyan-300 bg-cyan-50/50' },
    { id: 'Pending Manager Approval', title: '5. Manager Review', color: 'border-amber-300 bg-amber-50/50' },
    { id: 'Pending Finance Approval', title: '6. Finance Review', color: 'border-rose-300 bg-rose-50/50' },
    { id: 'Approved', title: '7. Approved / Confirmed', color: 'border-emerald-300 bg-emerald-50/50' }
  ];

  const getStatusBadge = (st) => {
    if (st === 'Approved' || st === 'Confirmed') return <Badge variant="success">Approved</Badge>;
    if (st === 'Pending Customer Approval') return <Badge variant="purple">Customer Review</Badge>;
    if (st === 'Under Negotiation' || st === 'Negotiation') return <Badge variant="negotiation">Under Negotiation</Badge>;
    if (st === 'Pending Manager Approval') return <Badge variant="pending">Manager Review</Badge>;
    if (st === 'Pending Finance Approval') return <Badge variant="danger">Finance Review</Badge>;
    if (st === 'RFQ Received') return <Badge variant="brand">RFQ Received</Badge>;
    return <Badge variant="draft">Draft</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quotations Pipeline Manager</h1>
          <p className="text-sm text-slate-500">Configure, price, and track deal stages across governance workflows</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
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
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">{col.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                    {colQuotes.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[300px]">
                  {colQuotes.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 italic py-10">
                      No deals in {col.title}
                    </div>
                  ) : (
                    colQuotes.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => onSelectQuote(q.id)}
                        className="bg-white border border-slate-200 hover:border-[#714B67]/50 p-4 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#714B67]">{q.quote_number}</span>
                          <Badge variant="brand">{q.customer_tier || 'Gold'}</Badge>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{q.customer_name}</h4>
                          <span className="text-xs text-slate-500">Rep: {q.sales_rep_name}</span>
                        </div>
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900">${q.total_amount?.toLocaleString()}</span>
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
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#714B67]">{q.quote_number}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{q.customer_name}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="brand">{q.customer_tier}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{q.sales_rep_name}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">${q.total_amount?.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={q.blended_risk_score > 15 ? 'danger' : q.blended_risk_score > 5 ? 'warning' : 'success'}>
                        {q.blended_risk_score}%
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(q.status)}</td>
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
