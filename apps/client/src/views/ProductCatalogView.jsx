import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import usePagination from '../hooks/usePagination';
import { Package, Plus, ArrowRight, Layers, DollarSign, Search, X, Filter, Eye } from 'lucide-react';

export const ProductCatalogView = ({
  products = [],
  categories = [],
  variants = [],
  priceLists = [],
  onSelectProduct,
  onCreateProduct,
  currentUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  const isSalesRep = currentUser?.role === 'sales_rep';
  const isAdmin = currentUser?.role === 'admin' || !currentUser?.role;

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const catMatch = categories.find((c) => (c._id || c.id) === (p.category_id?._id || p.category_id));
      const catName = p.category_name || (typeof p.category_id === 'object' ? p.category_id?.name : catMatch?.name || (p.category_id === 'cat-1' ? 'Hardware' : p.category_id === 'cat-2' ? 'SaaS Subscriptions' : p.category_id === 'cat-3' ? 'Professional Services' : p.category_id || 'General'));

      const pCatId = p.category_id?._id || p.category_id;
      const matchesCategory = selectedCategoryId === 'all' || pCatId === selectedCategoryId || catName.toLowerCase() === selectedCategoryId.toLowerCase();

      const matchesQuery = !q || (
        p.name?.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        catName.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.unit && p.unit.toLowerCase().includes(q))
      );

      return matchesCategory && matchesQuery;
    });
  }, [products, categories, searchQuery, selectedCategoryId]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedProducts,
    onPageChange,
    onPageSizeChange
  } = usePagination(filteredProducts, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product & Price Catalog</h1>
          <p className="text-sm text-slate-500">Master product data, attribute variants, and price rules</p>
        </div>

        {/* Create Product Button: Only shown for administrators, REMOVED for sales reps */}
        {isAdmin && !isSalesRep && onCreateProduct && (
          <Button variant="primary" icon={Plus} onClick={onCreateProduct}>
            Create New Product
          </Button>
        )}
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

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, category, SKU, or unit..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/10 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-medium focus:bg-white focus:outline-none focus:border-[#714B67] cursor-pointer"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => {
                const cId = c._id || c.id;
                const count = products.filter((p) => (p.category_id?._id || p.category_id) === cId || p.category_name === c.name).length;
                return (
                  <option key={cId} value={cId}>
                    {c.name} {count > 0 ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> of{' '}
            <span className="font-bold text-slate-800">{products.length}</span> total products
            {searchQuery && (
              <span> matching &ldquo;<span className="font-semibold text-[#714B67]">{searchQuery}</span>&rdquo;</span>
            )}
          </div>
          {(searchQuery || selectedCategoryId !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
              }}
              className="text-xs font-semibold text-[#714B67] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

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
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Package className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-700">No products found matching your search</p>
                      <p className="text-xs text-slate-400">Try adjusting your keyword or category filter</p>
                      {(searchQuery || selectedCategoryId !== 'all') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategoryId('all');
                          }}
                          className="mt-2"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const prodId = p._id || p.id;
                  const catMatch = categories.find((c) => (c._id || c.id) === (p.category_id?._id || p.category_id));
                  const catName = p.category_name || (typeof p.category_id === 'object' ? p.category_id?.name : catMatch?.name || (p.category_id === 'cat-1' ? 'Hardware' : p.category_id === 'cat-2' ? 'SaaS Subscriptions' : p.category_id === 'cat-3' ? 'Professional Services' : p.category_id || 'General'));
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
                        <Button
                          size="sm"
                          variant={isSalesRep ? 'outline' : 'ghost'}
                          icon={isSalesRep ? Eye : ArrowRight}
                          onClick={() => onSelectProduct(prodId)}
                        >
                          {isSalesRep ? 'View Details' : 'Configure'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Card>
    </div>
  );
};

export default ProductCatalogView;
