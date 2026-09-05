import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { ArrowLeft, Download, CreditCard, Check } from 'lucide-react';

export const InvoiceDetailView = ({ invoice, onBack, onRecordPayment }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(invoice ? invoice.amount : 0);

  if (!invoice) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        No invoice selected.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{invoice.invoice_number}</h1>
              <Badge variant={invoice.status === 'Paid' ? 'success' : 'danger'}>{invoice.status}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customer: {invoice.customer_name} | Origin Quote: {invoice.quote_number}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download}>
            Download PDF Summary
          </Button>
          {invoice.status !== 'Paid' && (
            <Button variant="success" icon={CreditCard} onClick={() => setIsPaymentModalOpen(true)}>
              Record Payment
            </Button>
          )}
        </div>
      </div>

      {/* Payment & Delivery Reconciliation Timeline */}
      <Card title="Payment & Delivery Reconciliation Timeline" subtitle="Stage reconciliation tracking">
        <div className="flex items-center justify-between py-6 px-4 max-w-3xl mx-auto">
          {/* Stage 1 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Order Confirmed</span>
          </div>

          <div className="flex-1 h-0.5 bg-emerald-500/50 mx-2" />

          {/* Stage 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Shipped</span>
          </div>

          <div className="flex-1 h-0.5 bg-emerald-500/50 mx-2" />

          {/* Stage 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Invoiced</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 mx-2" />

          {/* Stage 4 */}
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Paid</span>
          </div>
        </div>
      </Card>

      {/* Itemized Line Table */}
      <Card title="Invoice Line Reconciliation" subtitle="Itemized charges billed">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Line Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {invoice.lines.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{l.description}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 dark:text-white">${l.amount?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Invoice Balance Due:</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${invoice.amount?.toLocaleString()}</span>
        </div>
      </Card>

      {/* Record Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Record Invoice Payment">
        <div className="space-y-4">
          <Input
            label="Payment Amount ($)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            required
          />
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Payment Method</label>
            <select className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white">
              <option value="bank_transfer">Wire Bank Transfer</option>
              <option value="credit_card">Credit Card (Stripe)</option>
              <option value="ach">ACH Auto-Debit</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                onRecordPayment(invoice.id, paymentAmount);
                setIsPaymentModalOpen(false);
              }}
            >
              Confirm & Reconcile Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceDetailView;
