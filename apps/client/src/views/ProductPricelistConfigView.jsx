import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { ArrowLeft, Save, Plus } from 'lucide-react';

export const ProductPricelistConfigView = ({ product, categories = [], onBack, onSaveProduct }) => {
  const initialCategory = product ? (typeof product.category_id === 'object' ? product.category_id?._id : product.category_id) : (categories[0]?._id || categories[0]?.id || 'cat-1');
  const [name, setName] = useState(product ? product.name : '');
  const [categoryId, setCategoryId] = useState(initialCategory || 'cat-1');
  const [unit, setUnit] = useState(product ? product.unit : 'unit');
  const [basePrice, setBasePrice] = useState(product ? product.base_price : 1000);
  const [taxPct, setTaxPct] = useState(product ? product.tax_pct : 8.5);
  const [isSubscription, setIsSubscription] = useState(product ? product.is_subscription : false);
  const [recurringCycle, setRecurringCycle] = useState(product ? product.recurring_cycle || 'monthly' : 'monthly');
  const [description, setDescription] = useState(product ? product.description : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProduct({
      _id: product?._id,
      id: product?._id || product?.id,
      name,
      category_id: categoryId,
      unit,
      base_price: Number(basePrice),
      tax_pct: Number(taxPct),
      is_subscription: isSubscription,
      recurring_cycle: isSubscription ? recurringCycle : null,
      description
    });
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {product ? `Configure: ${product.name}` : 'Create New Product Master'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Set product attributes, recurring engine parameters & variants
            </p>
          </div>
        </div>

        <Button variant="primary" icon={Save} onClick={handleSubmit}>
          Save Product Configuration
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card title="Product Master Details" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#714B67]"
                >
                  {categories.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input label="Unit of Measure" value={unit} onChange={(e) => setUnit(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Base List Price ($)"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
              <Input label="Tax Rate (%)" type="number" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} required />
            </div>

            {/* Dynamic Subscription Toggle */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-900 block">Recurring Subscription Product?</span>
                  <span className="text-xs text-slate-500">Drives recurring cycle billing engine</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubscription(!isSubscription)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    isSubscription ? 'bg-[#714B67]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isSubscription ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Dynamically render Recurring Frequency selector when is_subscription = true */}
              {isSubscription && (
                <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#714B67]">Recurring Frequency:</span>
                  <select
                    value={recurringCycle}
                    onChange={(e) => setRecurringCycle(e.target.value)}
                    className="bg-white border border-[#714B67]/50 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
                  >
                    <option value="monthly">Monthly Cycle</option>
                    <option value="quarterly">Quarterly Cycle</option>
                    <option value="yearly">Yearly Cycle</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Product Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
                rows={3}
              />
            </div>
          </form>
        </Card>

        {/* Variant Setup Card */}
        <div className="space-y-4">
          <Card title="Product Attribute Variants" subtitle="Multi-attribute price adjustment matrix">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">RAM: 128GB ECC</span>
                  <span className="text-[10px] text-slate-500">Attribute Variant</span>
                </div>
                <Badge variant="success">+$1,200</Badge>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">RAM: 256GB ECC</span>
                  <span className="text-[10px] text-slate-500">Attribute Variant</span>
                </div>
                <Badge variant="success">+$2,400</Badge>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <Button size="sm" variant="outline" icon={Plus} className="w-full">
                Add Attribute Variant
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductPricelistConfigView;
