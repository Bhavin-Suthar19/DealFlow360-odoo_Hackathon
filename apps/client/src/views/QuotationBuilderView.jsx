import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useModal } from '../context/ModalContext';
import {
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Send,
  Save,
  Sparkles,
  Package,
  Layers,
  ShieldCheck,
  Percent,
  Calendar,
  MessageSquare,
  ArrowDownRight,
  RotateCcw,
  Search,
  X,
  FileText
} from 'lucide-react';

export const QuotationBuilderView = ({
  quote,
  products = [],
  customers = [],
  upsellRules = [],
  invoices = [],
  onSelectInvoice,
  onGenerateInvoice,
  onBack,
  onSubmitQuote,
  onSaveDraft,
  onSendToCustomer,
  onEscalateToManager
}) => {
  const { showAlert } = useModal() || {};
  const [bulkDiscountInput, setBulkDiscountInput] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showProductResults, setShowProductResults] = useState(false);

  const quoteId = quote?._id || quote?.id;
  const existingInvoice = useMemo(() => {
    if (!quoteId) return null;
    return invoices.find(
      (inv) =>
        String(inv.quotation_id?._id || inv.quotation_id?.id || inv.quotation_id) === String(quoteId) ||
        (inv.quote_number && quote?.quote_number && inv.quote_number === quote.quote_number)
    );
  }, [invoices, quoteId, quote?.quote_number]);

  const customerList = React.useMemo(() => {
    if (Array.isArray(customers) && customers.length > 0) {
      return customers.map((c) => ({
        id: c._id || c.id,
        name: c.company_name || c.name || 'Enterprise Customer',
        tier: c.pricing_tier || 'Gold'
      }));
    }
    return [
      { id: 'c-101', name: 'Acme Corp', tier: 'Gold' },
      { id: 'c-102', name: 'TechCorp Inc', tier: 'Platinum' },
      { id: 'c-103', name: 'Nexus Logistics', tier: 'Bronze' },
      { id: 'c-104', name: 'Vanguard Health', tier: 'Gold' },
      { id: 'cust-1', name: 'Acme Global Industries', tier: 'Gold' }
    ];
  }, [customers]);

  const [customer, setCustomer] = useState(() => {
    if (!quote?.customer_name) return customerList[0];
    return (
      customerList.find((c) => c.name.toLowerCase() === quote.customer_name.toLowerCase()) || {
        id: quote.customer_id || 'cust-1',
        name: quote.customer_name,
        tier: quote.customer_tier || 'Gold'
      }
    );
  });

  const [currentStatus, setCurrentStatus] = useState(quote?.status || 'Draft');

  // Helper to find catalog product and enrich line with stock, base price, category, and ceiling limits
  const enrichLineWithCatalog = (line) => {
    const lineProdId = line.product_id?._id || line.product_id;
    const prod = products.find(
      (p) =>
        p.id === lineProdId ||
        p._id === lineProdId ||
        (line.product_name && p.name?.toLowerCase() === line.product_name?.toLowerCase())
    );

    const isSub =
      line.is_subscription !== undefined
        ? line.is_subscription
        : prod?.is_subscription !== undefined
        ? prod.is_subscription
        : line.line_type === 'recurring';

    const stock =
      line.stock_on_hand !== undefined
        ? line.stock_on_hand
        : line.available_stock !== undefined
        ? line.available_stock
        : prod?.stock_on_hand !== undefined
        ? prod.stock_on_hand
        : isSub
        ? 9999
        : 45;

    const unitPrice =
      (currentStatus === 'RFQ Received' && prod?.base_price)
        ? prod.base_price
        : line.unit_price && line.unit_price > 0 && line.unit_price !== 1000
        ? line.unit_price
        : prod?.base_price || prod?.price || line.unit_price || 1000;

    const catMap = {
      'cat-1': 'Hardware',
      'cat-2': 'SaaS Subscriptions',
      'cat-3': 'Professional Services'
    };

    const catName =
      line.category_name ||
      prod?.category_name ||
      catMap[prod?.category_id] ||
      (isSub ? 'SaaS Subscriptions' : 'Hardware');

    let ceiling = line.discount_limit_pct;
    if (!ceiling || ceiling === 0) {
      if (catName.toLowerCase().includes('hardware')) ceiling = 10;
      else if (catName.toLowerCase().includes('service')) ceiling = 20;
      else ceiling = 15;
    }

    const qty = Math.max(1, line.qty || line.requested_qty || 1);

    return {
      ...line,
      id: line.id || line._id || `ql-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      product_id: prod?.id || prod?._id || lineProdId || 'prod-1',
      product_name: line.product_name || prod?.name || 'Product',
      category_name: catName,
      line_type: isSub ? 'recurring' : 'one_time',
      is_subscription: isSub,
      unit_price: unitPrice,
      qty,
      discount_pct: line.discount_pct || 0,
      discount_limit_pct: ceiling,
      stock_on_hand: stock,
      available_stock: stock,
      is_upsell: !!line.is_upsell
    };
  };

  const [lines, setLines] = useState(() => {
    return Array.isArray(quote?.lines) && quote.lines.length > 0
      ? quote.lines.map(enrichLineWithCatalog)
      : [];
  });

  // Re-sync lines, status, and customer state whenever quote or products update
  useEffect(() => {
    if (quote) {
      const found = customerList.find(
        (c) =>
          c.id === (quote.customer_id?._id || quote.customer_id) ||
          (quote.customer_name && c.name.toLowerCase() === quote.customer_name.toLowerCase())
      );
      if (found) {
        setCustomer(found);
      } else if (quote.customer_name) {
        setCustomer({
          id: quote.customer_id?._id || quote.customer_id || 'cust-1',
          name: quote.customer_name,
          tier: quote.customer_tier || 'Gold'
        });
      }

      setCurrentStatus(quote.status || 'Draft');

      if (Array.isArray(quote.lines) && quote.lines.length > 0) {
        setLines(quote.lines.map(enrichLineWithCatalog));
      }
    }
  }, [quote?.id, quote?.quote_number, quote?.status, products.length]);

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || products[0]?._id || '');

  useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id || products[0]._id);
    }
  }, [products, selectedProductId]);

  // Filtered product results for search and browsing
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products.slice(0, 20);
    const q = productSearch.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [productSearch, products]);

  const counterOffer = quote?.counter_offer || (quote?.counter_discount_pct ? {
    counter_discount_pct: quote.counter_discount_pct,
    comment: quote.counter_comment,
    proposed_total: quote.counter_proposed_total,
    requested_delivery_date: quote.counter_delivery_date,
    status: quote.counter_status || 'Pending Review'
  } : null);

  const applyOverallDiscount = (pct) => {
    const discountVal = Math.min(100, Math.max(0, Number(pct) || 0));
    const updatedLines = lines.map((l) => ({
      ...l,
      discount_pct: discountVal
    }));
    setLines(updatedLines);
    return updatedLines;
  };

  const handleApplyCustomerCounterOffer = () => {
    if (!counterOffer) return;
    const pct = Number(counterOffer.counter_discount_pct || 0);
    const updatedLines = applyOverallDiscount(pct);
    setCurrentStatus('Draft');
    if (onSaveDraft) {
      onSaveDraft(updatedLines);
    }
    showAlert?.({
      title: 'Counter-Offer Applied',
      message: `Applied customer counter-offer discount of ${pct}% across all ${updatedLines.length} line items. The quotation is now in Draft mode and ready for re-submission or managerial sign-off.`,
      variant: 'success'
    });
  };

  const updateLineQty = (lineId, delta) => {
    setLines(lines.map((l) => (l.id === lineId ? { ...l, qty: Math.max(1, l.qty + delta) } : l)));
  };

  const updateLineDiscount = (lineId, pct) => {
    setLines(
      lines.map((l) =>
        l.id === lineId ? { ...l, discount_pct: Math.min(100, Math.max(0, Number(pct))) } : l
      )
    );
  };

  const removeLine = (lineId) => {
    setLines(lines.filter((l) => l.id !== lineId));
  };

  const addProductToQuote = (prod) => {
    const prodId = prod.id || prod._id;
    const existing = lines.find((l) => l.product_id === prodId);
    if (existing) {
      updateLineQty(existing.id, 1);
    } else {
      const isSub = prod.is_subscription || false;
      const catName =
        prod.category_name ||
        (prod.category_id === 'cat-1'
          ? 'Hardware'
          : prod.category_id === 'cat-2'
          ? 'SaaS Subscriptions'
          : 'Professional Services');
      const ceiling = catName === 'Hardware' ? 10 : catName === 'Professional Services' ? 20 : 15;
      const stock = prod.stock_on_hand ?? (isSub ? 9999 : 45);

      const newLine = {
        id: `ql-${Date.now()}`,
        product_id: prodId,
        product_name: prod.name,
        category_name: catName,
        qty: 1,
        unit_price: prod.base_price || prod.price || 1000,
        discount_pct: 0,
        discount_limit_pct: ceiling,
        line_type: isSub ? 'recurring' : 'one_time',
        is_subscription: isSub,
        stock_on_hand: stock,
        available_stock: stock,
        is_upsell: false
      };
      setLines([...lines, newLine]);
    }
  };

  const addUpsellToQuote = (rule) => {
    const newLine = {
      id: `ql-${Date.now()}`,
      product_id: rule.suggested_product_id,
      product_name: rule.suggested_product_name,
      category_name: 'SaaS Subscriptions',
      qty: 1,
      unit_price: rule.suggested_price,
      discount_pct: 0,
      discount_limit_pct: 15,
      line_type: 'recurring',
      is_subscription: true,
      stock_on_hand: 9999,
      available_stock: 9999,
      is_upsell: true
    };
    setLines([...lines, newLine]);
  };

  // Stock availability renderer
  const renderAvailabilityBadge = (line) => {
    const isSub = line.is_subscription || line.line_type === 'recurring';
    const stock = line.stock_on_hand ?? line.available_stock ?? 0;
    const requestedQty = line.qty || 1;

    if (isSub) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          Instant Provisioning
        </span>
      );
    }

    if (requestedQty <= stock) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          In Stock ({stock} avail)
        </span>
      );
    }

    if (stock > 0 && requestedQty > stock) {
      const backorder = requestedQty - stock;
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 whitespace-nowrap shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          Partial Stock ({stock} on-hand, {backorder} backorder)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 whitespace-nowrap shadow-2xs">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        Out of Stock ({requestedQty} backorder required)
      </span>
    );
  };

  // Risk score calculation
  let overageSum = 0;
  let totalWeight = 0;
  lines.forEach((l) => {
    const weight = l.qty * l.unit_price;
    const over = Math.max(0, l.discount_pct - l.discount_limit_pct);
    totalWeight += weight;
    overageSum += over * weight;
  });
  const blendedRiskScore = totalWeight > 0 ? Number((overageSum / totalWeight).toFixed(2)) : 0;
  const overageLines = lines.filter((l) => l.discount_pct > l.discount_limit_pct);
  const totalAmount = lines.reduce((sum, l) => sum + l.qty * l.unit_price * (1 - l.discount_pct / 100), 0);

  // Check inventory shortage across all draft lines
  const hasInventoryShortage = lines.some(
    (l) => !(l.is_subscription || l.line_type === 'recurring') && l.qty > (l.stock_on_hand ?? l.available_stock ?? 0)
  );

  const handleSendToCustomerClick = () => {
    if (onSendToCustomer) {
      onSendToCustomer(lines);
    } else {
      onSubmitQuote(lines);
    }
  };

  const handleEscalateClick = () => {
    if (onEscalateToManager) {
      onEscalateToManager(lines);
    } else {
      onSubmitQuote(lines);
    }
  };

  // Begin Quote Pricing: transitions RFQ to Draft with all fields, requested quantities, and availability intact
  const handleBeginQuotePricing = () => {
    let draftLines = lines.map(enrichLineWithCatalog);
    if (draftLines.length === 0 && products.length > 0) {
      const first = products[0];
      draftLines = [
        enrichLineWithCatalog({
          id: `ql-${Date.now()}`,
          product_id: first.id || first._id,
          product_name: first.name,
          category_name: first.category_name || 'Hardware',
          qty: 1,
          unit_price: first.base_price || 12500,
          discount_pct: 0,
          discount_limit_pct: 10,
          line_type: first.is_subscription ? 'recurring' : 'one_time',
          is_subscription: !!first.is_subscription,
          is_upsell: false
        })
      ];
    }

    setLines(draftLines);
    setCurrentStatus('Draft');
    onSaveDraft(draftLines);
  };

  const isRfqMode = currentStatus === 'RFQ Received';

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {quote ? quote.quote_number : 'Q-1045'}
              </h1>
              <Badge variant="purple">{customer.tier} Tier</Badge>
              {!isRfqMode && (
                <Badge variant={blendedRiskScore > 15 ? 'danger' : blendedRiskScore > 5 ? 'warning' : 'success'}>
                  Risk Score: {blendedRiskScore}%
                </Badge>
              )}
              <Badge variant={isRfqMode ? 'brand' : currentStatus === 'Under Negotiation' ? 'negotiation' : currentStatus === 'Draft' ? 'draft' : 'purple'}>
                {currentStatus}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRfqMode
                ? 'Review customer quotation request with real-time warehouse inventory availability'
                : 'Interactive Sales Quotation & Governance Builder'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isRfqMode ? (
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={handleBeginQuotePricing}
              className="shadow-sm"
            >
              Begin Quote Pricing
            </Button>
          ) : currentStatus === 'Pending Manager Approval' ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                Under Manager Review
              </span>
              <Button variant="secondary" icon={Save} onClick={() => onSaveDraft(lines)}>
                Save Draft
              </Button>
            </div>
          ) : currentStatus === 'Pending Finance Approval' ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                Under Finance Review
              </span>
              <Button variant="secondary" icon={Save} onClick={() => onSaveDraft(lines)}>
                Save Draft
              </Button>
            </div>
          ) : currentStatus === 'Approved' || currentStatus === 'Confirmed' ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Quotation Approved
              </span>
              {existingInvoice ? (
                <Button
                  variant="brand"
                  icon={FileText}
                  onClick={() => onSelectInvoice?.(existingInvoice._id || existingInvoice.id)}
                >
                  View Invoice ({existingInvoice.invoice_number})
                </Button>
              ) : onGenerateInvoice ? (
                <Button
                  variant="primary"
                  icon={FileText}
                  onClick={async () => {
                    const qId = quote?._id || quote?.id;
                    if (qId) await onGenerateInvoice(qId);
                  }}
                >
                  Generate Invoice
                </Button>
              ) : null}
              <Button variant="outline" icon={Send} onClick={handleSendToCustomerClick}>
                Resend to Customer
              </Button>
            </div>
          ) : (
            <>
              <Button variant="secondary" icon={Save} onClick={() => onSaveDraft(lines)}>
                Save Draft
              </Button>
              <Button variant="outline" icon={Send} onClick={handleSendToCustomerClick}>
                Send to Customer
              </Button>
              {overageLines.length > 0 && ['Draft', 'Under Negotiation'].includes(currentStatus) && (
                <Button variant="danger" icon={AlertTriangle} onClick={handleEscalateClick}>
                  Escalate to Manager
                </Button>
              )}
              <Button variant="primary" icon={CheckCircle2} onClick={() => onSubmitQuote(lines)}>
                Submit & Confirm
              </Button>
            </>
          )}
        </div>
      </div>

      {isRfqMode ? (
        // RFQ Review Mode - Customer's Requested Items with Real-time Stock Availability & Pricing Baselines
        <div className="space-y-4">
          <Card
            title="Requested Products & Inventory Availability"
            subtitle="Customer-requested items, exact quantities, catalog price baselines, and stock availability"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-800">
                <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Stock Availability</th>
                    <th className="py-3 px-3">Catalog Price</th>
                    <th className="py-3 px-3 text-center">Requested Qty</th>
                    <th className="py-3 px-3 text-right">Est. Baseline Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((line) => {
                    const estSubtotal = line.qty * line.unit_price;
                    return (
                      <tr key={line.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          <div>{line.product_name}</div>
                          <span className="text-xs text-slate-400 font-normal">
                            Product ID: {line.product_id}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <Badge variant="purple">{line.category_name || 'Product'}</Badge>
                        </td>
                        <td className="py-3.5 px-3">
                          {line.is_subscription || line.line_type === 'recurring' ? (
                            <Badge variant="brand">Subscription</Badge>
                          ) : (
                            <Badge variant="draft">One-time</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-3">{renderAvailabilityBadge(line)}</td>
                        <td className="py-3.5 px-3 font-mono font-medium text-slate-700">
                          ${line.unit_price?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-sm font-black text-slate-900">
                            {line.qty}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-extrabold text-slate-900">
                          ${estSubtotal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {lines.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500">
                        No products found in this quotation request.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* RFQ Summary Footer */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">
                  {lines.length} Requested Product{lines.length !== 1 ? 's' : ''}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-900">
                  {lines.reduce((sum, l) => sum + l.qty, 0)} Total Requested Units
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Package className="w-3.5 h-3.5 text-[#714B67]" />
                  {hasInventoryShortage
                    ? 'Automated split fulfillment backorder will be triggered for excess units'
                    : 'All requested physical units currently on-hand in warehouse'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">Est. Catalog Baseline:</span>
                <span className="text-xl font-black text-[#714B67]">${totalAmount.toLocaleString()}</span>
                <Button variant="primary" icon={Sparkles} onClick={handleBeginQuotePricing}>
                  Begin Quote Pricing
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        // Full Quote Builder Mode
        <>
          {/* Customer Counter-Proposal Received Banner */}
          {counterOffer && (
            <div className="bg-white border-2 border-[#714B67]/30 rounded-2xl p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#714B67]" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pl-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#714B67]/10 border border-[#714B67]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-[#714B67]" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs uppercase font-extrabold tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                        Customer Counter-Offer Received
                      </span>
                      <Badge variant="negotiation">
                        {counterOffer.status || 'Pending Sales Review'}
                      </Badge>
                      {counterOffer.created_at && (
                        <span className="text-xs text-slate-400">
                          • {new Date(counterOffer.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Customer requested <span className="text-[#714B67]">{counterOffer.counter_discount_pct}%</span> overall quotation discount
                    </h3>
                    {counterOffer.comment && (
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 italic max-w-3xl">
                        <MessageSquare className="w-4 h-4 text-[#714B67] shrink-0 mt-0.5" />
                        <span>"{counterOffer.comment}"</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center sm:text-right">
                    <span className="text-[11px] text-slate-500 block uppercase font-semibold">
                      Proposed Net Total
                    </span>
                    <span className="text-xl font-black text-[#714B67] font-mono">
                      {counterOffer.proposed_total > 0
                        ? `$${Number(counterOffer.proposed_total).toLocaleString()}`
                        : `~$${Math.round(totalAmount * (1 - (counterOffer.counter_discount_pct || 0) / 100)).toLocaleString()}`}
                    </span>
                    {counterOffer.requested_delivery_date && (
                      <span className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-end gap-1 mt-0.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#714B67]" />
                        Req. Delivery: {new Date(counterOffer.requested_delivery_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      icon={CheckCircle2}
                      onClick={handleApplyCustomerCounterOffer}
                      className="shadow-xs font-bold"
                    >
                      Accept & Apply {counterOffer.counter_discount_pct}% to All Lines
                    </Button>
                    <button
                      type="button"
                      onClick={() => applyOverallDiscount(counterOffer.counter_discount_pct || 10)}
                      className="text-xs text-slate-500 hover:text-[#714B67] font-semibold text-center underline cursor-pointer transition-colors"
                    >
                      Or populate line discounts without auto-saving
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Selection Card */}
          <Card title="Customer Account Setup" subtitle="Assign customer account tier and pricing baseline">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Select Customer Account
                </label>
                <select
                  value={customer.id}
                  onChange={(e) => {
                    const found = customerList.find((c) => c.id === e.target.value);
                    if (found) setCustomer(found);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#714B67]"
                >
                  {customerList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.tier} Tier)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Customer Tier</span>
                  <span className="text-sm font-extrabold text-slate-900">{customer.tier} Tier</span>
                </div>
                <Badge variant="purple">Ceiling Cap: 15%</Badge>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Governance Status</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {blendedRiskScore > 5 ? 'Approval Routing Required' : 'Auto-Approved Level'}
                  </span>
                </div>
                <Badge variant={blendedRiskScore > 5 ? 'warning' : 'success'}>
                  {blendedRiskScore > 5 ? 'Multi-Step Review' : 'Auto-Pass'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Governance Exception Banner */}
          {overageLines.length > 0 ? (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    {currentStatus === 'Pending Manager Approval'
                      ? 'Quotation Submitted for Manager Approval'
                      : currentStatus === 'Pending Finance Approval'
                      ? 'Quotation Submitted for Finance Approval'
                      : 'Discount Governance Exception Detected'}
                  </h4>
                  <p className="text-xs text-amber-800">
                    {currentStatus === 'Pending Manager Approval'
                      ? 'This quotation is actively pending sales manager review and sign-off in the governance queue.'
                      : currentStatus === 'Pending Finance Approval'
                      ? 'This quotation has passed sales manager review and is now pending final finance operations sign-off.'
                      : `${overageLines.length} item(s) exceed approved ceiling limits. Submitting will trigger Sales Manager & Finance approval routing.`}
                  </p>
                </div>
              </div>
              <Badge variant={currentStatus.includes('Pending') ? 'pending' : 'warning'}>
                {currentStatus === 'Pending Manager Approval'
                  ? 'Awaiting Manager'
                  : currentStatus === 'Pending Finance Approval'
                  ? 'Awaiting Finance'
                  : 'Requires Approval'}
              </Badge>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Discount Governance Compliant</h4>
                <p className="text-xs text-emerald-800">
                  All line discounts are within pre-approved category ceiling limits.
                </p>
              </div>
            </div>
          )}

          {/* Warehouse Inventory Backorder Notice Banner */}
          {hasInventoryShortage && (
            <div className="bg-sky-50 border border-sky-300 rounded-xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-sky-900">Inventory Allocation & Backorder Notice</h4>
                  <p className="text-xs text-sky-800">
                    One or more line quantities exceed on-hand warehouse stock. The CPQ system will automatically schedule a split fulfillment order and generate PO replenishment upon confirmation.
                  </p>
                </div>
              </div>
              <Badge variant="brand">Automated Split Fulfillment</Badge>
            </div>
          )}

          {/* Cart & Upsell Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart */}
            <div className="lg:col-span-2 space-y-4">
              <Card
                title="Itemized Cart Builder"
                subtitle="Adjust quantities, verify stock availability, and configure line discounts against ceilings"
              >
                {/* Quick Apply Overall Discount Bar */}
                {lines.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-[#714B67]" />
                      <span className="text-xs font-bold text-slate-700">Quick Apply Overall Discount:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {[0, 5, 10, 12, 15, 20].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => applyOverallDiscount(pct)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-[#714B67] hover:text-white hover:border-[#714B67] text-slate-700 transition-all cursor-pointer shadow-2xs"
                        >
                          {pct === 0 ? 'Clear (0%)' : `${pct}%`}
                        </button>
                      ))}
                      <div className="flex items-center gap-1 pl-2 border-l border-slate-300">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Custom %"
                          value={bulkDiscountInput}
                          onChange={(e) => setBulkDiscountInput(e.target.value)}
                          className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#714B67]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (bulkDiscountInput !== '') {
                              applyOverallDiscount(Number(bulkDiscountInput));
                              setBulkDiscountInput('');
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#714B67] text-white hover:bg-[#5a3b52] transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {lines.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    No items added yet. Select a catalog product below to insert line items into the quotation.
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-left text-sm text-slate-800 min-w-[860px]">
                      <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3.5 min-w-[200px] w-1/4">Product Name</th>
                          <th className="py-3 px-3 min-w-[150px] whitespace-nowrap">Stock Availability</th>
                          <th className="py-3 px-2 min-w-[95px] text-center whitespace-nowrap">Qty</th>
                          <th className="py-3 px-3 min-w-[100px] whitespace-nowrap font-mono">Unit Price</th>
                          <th className="py-3 px-2 min-w-[85px] text-center whitespace-nowrap">Discount %</th>
                          <th className="py-3 px-2 min-w-[80px] text-center whitespace-nowrap">Ceiling %</th>
                          <th className="py-3 px-3 min-w-[110px] text-center whitespace-nowrap">Status</th>
                          <th className="py-3 px-3.5 min-w-[110px] text-right whitespace-nowrap font-mono">Subtotal</th>
                          <th className="py-3 px-2 w-10 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lines.map((line) => {
                          const isOver = line.discount_pct > line.discount_limit_pct;
                          const subtotal = line.qty * line.unit_price * (1 - line.discount_pct / 100);
                          return (
                            <tr key={line.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 px-3.5 font-semibold text-slate-900">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span>{line.product_name}</span>
                                  {line.is_upsell && (
                                    <Badge variant="purple" className="text-[10px]">
                                      Upsell
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-normal block mt-0.5">
                                  {line.category_name}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 whitespace-nowrap">{renderAvailabilityBadge(line)}</td>
                              <td className="py-3.5 px-2">
                                <div className="flex items-center justify-center gap-1 bg-slate-100 border border-slate-300 rounded-lg p-1 w-24 mx-auto">
                                  <button
                                    type="button"
                                    onClick={() => updateLineQty(line.id, -1)}
                                    className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-bold w-6 text-center">{line.qty}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateLineQty(line.id, 1)}
                                    className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="py-3.5 px-3 font-mono text-slate-800 whitespace-nowrap font-medium">
                                ${line.unit_price?.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-2 text-center whitespace-nowrap">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={line.discount_pct}
                                  onChange={(e) => updateLineDiscount(line.id, e.target.value)}
                                  className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-center font-bold text-slate-900 focus:outline-none focus:border-[#714B67]"
                                />
                              </td>
                              <td className="py-3.5 px-2 font-semibold text-slate-500 text-xs text-center whitespace-nowrap">
                                {line.discount_limit_pct}%
                              </td>
                              <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                {isOver ? (
                                  <Badge variant="danger" className="whitespace-nowrap">
                                    OVER ({(line.discount_pct - line.discount_limit_pct).toFixed(1)}%)
                                  </Badge>
                                ) : (
                                  <Badge variant="success" className="whitespace-nowrap">OK</Badge>
                                )}
                              </td>
                              <td className="py-3.5 px-3.5 text-right font-extrabold text-slate-900 font-mono whitespace-nowrap">
                                ${subtotal.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeLine(line.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded hover:bg-rose-50"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Total Net Quotation Amount:</span>
                  <span className="text-2xl font-black text-[#714B67]">${totalAmount.toLocaleString()}</span>
                </div>
              </Card>

              <Card title="Add Catalog Product" subtitle="Search and add products to the quote">
                <div className="relative">
                  {/* Search Input */}
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={`Search from ${products.length} products by name, category or SKU…`}
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductResults(true);
                      }}
                      onFocus={() => setShowProductResults(true)}
                      className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/10 transition-all"
                    />
                    {productSearch && (
                      <button
                        type="button"
                        onClick={() => { setProductSearch(''); setShowProductResults(false); }}
                        className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Results Dropdown */}
                  {showProductResults && filteredProducts.length > 0 && (
                    <div className="absolute z-30 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                      <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>{productSearch ? `Matching Products (${filteredProducts.length})` : `Catalog Products (Showing ${filteredProducts.length} of ${products.length})`}</span>
                        <span className="text-slate-400">Click to add to quote</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {filteredProducts.map((p) => {
                          const pId = p.id || p._id;
                          const stockInfo = p.is_subscription
                            ? 'SaaS — Instant'
                            : `${p.stock_on_hand ?? 45} in stock`;
                          const isAlreadyAdded = lines.some((l) => l.product_id === pId);
                          return (
                            <button
                              key={pId}
                              type="button"
                              onClick={() => {
                                addProductToQuote(p);
                                setProductSearch('');
                                setShowProductResults(false);
                              }}
                              className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#714B67]/5 transition-colors text-left cursor-pointer group"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-slate-900 truncate">{p.name}</span>
                                  {p.is_subscription && <Badge variant="brand" className="text-[10px] shrink-0">SaaS</Badge>}
                                  {isAlreadyAdded && <Badge variant="success" className="text-[10px] shrink-0">In Cart</Badge>}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-slate-400">{p.category_name || 'Hardware'}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-xs text-slate-400">{stockInfo}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-sm font-bold text-[#714B67] font-mono">
                                  ${(p.base_price || p.price)?.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 text-xs font-bold text-white bg-[#714B67] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Plus className="w-3 h-3" />
                                  {isAlreadyAdded ? 'Add More' : 'Add'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {showProductResults && productSearch && filteredProducts.length === 0 && (
                    <div className="absolute z-30 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-5 text-center text-sm text-slate-500">
                      No products found for &quot;{productSearch}&quot;
                    </div>
                  )}

                  {!productSearch && (
                    <p className="mt-2 text-xs text-slate-400">
                      Type to search across <span className="font-semibold text-slate-600">{products.length}</span> catalog products
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* AI Upsell Recommendations */}
            <div>
              <Card
                title="AI Upsell Recommendations"
                subtitle="Margin-boost suggestions tailored to customer tier"
              >
                <div className="space-y-3">
                  {upsellRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 bg-slate-50 border border-purple-200 rounded-xl space-y-2 hover:border-[#714B67] transition-colors shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#714B67]">
                          {rule.suggested_product_name}
                        </span>
                        <Badge variant="purple">+${rule.margin_delta} Margin</Badge>
                      </div>
                      <p className="text-xs text-slate-600">
                        Promoted cross-sell package with high margin potential ({rule.min_margin_pct}% margin).
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <span className="text-sm font-extrabold text-slate-900">
                          ${rule.suggested_price?.toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Sparkles}
                          onClick={() => addUpsellToQuote(rule)}
                        >
                          Add to Quote
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuotationBuilderView;
