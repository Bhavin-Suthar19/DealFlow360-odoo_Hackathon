import React, { useState, useRef } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import usePagination from '../hooks/usePagination';
import { LayoutGrid, List, Plus, ArrowRight, Percent, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export const QuotationsKanbanView = ({ quotations = [], currentUser = {}, onSelectQuote, onCreateQuote }) => {
  const [viewMode, setViewMode] = useState('kanban');
  const sliderRef = useRef(null);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedQuotes,
    onPageChange,
    onPageSizeChange
  } = usePagination(quotations, 10);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
          {viewMode === 'kanban' && (
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => scrollSlider('left')}
                title="Slide Left"
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-bold text-slate-500 px-2 select-none">
                7 Stages
              </span>
              <button
                type="button"
                onClick={() => scrollSlider('right')}
                title="Slide Right"
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

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

          {currentUser?.role === 'sales_rep' && onCreateQuote && (
            <Button variant="primary" icon={Plus} onClick={onCreateQuote}>
              New Quotation
            </Button>
          )}
        </div>
      </div>

      {/* View Rendering */}
      {viewMode === 'kanban' ? (
        <div className="space-y-2">
          <div
            ref={sliderRef}
            className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {columns.map((col) => {
              const colQuotes = quotations.filter((q) => {
                if (col.id === 'Approved') return q.status === 'Approved' || q.status === 'Confirmed';
                if (col.id === 'Under Negotiation') return q.status === 'Under Negotiation' || q.status === 'Negotiation';
                return q.status === col.id;
              });

              return (
                <div
                  key={col.id}
                  className={`rounded-2xl border p-4 w-72 sm:w-80 min-w-[280px] max-w-[320px] shrink-0 flex flex-col gap-3 shadow-xs ${col.color}`}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">{col.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                      {colQuotes.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 min-h-[360px]">
                    {colQuotes.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 italic py-16 bg-white/40 rounded-xl border border-dashed border-slate-300/60">
                        No deals in {col.title}
                      </div>
                    ) : (
                      colQuotes.map((q) => {
                        const qKey = q.id || q._id;
                        return (
                          <div
                            key={qKey}
                            onClick={() => onSelectQuote(qKey)}
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
                            {(q.counter_offer || q.counter_discount_pct) && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold">
                                <Percent className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>Counter: {q.counter_offer?.counter_discount_pct || q.counter_discount_pct}% requested</span>
                              </div>
                            )}
                            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                              {q.status === 'RFQ Received' ? (
                                <span className="text-xs font-bold text-slate-500 italic">Awaiting Pricing</span>
                              ) : (
                                <>
                                  <span className="text-sm font-black text-slate-900">${q.total_amount?.toLocaleString()}</span>
                                  <Badge variant={q.blended_risk_score > 15 ? 'danger' : q.blended_risk_score > 5 ? 'warning' : 'success'}>
                                    Risk: {q.blended_risk_score}%
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Slider Track Indicator & Navigation Hint */}
          <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#714B67]" />
              Scroll horizontally or use arrows to slide through all 7 pipeline stages
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSlider('left')}
                className="hover:text-slate-800 font-semibold cursor-pointer transition-colors"
              >
                ← Slide Left
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => scrollSlider('right')}
                className="hover:text-slate-800 font-semibold cursor-pointer transition-colors"
              >
                Slide Right →
              </button>
            </div>
          </div>
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
                {paginatedQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                      No quotations found.
                    </td>
                  </tr>
                ) : (
                  paginatedQuotes.map((q) => {
                    const qKey = q.id || q._id;
                    return (
                      <tr key={qKey} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#714B67]">{q.quote_number}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{q.customer_name}</td>
                        <td className="py-3.5 px-4">
                          <Badge variant="brand">{q.customer_tier}</Badge>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{q.sales_rep_name}</td>
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {q.status === 'RFQ Received' ? <span className="text-xs text-slate-400 font-normal italic">Pending</span> : `$${q.total_amount?.toLocaleString()}`}
                        </td>
                        <td className="py-3.5 px-4">
                          {q.status === 'RFQ Received' ? (
                            <span className="text-xs text-slate-400 font-normal italic">N/A</span>
                          ) : (
                            <Badge variant={q.blended_risk_score > 15 ? 'danger' : q.blended_risk_score > 5 ? 'warning' : 'success'}>
                              {q.blended_risk_score}%
                            </Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            {getStatusBadge(q.status)}
                            {(q.counter_offer || q.counter_discount_pct) && (
                              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                Counter: {q.counter_offer?.counter_discount_pct || q.counter_discount_pct}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button size="sm" variant="ghost" onClick={() => onSelectQuote(qKey)} icon={ArrowRight}>
                            Open Quote
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
      )}
    </div>
  );
};

export default QuotationsKanbanView;
