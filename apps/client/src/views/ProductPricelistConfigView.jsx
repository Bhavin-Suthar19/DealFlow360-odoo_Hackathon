import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { ArrowLeft, Save, Plus, Trash2, Tag, Layers, Check } from 'lucide-react';

export const ProductPricelistConfigView = ({
  product,
  categories = [],
  variants = [],
  onBack,
  onSaveProduct,
  onAddVariant,
  onDeleteVariant
}) => {
  const prodId = product?._id || product?.id;
  const initialCategory = product
    ? (typeof product.category_id === 'object' ? product.category_id?._id : product.category_id)
    : (categories[0]?._id || categories[0]?.id || 'cat-1');

  const [name, setName] = useState(product ? product.name : '');
  const [categoryId, setCategoryId] = useState(initialCategory || 'cat-1');
  const [unit, setUnit] = useState(product ? product.unit : 'unit');
  const [basePrice, setBasePrice] = useState(product ? (product.base_price ?? product.price ?? 1000) : 1000);
  const [taxPct, setTaxPct] = useState(product ? product.tax_pct : 8.5);
  const [stockOnHand, setStockOnHand] = useState(product ? (product.stock_on_hand ?? 50) : 50);
  const [isSubscription, setIsSubscription] = useState(product ? !!product.is_subscription : false);
  const [recurringCycle, setRecurringCycle] = useState(product ? product.recurring_cycle || 'monthly' : 'monthly');
  const [description, setDescription] = useState(product ? product.description : '');

  // Dynamic Product Variants from DB
  const productVariants = variants.filter(
    (v) => (v.product_id?._id || v.product_id) === prodId
  );

  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrVal, setNewAttrVal] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState(0);
  const [isSavingVariant, setIsSavingVariant] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProduct({
      _id: prodId,
      id: prodId,
      name,
      category_id: categoryId,
      unit,
      base_price: Number(basePrice) || 0,
      tax_pct: Number(taxPct) || 0,
      stock_on_hand: Number(stockOnHand) || 0,
      is_subscription: isSubscription,
      recurring_cycle: isSubscription ? recurringCycle : null,
      description
    });
  };

  const handleCreateVariant = async (e) => {
    e.preventDefault();
    if (!newAttrName.trim() || !newAttrVal.trim() || !prodId) return;
    setIsSavingVariant(true);
    try {
      if (onAddVariant) {
        await onAddVariant(prodId, {
          attribute_name: newAttrName.trim(),
          attribute_value: newAttrVal.trim(),
          extra_price: Number(newExtraPrice) || 0
        });
      }
      setNewAttrName('');
      setNewAttrVal('');
      setNewExtraPrice(0);
      setIsAddingVariant(false);
    } finally {
      setIsSavingVariant(false);
    }
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
              Live Database Integration: Master pricing, stock attributes & variant matrix
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
        <Card title="Product Master Details" subtitle="Connected to MongoDB Products collection" className="lg:col-span-2">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Base List Price ($)"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
              <Input
                label="Available Stock"
                type="number"
                value={stockOnHand}
                onChange={(e) => setStockOnHand(e.target.value)}
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

        {/* Dynamic Database Variant Setup Card */}
        <div className="space-y-4">
          <Card
            title="Product Attribute Variants"
            subtitle={`${productVariants.length} dynamic variants in database`}
          >
            <div className="space-y-3">
              {productVariants.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs italic">No attribute variants configured for this product yet.</p>
                </div>
              ) : (
                productVariants.map((v) => {
                  const varId = v._id || v.id;
                  return (
                    <div
                      key={varId}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {v.attribute_name}: {v.attribute_value}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">DB ID: {varId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={v.extra_price > 0 ? 'success' : 'default'}>
                          {v.extra_price > 0 ? `+$${v.extra_price.toLocaleString()}` : '$0 (Standard)'}
                        </Badge>
                        {onDeleteVariant && (
                          <button
                            type="button"
                            onClick={() => onDeleteVariant(varId)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded"
                            title="Delete variant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Variant Form */}
            {isAddingVariant ? (
              <form onSubmit={handleCreateVariant} className="mt-4 p-3 bg-purple-50/50 border border-[#714B67]/20 rounded-xl space-y-3">
                <span className="text-xs font-bold text-[#714B67] block">Add Database Attribute Variant</span>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="e.g. RAM, Color"
                    value={newAttrName}
                    onChange={(e) => setNewAttrName(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="e.g. 128GB ECC"
                    value={newAttrVal}
                    onChange={(e) => setNewAttrVal(e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Extra Price ($)"
                  type="number"
                  value={newExtraPrice}
                  onChange={(e) => setNewExtraPrice(e.target.value)}
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingVariant(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="primary" icon={Check} disabled={isSavingVariant}>
                    {isSavingVariant ? 'Saving...' : 'Save to DB'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <Button
                  size="sm"
                  variant="outline"
                  icon={Plus}
                  className="w-full"
                  onClick={() => setIsAddingVariant(true)}
                  disabled={!prodId}
                >
                  {prodId ? 'Add Attribute Variant' : 'Save Product First to Add Variants'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductPricelistConfigView;
