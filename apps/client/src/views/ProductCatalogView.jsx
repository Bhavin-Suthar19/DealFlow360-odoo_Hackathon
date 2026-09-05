import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Package, Plus, ArrowRight, Layers, DollarSign } from 'lucide-react';

export const ProductCatalogView = ({ products = [], variants = [], priceLists = [], onSelectProduct, onCreateProduct }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product & Price Catalog</h1>
          <p className="text-sm text-slate-500">Master product data, attribute variants, and price rules</p>
        </div>

        <Button variant="primary" icon={Plus} onClick={onCreateProduct}>
          Create New Product
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Active Products
            </span>
            <Package className="w-5 h-5 text-[#714B67]" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{products.length}</span>
            <Badge variant="brand">Catalog Active</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Configured Variants
            </span>
            <Layers className="w-5 h-5 text-[#714B67]" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{variants.length} SKUs</span>
            <Badge variant="purple">SKU Matrix</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pricelists Configured
            </span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{priceLists.length} Tiers</span>
            <Badge variant="success">Active Matrices</Badge>
          </div>
        </Card>
      </div>

      {/* Product Table */}
      <Card title="Master Product Master Index">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Unit</th>
                <th className="py-3.5 px-4 text-right">Base Price</th>
                <th className="py-3.5 px-4 text-center">Subscription?</th>
                <th className="py-3.5 px-4 text-center">Tax %</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((p) => {
                const prodId = p._id || p.id;
                const catName = p.category_name || (typeof p.category_id === 'object' ? p.category_id?.name : (p.category_id === 'cat-1' ? 'Hardware' : p.category_id === 'cat-2' ? 'SaaS Subscriptions' : p.category_id === 'cat-3' ? 'Professional Services' : p.category_id || 'General'));
                return (
                  <tr key={prodId} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3.5 px-4 text-[#714B67] font-semibold">{catName}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">{p.unit || 'unit'}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                      ${(p.base_price || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {p.is_subscription ? <Badge variant="purple">Yes ({p.recurring_cycle || 'monthly'})</Badge> : <Badge variant="default">No</Badge>}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600 font-mono">{p.tax_pct || 0}%</td>
                    <td className="py-3.5 px-4 text-right">
                      <Button size="sm" variant="ghost" icon={ArrowRight} onClick={() => onSelectProduct(prodId)}>
                        Configure
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProductCatalogView;
