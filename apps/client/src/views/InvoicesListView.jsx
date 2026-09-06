import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import usePagination from '../hooks/usePagination';
import { ArrowRight, Search, X, DollarSign, CheckCircle, Clock, Plus, CreditCard, FileText, Download, Printer } from 'lucide-react';

export const InvoicesListView = ({ invoices = [], quotations = [], onSelectInvoice, onGenerateInvoice }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial summary metrics
  const totalInvoiced = useMemo(() => invoices.reduce((sum, i) => sum + Number(i.amount || 0), 0), [invoices]);
  const totalPaid = useMemo(() => {
    return invoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);
  }, [invoices]);
  const totalOutstanding = Math.max(0, totalInvoiced - totalPaid);

  // Quotations eligible for invoice generation (Approved/Confirmed without active invoice)
  const eligibleQuotes = useMemo(() => {
    const invoicedQuoteIds = new Set(
      invoices.map((inv) => String(inv.quotation_id?._id || inv.quotation_id?.id || inv.quotation_id))
    );
    return quotations.filter(
      (q) =>
        ['Confirmed', 'Approved', 'Fulfilled'].includes(q.status) &&
        !invoicedQuoteIds.has(String(q._id || q.id))
    );
  }, [quotations, invoices]);

  // Filter invoices by tab & search query
  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const matchesTab = activeTab === 'All' || i.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const quoteNum = (i.quote_number || i.quotation_id?.quote_number || '').toLowerCase();
      const custName = (i.customer_name || i.customer_id?.name || i.customer_id?.company_name || '').toLowerCase();
      const invNum = (i.invoice_number || '').toLowerCase();

      const matchesSearch = !q || invNum.includes(q) || quoteNum.includes(q) || custName.includes(q);
      return matchesTab && matchesSearch;
    });
  }, [invoices, activeTab, searchQuery]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedInvoices,
    onPageChange,
    onPageSizeChange,
    resetPage
  } = usePagination(filteredInvoices, 10);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetPage();
  };

  const handleCreateInvoice = async () => {
    if (!selectedQuoteId || !onGenerateInvoice) return;
    setIsSubmitting(true);
    try {
      await onGenerateInvoice(selectedQuoteId);
      setIsGenerateModalOpen(false);
      setSelectedQuoteId('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCSV = () => {
    const headers = [
      'Invoice Number',
      'Origin Quote',
      'Customer Name',
      'Due Date',
      'Payment Stage',
      'Total Amount ($)',
      'Total Paid ($)',
      'Balance Due ($)',
      'Status'
    ];

    const rows = filteredInvoices.map((inv) => {
      const quoteNumber = inv.quote_number || inv.quotation_id?.quote_number || 'Origin Quote';
      const customerName = inv.customer_name || inv.customer_id?.name || inv.customer_id?.company_name || inv.quotation_id?.customer_name || 'Enterprise Customer';
      const dueDate = inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'Net 30';
      const amount = Number(inv.amount || 0);
      const paid = Number(inv.total_paid || (inv.status === 'Paid' ? amount : 0));
      const balance = Number(inv.balance_due !== undefined ? inv.balance_due : Math.max(0, amount - paid));

      return [
        `"${inv.invoice_number || 'INV'}"`,
        `"${quoteNumber}"`,
        `"${customerName}"`,
        `"${dueDate}"`,
        `"${inv.payment_stage || 'Invoiced'}"`,
        amount,
        paid,
        balance,
        `"${inv.status || 'Unpaid'}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dealflow360_invoices_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoices & Billing Ledger</h1>
          <p className="text-sm text-slate-500">Track customer invoices, due dates, and payment reconciliations</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={handleDownloadCSV}>
            Export CSV
          </Button>
          <Button variant="secondary" icon={Printer} onClick={handlePrint}>
            Print
          </Button>
          {onGenerateInvoice && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsGenerateModalOpen(true)}
            >
              Generate Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Invoiced Ledger
            </span>
            <DollarSign className="w-5 h-5 text-[#714B67]" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">${totalInvoiced.toLocaleString()}</span>
            <Badge variant="brand">{invoices.length} Invoices</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Collected & Reconciled
            </span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600">${totalPaid.toLocaleString()}</span>
            <Badge variant="success">Paid Settlements</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Outstanding Receivables
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-600">${totalOutstanding.toLocaleString()}</span>
            <Badge variant="warning">Open Balance</Badge>
          </div>
        </Card>
      </div>

      {/* Tabs & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'All', label: 'All Invoices', badge: invoices.length },
              { id: 'Unpaid', label: 'Unpaid', badge: invoices.filter((i) => i.status === 'Unpaid').length },
              { id: 'Paid', label: 'Paid', badge: invoices.filter((i) => i.status === 'Paid').length }
            ]}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                resetPage();
              }}
              placeholder="Search by invoice #, quote #, or customer..."
              className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#714B67] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Invoice Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Quote #</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Payment Stage</th>
                <th className="py-3.5 px-4 text-right">Invoice Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 italic">
                    {searchQuery ? `No invoices matching "${searchQuery}".` : 'No invoices found in this view.'}
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => {
                  const invId = inv._id || inv.id;
                  const quoteNumber = inv.quote_number || inv.quotation_id?.quote_number || 'Origin Quote';
                  const customerName = inv.customer_name || inv.customer_id?.name || inv.customer_id?.company_name || inv.quotation_id?.customer_name || 'Enterprise Customer';
                  const dueDate = inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'Net 30';

                  return (
                    <tr key={invId} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-[#714B67] font-mono">{inv.invoice_number}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">{quoteNumber}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{customerName}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{dueDate}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="cyan">{inv.payment_stage || 'Invoiced'}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono">
                        ${Number(inv.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={inv.status === 'Paid' ? 'success' : 'danger'}>{inv.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button size="sm" variant="ghost" icon={ArrowRight} onClick={() => onSelectInvoice(invId)}>
                          Open Detail
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

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Invoice from Confirmed Quotation"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Select an approved or confirmed quotation to generate a formal Net 30 billing invoice and record it in the ledger.
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Select Confirmed Quotation</label>
            <select
              value={selectedQuoteId}
              onChange={(e) => setSelectedQuoteId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
            >
              <option value="">-- Choose a quotation --</option>
              {eligibleQuotes.map((q) => {
                const qId = q._id || q.id;
                const cName = q.customer_name || q.customer_id?.name || 'Customer';
                return (
                  <option key={qId} value={qId}>
                    {q.quote_number} • {cName} • ${Number(q.total_amount || 0).toLocaleString()} ({q.status})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={FileText}
              disabled={!selectedQuoteId || isSubmitting}
              onClick={handleCreateInvoice}
            >
              {isSubmitting ? 'Generating...' : 'Generate Invoice'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoicesListView;

