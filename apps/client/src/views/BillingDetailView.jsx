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

  const subId = subscription._id || subscription.id;
  const customerName = subscription.customer_name || subscription.customer_id?.name || 'Customer';
  const quoteNumber = subscription.quote_number || (typeof subscription.quotation_id === 'object' ? subscription.quotation_id?.quote_number : subscription.quotation_id) || 'Q-Linked';
  const planName = subscription.plan_name || subscription.plan_id?.name || 'Enterprise Plan';
  const cycle = subscription.cycle || subscription.plan_id?.cycle || 'monthly';
  const nextDate = subscription.next_bill_date ? new Date(subscription.next_bill_date).toLocaleDateString() : 'Next Billing Period';
  const amount = Number(subscription.amount || subscription.recurring_amount || subscription.plan_id?.base_fee || 0);

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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subscription: {subId}</h1>
              <Badge variant={subscription.status === 'Active' ? 'success' : 'danger'}>{subscription.status}</Badge>
            </div>
            <span className="text-xs text-slate-500">Customer: {customerName} | Origin Quote: {quoteNumber}</span>
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
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{planName}</span>
              <Badge variant="purple">{cycle}</Badge>
            </div>
            <p className="text-xs text-slate-600">Recurring enterprise software seat licenses.</p>
            <div className="flex items-center justify-between pt-2 border-t border-purple-200">
              <span className="text-xs text-slate-500">Next Billing Date:</span>
              <span className="text-sm font-bold text-[#714B67]">{nextDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Cycle Amount:</span>
              <span className="text-xl font-black text-slate-900">${amount.toLocaleString()} / {cycle}</span>
            </div>
          </div>
        </Card>

        {/* One-Time Lines */}
        <Card title="Associated One-Time Charges" subtitle="Hardware and deployment fees fulfilled">
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">Enterprise Edge Server X-900 (x3)</span>
                <span className="block text-[10px] text-slate-500">Hardware Purchase</span>
              </div>
              <span className="text-sm font-bold text-slate-900">$28,125</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">Onsite Implementation & Deployment</span>
                <span className="block text-[10px] text-slate-500">Professional Services</span>
              </div>
              <span className="text-sm font-bold text-slate-900">$13,775</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule Ledger */}
      <Card title="Automated Billing Schedule Ledger" subtitle="Upcoming scheduled invoice charges">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Bill Date</th>
                <th className="py-3 px-4">Billing Description</th>
                <th className="py-3 px-4 text-center">Cycle Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-[#714B67] font-bold">{subscription.next_bill_date}</td>
                <td className="py-3 px-4 text-slate-800">{subscription.plan_name} Recurring Charge</td>
                <td className="py-3 px-4 text-center text-xs uppercase font-bold text-slate-500">{subscription.cycle}</td>
                <td className="py-3 px-4 text-right font-black text-slate-900">${subscription.amount.toLocaleString()}</td>
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
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Mid-Cycle Cancellation Proration Warning
            </div>
            <p className="text-xs text-rose-600">
              Cancelling mid-cycle will calculate 16 unused days and auto-generate a Credit Note refund for <span className="font-bold text-slate-900">$160.00</span>.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Cancellation</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Provide reason for cancellation..."
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
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
