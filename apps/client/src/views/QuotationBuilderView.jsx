import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Send,
  Save,
  Sparkles
} from 'lucide-react';

export const QuotationBuilderView = ({
  quote,
  products = [],
  upsellRules = [],
  onBack,
  onSubmitQuote,
  onSaveDraft
}) => {
  const customerList = [
    { id: 'c-101', name: 'Acme Corp', tier: 'Gold' },
    { id: 'c-102', name: 'TechCorp Inc', tier: 'Platinum' },
    { id: 'c-103', name: 'Global Finance Ltd', tier: 'Enterprise' },
    { id: 'c-104', name: 'Apex Systems', tier: 'Silver' }
  ];

  const [customer, setCustomer] = useState(
    quote?.customer_name
      ? customerList.find((c) => c.name === quote.customer_name) || customerList[0]
      : customerList[0]
  );

  const [lines, setLines] = useState(() => {
    if (quote?.lines && quote.lines.length > 0) return quote.lines;
    return [
      {
        id: `ql-${Date.now()}-1`,
        product_id: products[0]?.id || 'p-1',
        product_name: products[0]?.name || 'Enterprise Cloud ERP Platform',
        qty: 1,
        unit_price: products[0]?.base_price || 12000,
        discount_pct: 10,
        discount_limit_pct: 15,
        line_type: 'recurring',
        is_upsell: false
      }
    ];
  });

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');

  const updateLineQty = (lineId, delta) => {
    setLines(lines.map((l) => (l.id === lineId ? { ...l, qty: Math.max(1, l.qty + delta) } : l)));
  };

  const updateLineDiscount = (lineId, pct) => {
    setLines(lines.map((l) => (l.id === lineId ? { ...l, discount_pct: Math.min(100, Math.max(0, Number(pct))) } : l)));
  };

  const removeLine = (lineId) => {
    setLines(lines.filter((l) => l.id !== lineId));
  };

  const addProductToQuote = (prod) => {
    const existing = lines.find((l) => l.product_id === prod.id);
    if (existing) {
      updateLineQty(existing.id, 1);
    } else {
      const newLine = {
        id: `ql-${Date.now()}`,
        product_id: prod.id,
        product_name: prod.name,
        qty: 1,
        unit_price: prod.base_price || 1000,
        discount_pct: 0,
        discount_limit_pct: prod.category_name === 'Hardware' ? 10 : 15,
        line_type: prod.is_subscription ? 'recurring' : 'one_time',
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
      qty: 1,
      unit_price: rule.suggested_price,
      discount_pct: 0,
      discount_limit_pct: 15,
      line_type: 'recurring',
      is_upsell: true
    };
    setLines([...lines, newLine]);
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
              <Badge variant={blendedRiskScore > 15 ? 'danger' : blendedRiskScore > 5 ? 'warning' : 'success'}>
                Risk Score: {blendedRiskScore}%
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive Sales Quotation & Governance Builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Save} onClick={() => onSaveDraft(lines)}>
            Save Draft
          </Button>
          <Button variant="primary" icon={Send} onClick={() => onSubmitQuote(lines)}>
            Submit for Approval
          </Button>
        </div>
      </div>

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
              <h4 className="text-sm font-bold text-amber-900">Discount Governance Exception Detected</h4>
              <p className="text-xs text-amber-800">
                {overageLines.length} item(s) exceed approved ceiling limits. Submitting will trigger Sales Manager & Finance approval routing.
              </p>
            </div>
          </div>
          <Badge variant="warning">Requires Approval</Badge>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900">Discount Governance Compliant</h4>
            <p className="text-xs text-emerald-800">All line discounts are within pre-approved category ceiling limits.</p>
          </div>
        </div>
      )}

      {/* Cart & Upsell Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Itemized Cart Builder" subtitle="Adjust quantities, line discounts, and snapshot ceiling limits">
            {lines.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No items added yet. Select a catalog product below to insert line items into the quotation.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-800">
                  <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Product Name</th>
                      <th className="py-3 px-3 text-center">Qty</th>
                      <th className="py-3 px-3">Unit Price</th>
                      <th className="py-3 px-3">Discount %</th>
                      <th className="py-3 px-3">Ceiling %</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Subtotal</th>
                      <th className="py-3 px-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lines.map((line) => {
                      const isOver = line.discount_pct > line.discount_limit_pct;
                      const subtotal = line.qty * line.unit_price * (1 - line.discount_pct / 100);
                      return (
                        <tr key={line.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {line.product_name}
                            {line.is_upsell && <Badge variant="purple" className="ml-2">Upsell</Badge>}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1.5 bg-slate-100 border border-slate-300 rounded-lg p-1">
                              <button onClick={() => updateLineQty(line.id, -1)} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-6 text-center">{line.qty}</span>
                              <button onClick={() => updateLineQty(line.id, 1)} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono">${line.unit_price?.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              value={line.discount_pct}
                              onChange={(e) => updateLineDiscount(line.id, e.target.value)}
                              className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-center font-bold text-slate-900 focus:outline-none focus:border-[#714B67]"
                            />
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-500 text-xs">{line.discount_limit_pct}%</td>
                          <td className="py-3 px-3">
                            {isOver ? (
                              <Badge variant="danger">OVER ({line.discount_pct - line.discount_limit_pct}%)</Badge>
                            ) : (
                              <Badge variant="success">OK</Badge>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-extrabold text-slate-900">${subtotal.toLocaleString()}</td>
                          <td className="py-3 px-3 text-center">
                            <button onClick={() => removeLine(line.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer">
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

          <Card title="Add Catalog Product" subtitle="Select products to insert into quote cart">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#714B67]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.base_price?.toLocaleString()} ({p.category_name || 'Software'})
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  const prod = products.find((p) => p.id === selectedProductId) || products[0];
                  if (prod) addProductToQuote(prod);
                }}
              >
                Add Item
              </Button>
            </div>
          </Card>
        </div>

        {/* AI Upsell Recommendations */}
        <div>
          <Card title="AI Upsell Recommendations" subtitle="Margin-boost suggestions tailored to customer tier">
            <div className="space-y-3">
              {upsellRules.map((rule) => (
                <div key={rule.id} className="p-4 bg-slate-50 border border-purple-200 rounded-xl space-y-2 hover:border-[#714B67] transition-colors shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#714B67]">{rule.suggested_product_name}</span>
                    <Badge variant="purple">+${rule.margin_delta} Margin</Badge>
                  </div>
                  <p className="text-xs text-slate-600">Promoted cross-sell package with high margin potential ({rule.min_margin_pct}% margin).</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-sm font-extrabold text-slate-900">${rule.suggested_price?.toLocaleString()}</span>
                    <Button size="sm" variant="outline" icon={Sparkles} onClick={() => addUpsellToQuote(rule)}>
                      Add to Quote
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuotationBuilderView;
