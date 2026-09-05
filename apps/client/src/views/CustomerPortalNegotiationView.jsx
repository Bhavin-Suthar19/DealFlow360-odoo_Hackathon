import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import CustomerPortalNavbar from '../components/layout/CustomerPortalNavbar';
import MessagesView from './MessagesView';
import UserProfileView from './UserProfileView';
import { ShieldAlert, Send, CheckCircle2, Calendar } from 'lucide-react';

export const CustomerPortalNegotiationView = ({ quote, onSwitchToInternal, onSubmitNegotiation, onConfirmQuote }) => {
  const [activePortalTab, setActivePortalTab] = useState('quote');
  const [comment, setComment] = useState('We are requesting an extra 5% volume discount for our multi-year commitment.');
  const [counterDiscount, setCounterDiscount] = useState('20');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-15');

  if (!quote) {
    return (
      <div className="p-8 text-center text-slate-500">
        No quotation selected for portal negotiation.
      </div>
    );
  }

  const customerUser = {
    name: quote.customer_name || 'Acme Corp',
    role: 'customer',
    email: 'billing@acme.com'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Customer Portal Top Nav */}
      <CustomerPortalNavbar
        customerName={quote.customer_name}
        onSwitchToInternal={onSwitchToInternal}
        activeTab={activePortalTab}
        onNavigate={setActivePortalTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {activePortalTab === 'messages' ? (
          <MessagesView currentUser={customerUser} />
        ) : activePortalTab === 'profile' ? (
          <UserProfileView currentUser={customerUser} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Quotation Portal: {quote.quote_number}
                  </h1>
                  <Badge variant="purple">Status: Under Negotiation</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Customer Account: {quote.customer_name} (Gold Tier)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="success" icon={CheckCircle2} onClick={() => onConfirmQuote(quote.id)}>
                  Confirm & Accept Terms
                </Button>
              </div>
            </div>

            {/* Governance Warning Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900">Governance Policy Notice</h4>
                <p className="text-xs text-amber-700">
                  If requested counter-discount terms exceed approved tier ceilings (15%), your quotation will re-enter internal manager approval.
                </p>
              </div>
            </div>

            {/* Quotation Line Items Table */}
            <Card title="Quotation Line Items & Terms" subtitle="Review line item pricing and submit counter proposals">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Item Description</th>
                      <th className="py-3.5 px-4 text-center">Qty</th>
                      <th className="py-3.5 px-4">Unit Price</th>
                      <th className="py-3.5 px-4">Proposed Discount %</th>
                      <th className="py-3.5 px-4 text-right">Line Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {quote.lines.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{l.product_name}</td>
                        <td className="py-3.5 px-4 text-center font-bold">{l.qty}</td>
                        <td className="py-3.5 px-4 font-mono">${l.unit_price?.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-amber-600 font-bold">{l.discount_pct}%</td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                          ${(l.qty * l.unit_price * (1 - l.discount_pct / 100)).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Total Net Amount:</span>
                <span className="text-2xl font-black text-[#714B67]">${quote.total_amount?.toLocaleString()}</span>
              </div>
            </Card>

            {/* Counter Negotiation Form */}
            <Card title="Submit Negotiation & Counter-Proposal" subtitle="Send line-level comments and counter discount request">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Requested Counter Discount %"
                    type="number"
                    value={counterDiscount}
                    onChange={(e) => setCounterDiscount(e.target.value)}
                  />
                  <Input
                    label="Requested Delivery Date"
                    type="date"
                    icon={Calendar}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Customer Comments / Justification
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="primary"
                    icon={Send}
                    onClick={() =>
                      onSubmitNegotiation(quote.id, {
                        comment,
                        counter_discount_pct: Number(counterDiscount),
                        requested_delivery_date: deliveryDate
                      })
                    }
                  >
                    Submit Negotiation Request
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default CustomerPortalNegotiationView;
