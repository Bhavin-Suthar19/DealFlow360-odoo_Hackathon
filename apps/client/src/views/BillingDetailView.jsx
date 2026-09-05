import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { ArrowLeft, XCircle, Sliders, AlertTriangle } from 'lucide-react';

export const BillingDetailView = ({ subscription, onBack, onCancelSubscription }) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!subscription) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Subscription: {subscription.id}</h1>
              <Badge variant="success">{subscription.status}</Badge>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Customer: {subscription.customer_name} | Origin Quote: {subscription.quotation_id}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Sliders}>
            Modify Plan
          </Button>
          <Button variant="danger" icon={XCircle} onClick={() => setIsCancelModalOpen(true)}>
            Cancel Subscription
          </Button>
        </div>
      </div>

      {/* Grid: One-Time vs Recurring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recurring Subscription Lines */}
        <Card title="Recurring Subscription Lines" subtitle="Billed automatically on cycle schedule">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">{subscription.plan_name}</span>
              <Badge variant="purple">{subscription.cycle}</Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Recurring enterprise software seat licenses.</p>
            <div className="flex items-center justify-between pt-2 border-t border-indigo-200 dark:border-indigo-900/40">
              <span className="text-xs text-slate-500 dark:text-slate-400">Next Billing Date:</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">{subscription.next_bill_date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Cycle Amount:</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">${subscription.amount.toLocaleString()} / {subscription.cycle}</span>
            </div>
          </div>
        </Card>

        {/* One-Time Lines */}
        <Card title="Associated One-Time Charges" subtitle="Hardware and deployment fees fulfilled">
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Enterprise Edge Server X-900 (x3)</span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">Hardware Purchase</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">$28,125</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">Onsite Implementation & Deployment</span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">Professional Services</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">$13,775</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule Ledger */}
      <Card title="Automated Billing Schedule Ledger" subtitle="Upcoming scheduled invoice charges">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Bill Date</th>
                <th className="py-3 px-4">Billing Description</th>
                <th className="py-3 px-4 text-center">Cycle Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{subscription.next_bill_date}</td>
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{subscription.plan_name} Recurring Charge</td>
                <td className="py-3 px-4 text-center text-xs uppercase font-bold text-slate-500">{subscription.cycle}</td>
                <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">${subscription.amount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <Badge variant="warning">Upcoming (Unpaid)</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Proration Cancellation Modal */}
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Cancel Subscription & Calculate Proration">
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Mid-Cycle Cancellation Proration Warning
            </div>
            <p className="text-xs text-rose-600 dark:text-rose-200/80">
              Cancelling mid-cycle will calculate 16 unused days and auto-generate a Credit Note refund for <span className="font-bold text-slate-900 dark:text-white">$160.00</span>.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason for Cancellation</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Provide reason for cancellation..."
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsCancelModalOpen(false)}>
              Back
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onCancelSubscription(subscription.id, cancelReason);
                setIsCancelModalOpen(false);
              }}
            >
              Confirm Cancellation & Issue Credit Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BillingDetailView;
