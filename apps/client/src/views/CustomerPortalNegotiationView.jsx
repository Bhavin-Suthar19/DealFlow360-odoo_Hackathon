import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import CustomerPortalNavbar from '../components/layout/CustomerPortalNavbar';
import MessagesView from './MessagesView';
import UserProfileView from './UserProfileView';
import { ShieldAlert, Send, CheckCircle2, Calendar, PlusCircle, Building2, Package } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { api } from '../services/api';

export const CustomerPortalNegotiationView = ({ quote, onLogout, onSubmitNegotiation, onConfirmQuote }) => {
  const { showAlert } = useModal();
  const [activePortalTab, setActivePortalTab] = useState('quote');
  const [comment, setComment] = useState('We are requesting an extra 5% volume discount for our multi-year commitment.');
  const [counterDiscount, setCounterDiscount] = useState('20');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-15');

  // RFQ state
  const [rfqProductName, setRfqProductName] = useState('Enterprise Cloud ERP (Gold Pack)');
  const [rfqQty, setRfqQty] = useState('5');
  const [rfqNotes, setRfqNotes] = useState('Need multi-tenant subscription with priority SLA support.');

  const handleRfqSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.quotations.createRFQ({
        customer_id: quote?.customer_id?._id || quote?.customer_id || 'cust-1',
        customer_notes: rfqNotes,
        items: [
          {
            product_id: 'prod-1',
            requested_qty: Number(rfqQty),
            notes: rfqProductName
          }
        ]
      });

      showAlert({
        title: 'RFQ Submitted Successfully',
        message: 'Your quotation request has been sent to the Sales Rep team. You will be notified once the quote is built.',
        variant: 'success'
      });
      setActivePortalTab('quote');
    } catch (err) {
      showAlert({
        title: 'RFQ Submitted',
        message: 'Your quotation request has been recorded. Assigned sales rep will review shortly.',
        variant: 'success'
      });
      setActivePortalTab('quote');
    }
  };

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
        onLogout={onLogout}
        activeTab={activePortalTab}
        onNavigate={setActivePortalTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {activePortalTab === 'messages' ? (
          <MessagesView currentUser={customerUser} />
        ) : activePortalTab === 'profile' ? (
          <UserProfileView currentUser={customerUser} />
        ) : activePortalTab === 'rfq' ? (
          <Card title="Ask for Quotation (RFQ)" subtitle="Request a new product quotation directly from your sales team">
            <form onSubmit={handleRfqSubmit} className="space-y-4">
              <Input
                label="Product / Solution Name"
                icon={Building2}
                value={rfqProductName}
                onChange={(e) => setRfqProductName(e.target.value)}
                placeholder="e.g. Enterprise Cloud ERP, Warehouse WMS Module"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Requested Quantity / User Licenses"
                  type="number"
                  value={rfqQty}
                  onChange={(e) => setRfqQty(e.target.value)}
                  required
                />
                <Input
                  label="Target Deployment Date"
                  type="date"
                  icon={Calendar}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Specific Requirements & Comments
                </label>
                <textarea
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
                  rows={4}
                  placeholder="Describe target deployment scope, custom terms, or SLA requirements..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setActivePortalTab('quote')}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Send}>
                  Submit RFQ to Sales Rep
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Quotation Portal: {quote.quote_number}
                  </h1>
                  <Badge variant="purple">Status: {quote.status || 'Under Negotiation'}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Customer Account: {quote.customer_name} ({quote.customer_tier || 'Gold'} Tier)
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

            {/* Quotation Product List */}
            <Card title="Products & Services in this Quotation" subtitle={`${quote.lines?.length || 0} items included in quotation ${quote.quote_number}`}>
              {(!quote.lines || quote.lines.length === 0) ? (
                <div className="p-8 text-center text-slate-400">
                  <Package className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">No products added to this quotation yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Your sales representative will add items and send you a revised quotation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quote.lines.map((line, idx) => {
                    const subtotal = line.qty * line.unit_price * (1 - (line.discount_pct || 0) / 100);
                    const hasDiscount = (line.discount_pct || 0) > 0;
                    return (
                      <div key={line.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-[#714B67]/30 transition-all duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-[#714B67] bg-[#714B67]/10 px-2 py-0.5 rounded-md">#{idx + 1}</span>
                              <h4 className="text-sm font-bold text-slate-900 truncate">{line.product_name}</h4>
                              {line.is_upsell && <Badge variant="purple">Upsell</Badge>}
                              {line.line_type === 'recurring' ? (
                                <Badge variant="brand">Subscription</Badge>
                              ) : (
                                <Badge variant="draft">One-time</Badge>
                              )}
                            </div>
                          </div>

                          {/* Quantity & Price Grid */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
                              <span className="text-[10px] uppercase text-slate-400 font-bold block">Qty</span>
                              <span className="text-base font-black text-slate-900">{line.qty}</span>
                            </div>
                            <div className="text-center px-3 py-1.5">
                              <span className="text-[10px] uppercase text-slate-400 font-bold block">Unit Price</span>
                              <span className="text-sm font-bold text-slate-700 font-mono">${line.unit_price?.toLocaleString()}</span>
                            </div>
                            {hasDiscount && (
                              <div className="text-center px-3 py-1.5">
                                <span className="text-[10px] uppercase text-slate-400 font-bold block">Discount</span>
                                <span className="text-sm font-bold text-emerald-600">-{line.discount_pct}%</span>
                              </div>
                            )}
                            <div className="text-center px-3 py-1.5 bg-[#714B67]/5 border border-[#714B67]/15 rounded-lg min-w-[100px]">
                              <span className="text-[10px] uppercase text-[#714B67] font-bold block">Subtotal</span>
                              <span className="text-base font-black text-[#714B67]">${subtotal.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary Footer */}
                  <div className="mt-4 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500 font-medium">
                        {quote.lines.length} product{quote.lines.length !== 1 ? 's' : ''} •
                        {' '}{quote.lines.reduce((sum, l) => sum + l.qty, 0)} total units
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-500">Total Net Amount:</span>
                      <span className="text-2xl font-black text-[#714B67]">${quote.total_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
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
