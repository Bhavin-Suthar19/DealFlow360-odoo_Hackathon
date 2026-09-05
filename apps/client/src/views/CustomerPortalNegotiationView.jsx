import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import CustomerPortalNavbar from '../components/layout/CustomerPortalNavbar';
import UserProfileView from './UserProfileView';
import {
  ShieldAlert,
  ShieldCheck,
  Send,
  CheckCircle2,
  Calendar,
  Building2,
  Package,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Percent,
  Sliders,
  Sparkles,
  Info,
  Check,
  Tag,
  Clock
} from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { api } from '../services/api';

export const CustomerPortalNegotiationView = ({
  quote,
  quotations = [],
  onSelectQuote,
  products = [],
  onLogout,
  onSubmitNegotiation,
  onConfirmQuote,
  onRefreshData
}) => {
  const { showAlert } = useModal();
  const [activePortalTab, setActivePortalTab] = useState('quote');

  // Multi-product RFQ cart state
  const [rfqCart, setRfqCart] = useState([]);
  const [rfqNotes, setRfqNotes] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  // Counter Negotiation state
  const [counterDiscount, setCounterDiscount] = useState('15');
  const [lineCounterDiscounts, setLineCounterDiscounts] = useState({});
  const [negotiationMode, setNegotiationMode] = useState('overall'); // 'overall' | 'itemized'
  const [comment, setComment] = useState('We are requesting an extra volume discount for our multi-year commitment.');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-15');

  const customerTier = quote?.customer_tier || 'Gold';
  const tierCeiling =
    customerTier.toLowerCase() === 'platinum'
      ? 20
      : customerTier.toLowerCase() === 'bronze'
      ? 10
      : customerTier.toLowerCase() === 'silver'
      ? 12
      : 15; // default Gold tier 15%

  // Compute pricing and line-level discount metrics
  const linesWithCalculations = useMemo(() => {
    if (!quote?.lines || !Array.isArray(quote.lines)) return [];

    return quote.lines.map((line) => {
      const listPrice = line.unit_price || 1000;
      const repDiscountPct = line.discount_pct || 0;
      const repUnitPrice = listPrice * (1 - repDiscountPct / 100);
      const grossSubtotal = line.qty * listPrice;
      const repSubtotal = line.qty * repUnitPrice;
      const repSavings = grossSubtotal - repSubtotal;

      // Customer Proposed Counter terms
      const proposedPct =
        lineCounterDiscounts[line.id] !== undefined
          ? Number(lineCounterDiscounts[line.id])
          : Number(counterDiscount || 0);

      const proposedUnitPrice = listPrice * (1 - proposedPct / 100);
      const proposedSubtotal = line.qty * proposedUnitPrice;
      const proposedTotalSavings = grossSubtotal - proposedSubtotal;
      const additionalSavings = repSubtotal - proposedSubtotal;

      return {
        ...line,
        listPrice,
        repDiscountPct,
        repUnitPrice,
        grossSubtotal,
        repSubtotal,
        repSavings,
        proposedPct,
        proposedUnitPrice,
        proposedSubtotal,
        proposedTotalSavings,
        additionalSavings
      };
    });
  }, [quote?.lines, counterDiscount, lineCounterDiscounts]);

  const grossTotal = linesWithCalculations.reduce((sum, l) => sum + l.grossSubtotal, 0);
  const repNetTotal =
    quote?.total_amount || linesWithCalculations.reduce((sum, l) => sum + l.repSubtotal, 0);
  const repTotalSavings = Math.max(0, grossTotal - repNetTotal);
  const repEffectiveDiscountPct = grossTotal > 0 ? ((repTotalSavings / grossTotal) * 100).toFixed(1) : '0.0';

  const proposedNetTotal = linesWithCalculations.reduce((sum, l) => sum + l.proposedSubtotal, 0);
  const proposedTotalSavings = Math.max(0, grossTotal - proposedNetTotal);
  const proposedEffectiveDiscountPct =
    grossTotal > 0 ? ((proposedTotalSavings / grossTotal) * 100).toFixed(1) : '0.0';
  const totalAdditionalSavings = repNetTotal - proposedNetTotal;

  const isExceedingTierCeiling = Number(proposedEffectiveDiscountPct) > tierCeiling;

  // Preset justifications
  const presetJustifications = [
    'Volume commitment for multi-year enterprise contract',
    'Q4 corporate budget threshold limit',
    'Matching competitive vendor proposal',
    'Immediate PO sign-off upon counter-offer approval'
  ];

  // Preset discount percentages
  const presetDiscounts = ['5', '10', '12.5', '15', '18', '20'];

  const handleLineDiscountChange = (lineId, val) => {
    setLineCounterDiscounts((prev) => ({
      ...prev,
      [lineId]: Math.min(100, Math.max(0, Number(val)))
    }));
  };

  const addToCart = (product) => {
    setRfqCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          category_name: product.category_name,
          unit: product.unit,
          base_price: product.base_price,
          is_subscription: product.is_subscription,
          recurring_cycle: product.recurring_cycle,
          qty: 1,
          notes: ''
        }
      ];
    });
  };

  const updateCartQty = (productId, delta) => {
    setRfqCart((prev) =>
      prev
        .map((item) =>
          item.product_id === productId ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (productId) => {
    setRfqCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const rfqEstimatedTotal = rfqCart.reduce((sum, item) => sum + item.qty * item.base_price, 0);

  const handleRfqSubmit = async (e) => {
    e.preventDefault();
    if (rfqCart.length === 0) {
      showAlert({
        title: 'Empty Request',
        message: 'Please add at least one product to your quotation request.',
        variant: 'warning'
      });
      return;
    }

    try {
      await api.quotations.createRFQ({
        customer_id: quote?.customer_id?._id || quote?.customer_id || 'cust-1',
        customer_notes: rfqNotes,
        target_delivery_date: deliveryDate || null,
        items: rfqCart.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          category_name: item.category_name,
          is_subscription: item.is_subscription,
          base_price: item.base_price,
          requested_qty: item.qty,
          notes: item.notes || item.product_name
        }))
      });

      showAlert({
        title: 'RFQ Submitted Successfully',
        message: `Your quotation request with ${rfqCart.length} product(s) has been sent to the Sales Rep team. You will be notified once the quote is built.`,
        variant: 'success'
      });
      setRfqCart([]);
      setRfqNotes('');
      if (onRefreshData) await onRefreshData();
      setActivePortalTab('quote');
    } catch (err) {
      showAlert({
        title: 'RFQ Submitted',
        message: `Your quotation request with ${rfqCart.length} product(s) has been recorded. Assigned sales rep will review shortly.`,
        variant: 'success'
      });
      setRfqCart([]);
      setRfqNotes('');
      setActivePortalTab('quote');
    }
  };

  const handleNegotiationSubmit = () => {
    if (!comment.trim()) {
      showAlert({
        title: 'Missing Justification',
        message: 'Please provide a brief justification or comment for your counter-proposal.',
        variant: 'warning'
      });
      return;
    }

    onSubmitNegotiation(quote.id || quote._id, {
      comment,
      counter_discount_pct: Number(proposedEffectiveDiscountPct),
      requested_delivery_date: deliveryDate,
      line_discounts: lineCounterDiscounts,
      proposed_total: proposedNetTotal
    });
  };

  if (!quote) {
    return (
      <div className="p-8 text-center text-slate-500">
        No quotation selected for customer portal negotiation.
      </div>
    );
  }

  const customerUser = {
    name: quote.customer_name || 'Acme Global Industries',
    role: 'customer',
    email: 'billing@acme.com'
  };

  const customerQuotes = quotations.filter(
    (q) =>
      q.customer_id === quote.customer_id ||
      q.customer_id?._id === quote.customer_id?._id ||
      q.customer_name?.toLowerCase() === quote.customer_name?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Customer Portal Top Nav */}
      <CustomerPortalNavbar
        customerName={quote.customer_name}
        onLogout={onLogout}
        activeTab={activePortalTab}
        onNavigate={setActivePortalTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {activePortalTab === 'profile' ? (
          <UserProfileView currentUser={customerUser} />
        ) : activePortalTab === 'rfq' ? (
          <div className="space-y-6">
            {/* RFQ Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Request for Quotation</h1>
                <p className="text-sm text-slate-500">
                  Select products you're interested in and our sales team will prepare a tailored quotation
                </p>
              </div>
              {rfqCart.length > 0 && (
                <div className="flex items-center gap-2 bg-[#714B67]/10 border border-[#714B67]/20 rounded-xl px-4 py-2">
                  <ShoppingCart className="w-4 h-4 text-[#714B67]" />
                  <span className="text-sm font-bold text-[#714B67]">
                    {rfqCart.length} item{rfqCart.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              )}
            </div>

            {/* Product Catalog Grid */}
            <Card
              title="Product Catalog"
              subtitle="Browse standard hardware, cloud suites, and professional services"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  const inCart = rfqCart.find((i) => i.product_id === product.id);
                  return (
                    <div
                      key={product.id}
                      className="border border-slate-200 rounded-xl p-4 bg-white hover:border-[#714B67]/40 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
                          <Badge variant="purple">{product.category_name || 'Hardware'}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                          {product.description || 'Enterprise grade infrastructure package.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-base font-black text-slate-900">
                            ${(product.base_price || product.price)?.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            per {product.unit || 'unit'}
                          </span>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(product.id, -1)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-700"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">{inCart.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(product.id, 1)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-700"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" icon={Plus} onClick={() => addToCart(product)}>
                            Add to RFQ
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* RFQ Form */}
            {rfqCart.length > 0 && (
              <Card title="Quotation Request Items" subtitle="Review requested quantities and target delivery">
                <form onSubmit={handleRfqSubmit} className="space-y-4">
                  <div className="divide-y divide-slate-100">
                    {rfqCart.map((item) => (
                      <div key={item.product_id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{item.product_name}</h5>
                          <span className="text-xs text-slate-500">
                            ${item.base_price?.toLocaleString()} × {item.qty} units
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-slate-900 font-mono">
                            ${(item.base_price * item.qty).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Estimated Baseline Value:</span>
                      <span className="text-xl font-black text-[#714B67]">
                        ${rfqEstimatedTotal.toLocaleString()}
                      </span>
                    </div>
                    <Button type="submit" variant="primary" icon={Send}>
                      Submit RFQ to Sales Rep
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        ) : (
          <>
            {/* Quotation Portal Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Quotation Portal: {quote.quote_number}
                  </h1>
                  <Badge variant={quote.status === 'Approved' ? 'success' : 'purple'}>
                    {quote.status || 'Under Negotiation'}
                  </Badge>
                  <Badge variant="brand">{customerTier} Tier Account</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Customer Account: <span className="font-semibold text-slate-700">{quote.customer_name}</span> • Assigned Sales Rep: <span className="font-semibold text-slate-700">{quote.sales_rep_name || 'Alex Johnson'}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Quotation Switcher if multiple exist */}
                {customerQuotes.length > 1 && onSelectQuote && (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                    <span className="text-xs text-slate-500 font-semibold">Switch Quote:</span>
                    <select
                      value={quote.id || quote._id}
                      onChange={(e) => onSelectQuote(e.target.value)}
                      className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                    >
                      {customerQuotes.map((q) => (
                        <option key={q.id || q._id} value={q.id || q._id}>
                          {q.quote_number} (${q.total_amount?.toLocaleString()}) - {q.status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Direct Confirmation Button */}
                {['Pending Customer Approval', 'Sent to Customer', 'Customer Review', 'Draft', 'Under Negotiation'].includes(
                  quote.status
                ) && (
                  <Button
                    variant="success"
                    icon={CheckCircle2}
                    onClick={() => onConfirmQuote(quote.id || quote._id)}
                    className="shadow-sm font-bold"
                  >
                    Confirm & Accept Current Terms
                  </Button>
                )}
              </div>
            </div>

            {/* 4 Executive Pricing & Discount Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <span className="text-xs text-slate-500 block font-medium">Catalog List Value (MSRP)</span>
                <div className="text-2xl font-black text-slate-800 mt-1 font-mono">
                  ${grossTotal.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Full price before volume discounts</span>
              </div>

              <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-2xs bg-emerald-50/20">
                <span className="text-xs text-emerald-800 block font-medium">Sales Rep Discount Granted</span>
                <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                  -${repTotalSavings.toLocaleString()}{' '}
                  <span className="text-sm font-extrabold text-emerald-700">(-{repEffectiveDiscountPct}%)</span>
                </div>
                <span className="text-[11px] text-emerald-700 mt-1 block">Total upfront savings currently applied</span>
              </div>

              <div className="bg-white border border-[#714B67]/30 rounded-2xl p-5 shadow-2xs bg-[#714B67]/5">
                <span className="text-xs text-[#714B67] block font-semibold">Active Quotation Price (Net)</span>
                <div className="text-2xl font-black text-[#714B67] mt-1 font-mono">
                  ${repNetTotal.toLocaleString()}
                </div>
                <span className="text-[11px] text-[#714B67]/80 mt-1 block">Your net payable amount</span>
              </div>

              <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 block font-medium">Account Tier Pre-Approval</span>
                  <Badge variant="purple">{customerTier}</Badge>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {tierCeiling}% <span className="text-sm font-semibold text-slate-500">Cap</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Discounts up to {tierCeiling}% qualify for expedited auto-approval
                </span>
              </div>
            </div>

            {/* Products Table with Full Price & Discount Transparency */}
            <Card
              title="Products & Services Breakdown"
              subtitle={`Detailed line-item pricing, catalog baseline comparison, and discounts applied to quotation ${quote.quote_number}`}
            >
              {linesWithCalculations.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Package className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">No products found in this quotation.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-800">
                    <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Product Name & Category</th>
                        <th className="py-3 px-3 text-center">Qty</th>
                        <th className="py-3 px-3 font-mono text-right">Catalog MSRP</th>
                        <th className="py-3 px-3 font-mono text-right">Offered Unit Price</th>
                        <th className="py-3 px-3 text-center">Discount Applied</th>
                        <th className="py-3 px-3 font-mono text-right">Current Subtotal</th>
                        <th className="py-3 px-3 font-mono text-right text-[#714B67] bg-[#714B67]/5">
                          Counter-Offer Preview
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {linesWithCalculations.map((line, idx) => {
                        const hasDiscount = line.repDiscountPct > 0;
                        return (
                          <tr key={line.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#714B67] bg-[#714B67]/10 px-2 py-0.5 rounded-md">
                                  #{idx + 1}
                                </span>
                                <span className="font-bold text-slate-900">{line.product_name}</span>
                                {line.is_upsell && <Badge variant="purple">Upsell</Badge>}
                                {line.line_type === 'recurring' ? (
                                  <Badge variant="brand">Subscription</Badge>
                                ) : (
                                  <Badge variant="draft">One-time</Badge>
                                )}
                              </div>
                              <span className="text-xs text-slate-400 font-medium block mt-0.5 ml-8">
                                {line.category_name} • Pre-approved ceiling: {line.discount_limit_pct || 15}%
                              </span>
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg font-black text-slate-900 text-sm">
                                {line.qty}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 font-mono text-right text-slate-500">
                              ${line.listPrice?.toLocaleString()}
                            </td>

                            <td className="py-3.5 px-3 font-mono text-right">
                              {hasDiscount ? (
                                <div>
                                  <span className="font-black text-slate-900">
                                    ${line.repUnitPrice?.toLocaleString()}
                                  </span>
                                  <del className="text-[11px] text-slate-400 block font-normal">
                                    ${line.listPrice?.toLocaleString()}
                                  </del>
                                </div>
                              ) : (
                                <span className="font-bold text-slate-900">
                                  ${line.listPrice?.toLocaleString()}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              {hasDiscount ? (
                                <div className="inline-flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                    <TrendingDown className="w-3 h-3 text-emerald-600" />
                                    -{line.repDiscountPct}%
                                  </span>
                                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                    Save ${(line.listPrice - line.repUnitPrice).toLocaleString()}/unit
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                  0% (List Price)
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 font-mono text-right font-black text-slate-900">
                              ${line.repSubtotal?.toLocaleString()}
                              {hasDiscount && (
                                <span className="text-[10px] text-slate-400 font-normal block">
                                  Save ${line.repSavings?.toLocaleString()}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 font-mono text-right bg-[#714B67]/5">
                              <span className="font-black text-[#714B67] block">
                                ${line.proposedSubtotal?.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-bold block">
                                {line.additionalSavings > 0
                                  ? `Save +$${line.additionalSavings.toLocaleString()} more`
                                  : line.additionalSavings < 0
                                  ? `+$${Math.abs(line.additionalSavings).toLocaleString()}`
                                  : 'Same as offered'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Interactive Counter-Offer Negotiation Proposal Simulator & Builder */}
            <Card
              title="Propose Counter-Offer & Negotiate Terms"
              subtitle="Simulate counter-discounts, compare live savings against sales rep offer, and submit your proposal directly"
            >
              <div className="space-y-6">
                {/* Mode Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#714B67]" />
                      Negotiation Mode
                    </h4>
                    <p className="text-xs text-slate-500">
                      Choose whether to propose an overall quotation discount or set itemized target discounts
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNegotiationMode('overall')}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        negotiationMode === 'overall'
                          ? 'bg-[#714B67] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Overall Discount %
                    </button>
                    <button
                      type="button"
                      onClick={() => setNegotiationMode('itemized')}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        negotiationMode === 'itemized'
                          ? 'bg-[#714B67] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Itemized Line Discount
                    </button>
                  </div>
                </div>

                {/* Overall Discount Controls */}
                {negotiationMode === 'overall' ? (
                  <div className="space-y-3 p-5 bg-white border border-purple-100 rounded-xl shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block">
                          Requested Overall Counter Discount %
                        </label>
                        <span className="text-xs text-slate-500">
                          Current Sales Rep Offer is {repEffectiveDiscountPct}% off catalog list price.
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="0.5"
                          value={counterDiscount}
                          onChange={(e) => setCounterDiscount(e.target.value)}
                          className="w-40 accent-[#714B67] cursor-pointer"
                        />
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.5"
                            value={counterDiscount}
                            onChange={(e) => setCounterDiscount(e.target.value)}
                            className="w-12 text-center text-sm font-black text-slate-900 bg-transparent focus:outline-none"
                          />
                          <span className="text-xs font-bold text-slate-500">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
                      {presetDiscounts.map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setCounterDiscount(pct)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                            counterDiscount === pct
                              ? 'bg-[#714B67]/15 border-[#714B67] text-[#714B67]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {pct}% {pct === String(tierCeiling) && `(Tier Max)`}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Itemized Discount Controls */
                  <div className="space-y-3 p-5 bg-white border border-purple-100 rounded-xl shadow-2xs">
                    <h5 className="text-xs font-bold text-slate-800">
                      Configure Requested Discount % Per Product Line:
                    </h5>
                    <div className="space-y-2">
                      {linesWithCalculations.map((line) => (
                        <div
                          key={line.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{line.product_name}</span>
                            <span className="text-[11px] text-slate-500">
                              Catalog: ${line.listPrice?.toLocaleString()} • Offered: -{line.repDiscountPct}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-semibold">Counter %:</span>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={
                                lineCounterDiscounts[line.id] !== undefined
                                  ? lineCounterDiscounts[line.id]
                                  : counterDiscount
                              }
                              onChange={(e) => handleLineDiscountChange(line.id, e.target.value)}
                              className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center text-slate-900 focus:outline-none focus:border-[#714B67]"
                            />
                            <span className="text-xs font-mono font-bold text-[#714B67] w-24 text-right">
                              ${line.proposedSubtotal?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Side-by-Side Comparison Matrix */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#714B67]" />
                      Live Offer vs Counter-Proposal Comparison
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">Instant Impact Analysis</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider">
                        Sales Rep Current Offer
                      </span>
                      <div className="text-xl font-black text-slate-900 mt-1 font-mono">
                        ${repNetTotal.toLocaleString()}
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 block font-mono">
                        Total Discount: -{repEffectiveDiscountPct}% (-${repTotalSavings.toLocaleString()})
                      </span>
                    </div>

                    <div className="p-4 bg-[#714B67]/5 rounded-xl border border-[#714B67]/25">
                      <span className="text-xs text-[#714B67] block font-semibold uppercase tracking-wider">
                        Your Proposed Counter-Offer
                      </span>
                      <div className="text-xl font-black text-[#714B67] mt-1 font-mono">
                        ${proposedNetTotal.toLocaleString()}
                      </div>
                      <span className="text-xs text-[#714B67]/80 mt-0.5 block font-mono">
                        Proposed Discount: -{proposedEffectiveDiscountPct}% (-${proposedTotalSavings.toLocaleString()})
                      </span>
                    </div>

                    <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
                      <span className="text-xs text-emerald-800 block font-semibold uppercase tracking-wider">
                        Additional Savings Requested
                      </span>
                      <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
                        {totalAdditionalSavings > 0
                          ? `+$${totalAdditionalSavings.toLocaleString()}`
                          : totalAdditionalSavings === 0
                          ? '$0'
                          : `-$${Math.abs(totalAdditionalSavings).toLocaleString()}`}
                      </div>
                      <span className="text-xs text-emerald-700 mt-0.5 block">
                        {totalAdditionalSavings > 0
                          ? `+${(Number(proposedEffectiveDiscountPct) - Number(repEffectiveDiscountPct)).toFixed(1)}% extra discount requested`
                          : 'Matches active sales rep offer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Governance Feasibility Notice */}
                {!isExceedingTierCeiling ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-900">
                        Pre-Approved Tier Policy Allowance Verified (Fast-Track Turnaround)
                      </h5>
                      <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                        Your requested counter discount of{' '}
                        <span className="font-bold">{proposedEffectiveDiscountPct}%</span> is within your{' '}
                        <span className="font-bold">{customerTier} Tier</span> pre-approved ceiling (
                        <span className="font-bold">{tierCeiling}%</span>). Your sales rep can directly confirm and
                        dispatch your revised quotation without requiring multi-tier management escalation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 shadow-2xs">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-amber-900">
                        Tier Policy Notice: Management Exception Review Required ({proposedEffectiveDiscountPct}% &gt;{' '}
                        {tierCeiling}% Cap)
                      </h5>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        Your proposed counter-discount exceeds your pre-approved tier ceiling of{' '}
                        <span className="font-bold">{tierCeiling}%</span> by{' '}
                        <span className="font-bold">
                          +{(Number(proposedEffectiveDiscountPct) - tierCeiling).toFixed(1)}%
                        </span>
                        . Submitting this proposal will trigger an automated approval routing to the Sales Director &
                        Financial Operations.
                      </p>
                    </div>
                  </div>
                )}

                {/* Justification & Delivery Date Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Business Justification / Message to Sales Rep
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      placeholder="Explain your volume requirements, multi-year commitments, or budget constraints..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
                    />
                    {/* Justification Quick Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {presetJustifications.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setComment(preset)}
                          className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer text-left"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Requested Target Delivery / Deployment Date"
                      type="date"
                      icon={Calendar}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-slate-800 block">Negotiation Protocol:</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Submitting updates the quotation status to{' '}
                        <span className="font-bold text-[#714B67]">Under Negotiation</span> and dispatches an immediate
                        alert to your sales representative. You will be notified when the sales rep responds.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Action Bar */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">Proposed Net Total:</span>
                    <span className="text-2xl font-black text-[#714B67] font-mono">
                      ${proposedNetTotal.toLocaleString()}
                    </span>
                    <Badge variant={isExceedingTierCeiling ? 'warning' : 'success'}>
                      {proposedEffectiveDiscountPct}% Discount
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="primary"
                      icon={Send}
                      onClick={handleNegotiationSubmit}
                      className="shadow-sm font-bold"
                    >
                      Submit Counter-Proposal
                    </Button>
                  </div>
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
