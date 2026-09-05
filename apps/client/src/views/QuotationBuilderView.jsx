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
  Save
} from 'lucide-react';

export const QuotationBuilderView = ({ quote, products = [], upsellRules = [], onBack, onSubmitQuote, onSaveDraft }) => {
  const [lines, setLines] = useState(quote ? quote.lines : []);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');

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
        unit_price: prod.base_price,
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

  const overageLines = lines.filter((l) => l.discount_pct > l.discount_limit_pct);
  const totalAmount = lines.reduce((sum, l) => sum + l.qty * l.unit_price * (1 - l.discount_pct / 100), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{quote ? quote.quote_number : 'Q-1045'}</h1>
              <Badge variant="warning">{quote ? quote.customer_tier : 'Gold Tier'}</Badge>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Customer: {quote ? quote.customer_name : 'Acme Corp'}</span>
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

      {/* Compliance Banner */}
      {overageLines.length > 0 ? (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/50 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">Discount Governance Exception Detected</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300/80">
                {overageLines.length} item(s) exceed ceiling limits. Submitting will trigger Manager / Finance approval routing.
              </p>
            </div>
          </div>
          <Badge variant="warning">Requires Approval</Badge>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 rounded-xl p-4 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Discount Governance Compliant</h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-300/80">All line discounts are within pre-approved category ceiling limits.</p>
          </div>
        </div>
      )}

      {/* Cart & Upsell Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Itemized Cart Builder" subtitle="Adjust quantities, line discounts, and snapshot ceiling limits">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300">
                <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {lines.map((line) => {
                    const isOver = line.discount_pct > line.discount_limit_pct;
                    const subtotal = line.qty * line.unit_price * (1 - line.discount_pct / 100);
                    return (
                      <tr key={line.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                          {line.product_name}
                          {line.is_upsell && <Badge variant="purple" className="ml-2">Upsell</Badge>}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-1">
                            <button onClick={() => updateLineQty(line.id, -1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">{line.qty}</span>
                            <button onClick={() => updateLineQty(line.id, 1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">${line.unit_price.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={line.discount_pct}
                            onChange={(e) => updateLineDiscount(line.id, e.target.value)}
                            className="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded px-2 py-1 text-xs text-center font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
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
                        <td className="py-3 px-3 text-right font-extrabold text-slate-900 dark:text-white">${subtotal.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center">
                          <button onClick={() => removeLine(line.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Net Quotation Amount:</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${totalAmount.toLocaleString()}</span>
            </div>
          </Card>

          <Card title="Add Catalog Product" subtitle="Select products to insert into quote cart">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.base_price.toLocaleString()} ({p.category_name})
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  const prod = products.find((p) => p.id === selectedProduct);
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
                <div key={rule.id} className="p-4 bg-slate-50 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-500/20 rounded-xl space-y-2 hover:border-indigo-400 transition-colors shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{rule.suggested_product_name}</span>
                    <Badge variant="purple">+${rule.margin_delta} Margin</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Promoted cross-sell package with high margin potential ({rule.min_margin_pct}% margin).</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">${rule.suggested_price.toLocaleString()}</span>
                    <Button size="sm" variant="outline" icon={Plus} onClick={() => addUpsellToQuote(rule)}>
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
