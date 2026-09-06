import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { api } from '../services/api';
import {
  ArrowLeft,
  Download,
  CreditCard,
  Check,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  RefreshCw,
  Building2,
  Calendar,
  Receipt
} from 'lucide-react';

export const InvoiceDetailView = ({
  invoice,
  invoiceId,
  onBack,
  onRecordPayment,
  onSelectQuote
}) => {
  const targetId = invoice?._id || invoice?.id || invoiceId;
  const [activeInv, setActiveInv] = useState(invoice || null);
  const [isLoading, setIsLoading] = useState(!invoice || !invoice.lines);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Payment Recording Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Sync state if invoice prop changes
  useEffect(() => {
    if (invoice) {
      setActiveInv(invoice);
    }
  }, [invoice]);

  // Fetch full invoice detail from backend by ID
  const fetchInvoiceDetail = async (idToFetch, showLoader = true) => {
    if (!idToFetch) return;
    if (showLoader) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await api.billing.getInvoiceById(idToFetch);
      if (res?.data) {
        const invObj = res.data.invoice || res.data;
        const populated = {
          ...invObj,
          lines: res.data.lines || invObj.lines || [],
          payments: res.data.payments || invObj.payments || [],
          creditNotes: res.data.creditNotes || []
        };
        setActiveInv(populated);
      }
    } catch (err) {
      console.warn('Could not fetch full invoice by ID:', err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (targetId) {
      fetchInvoiceDetail(targetId, !activeInv || !activeInv.lines);
    }
  }, [targetId]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentInvoice = activeInv || invoice;

  if (isLoading && !currentInvoice) {
    return (
      <div className="p-16 text-center text-slate-500">
        <RefreshCw className="w-10 h-10 mx-auto text-[#714B67] animate-spin mb-3" />
        <p className="font-semibold text-slate-700">Loading invoice details & ledger...</p>
      </div>
    );
  }

  if (!currentInvoice) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
        <p className="font-semibold text-slate-700">No invoice found or selected.</p>
        <Button variant="ghost" icon={ArrowLeft} onClick={onBack} className="mt-4">
          Back to Invoices
        </Button>
      </div>
    );
  }

  const invId = currentInvoice._id || currentInvoice.id || targetId;
  const customerName =
    currentInvoice.customer_name ||
    currentInvoice.customer_id?.name ||
    currentInvoice.customer_id?.company_name ||
    currentInvoice.quotation_id?.customer_name ||
    'Enterprise Customer';
  const quoteNumber =
    currentInvoice.quote_number ||
    currentInvoice.quotation_id?.quote_number ||
    'Origin Quote';
  const originQuoteId =
    currentInvoice.quotation_id?._id ||
    currentInvoice.quotation_id?.id ||
    (typeof currentInvoice.quotation_id === 'string' ? currentInvoice.quotation_id : null);
  const totalAmount = Number(currentInvoice.amount || 0);

  const payments = currentInvoice.payments || [];
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount_paid || p.amount || 0), 0);
  const isPaid = currentInvoice.status === 'Paid' || (totalAmount > 0 && totalPaid >= totalAmount);
  const balanceDue = isPaid ? 0 : Math.max(0, totalAmount - totalPaid);

  const lines =
    currentInvoice.lines && currentInvoice.lines.length > 0
      ? currentInvoice.lines
      : [
        {
          id: `line-${String(invId).slice(-4)}`,
          description: `B2B Contract Settlement: ${currentInvoice.invoice_number || 'INV'} • ${customerName}`,
          amount: totalAmount
        }
      ];

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleOpenPaymentModal = () => {
    setPaymentAmount(balanceDue > 0 ? balanceDue : totalAmount);
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!invId || Number(paymentAmount) <= 0) return;
    setIsSubmittingPayment(true);
    try {
      if (onRecordPayment) {
        await onRecordPayment(invId, Number(paymentAmount), paymentMethod);
      } else {
        await api.billing.recordPayment(invId, {
          amount: Number(paymentAmount),
          amount_paid: Number(paymentAmount),
          method: paymentMethod,
          payment_method: paymentMethod,
          reference: `RECON-${Date.now().toString().slice(-6)}`
        });
      }
      // Re-fetch latest invoice detail to reflect the new payment immediately
      await fetchInvoiceDetail(invId, false);
      setIsPaymentModalOpen(false);
    } catch (err) {
      console.warn('Payment recording error:', err);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentInvoice.invoice_number || `INV-${String(invId).slice(-4)}`}
              </h1>
              <Badge variant={isPaid ? 'success' : 'danger'}>
                {isPaid ? 'Paid & Reconciled' : 'Unpaid Open Balance'}
              </Badge>
              {isRefreshing && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Syncing
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer: <strong className="text-slate-800">{customerName}</strong> • Origin Quote:{' '}
              <strong className="text-[#714B67]">{quoteNumber}</strong> • Due:{' '}
              {currentInvoice.due_date ? new Date(currentInvoice.due_date).toLocaleDateString() : 'Net 30'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {originQuoteId && onSelectQuote && (
            <Button
              variant="outline"
              icon={FileText}
              onClick={() => onSelectQuote(originQuoteId)}
            >
              View Quote ({quoteNumber})
            </Button>
          )}

          <Button variant="secondary" icon={Download} onClick={handleDownloadPDF}>
            Download PDF
          </Button>


        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Billed</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">
            ${totalAmount.toLocaleString()}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Reconciled</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block font-mono">
            ${totalPaid.toLocaleString()}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Remaining Balance Due</span>
          <span
            className={`text-2xl font-extrabold mt-1 block font-mono ${balanceDue > 0 ? 'text-amber-600' : 'text-slate-400'
              }`}
          >
            ${balanceDue.toLocaleString()}
          </span>
        </Card>
      </div>

      {/* Payment & Delivery Reconciliation Timeline */}
      <Card title="Payment & Delivery Reconciliation Timeline" subtitle="End-to-end deal progression">
        <div className="flex items-center justify-between py-6 px-4 max-w-3xl mx-auto">
          {/* Stage 1 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600">Order Confirmed</span>
          </div>

          <div className="flex-1 h-0.5 bg-emerald-500/50 mx-2" />

          {/* Stage 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600">Shipped</span>
          </div>

          <div className="flex-1 h-0.5 bg-emerald-500/50 mx-2" />

          {/* Stage 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600">Invoiced</span>
          </div>

          <div className={`flex-1 h-0.5 mx-2 ${isPaid ? 'bg-emerald-500/50' : 'bg-slate-200'}`} />

          {/* Stage 4 */}
          <div className={`flex flex-col items-center gap-2 ${isPaid ? '' : 'opacity-50'}`}>
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${isPaid
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
                  : 'bg-slate-100 border-slate-300 text-slate-500'
                }`}
            >
              {isPaid ? <Check className="w-5 h-5" /> : '4'}
            </div>
            <span className={`text-xs font-semibold ${isPaid ? 'text-emerald-600' : 'text-slate-500'}`}>
              Paid & Reconciled
            </span>
          </div>
        </div>
      </Card>

      {/* Itemized Line Table */}
      <Card title="Invoice Line Reconciliation" subtitle="Itemized charges billed">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Line Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {lines.map((l, idx) => (
                <tr key={l.id || l._id || idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{l.description}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-mono">
                    ${Number(l.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm text-slate-500 font-medium">Total Invoice Balance Due:</span>
          <span className="text-2xl font-black text-[#714B67] font-mono">${balanceDue.toLocaleString()}</span>
        </div>
      </Card>

      {/* Payments History Ledger */}
      {payments.length > 0 && (
        <Card title="Payment Reconciliation Records" subtitle="Recorded settlement transactions">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Transaction Date</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map((p, idx) => (
                  <tr key={p._id || idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                      {p.payment_date ? new Date(p.payment_date).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 capitalize">
                      {(p.method || 'Bank Transfer').replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 font-mono">
                      ${Number(p.amount_paid || p.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="success">Reconciled</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => !isSubmittingPayment && setIsPaymentModalOpen(false)}
        title="Record Invoice Payment"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Record a partial or full payment settlement for invoice{' '}
            <strong className="text-slate-800">{currentInvoice.invoice_number}</strong>. Outstanding balance:{' '}
            <strong className="text-amber-600 font-mono">${balanceDue.toLocaleString()}</strong>.
          </p>

          <Input
            label="Payment Amount ($)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            required
            min={1}
            max={balanceDue > 0 ? balanceDue : totalAmount}
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
            >
              <option value="bank_transfer">Wire Bank Transfer</option>
              <option value="credit_card">Credit Card (Stripe)</option>
              <option value="ach">ACH Auto-Debit</option>
              <option value="check">Company Check</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsPaymentModalOpen(false)}
              disabled={isSubmittingPayment}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleSubmitPayment}
              disabled={isSubmittingPayment || Number(paymentAmount) <= 0}
            >
              {isSubmittingPayment ? 'Processing Settlement...' : 'Confirm & Reconcile Payment'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceDetailView;
