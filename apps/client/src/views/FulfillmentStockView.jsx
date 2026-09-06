import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import usePagination from '../hooks/usePagination';
import { ArrowRight } from 'lucide-react';

export const FulfillmentStockView = ({ stock = [], fulfillmentOrders = [], onSelectOrder }) => {
  const [stockSearch, setStockSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const filteredStock = useMemo(() => {
    if (!stockSearch.trim()) return stock;
    const q = stockSearch.toLowerCase();
    return stock.filter((st) => {
      const whName = (st.warehouse_name || st.warehouse_id?.name || '').toLowerCase();
      const pName = (st.product_name || st.product_id?.name || '').toLowerCase();
      return whName.includes(q) || pName.includes(q);
    });
  }, [stock, stockSearch]);

  const filteredOrders = useMemo(() => {
    if (!orderSearch.trim()) return fulfillmentOrders;
    const q = orderSearch.toLowerCase();
    return fulfillmentOrders.filter((fo) => {
      const qNum = (fo.quote_number || fo.quotation_id?.quote_number || '').toLowerCase();
      const cName = (fo.customer_name || fo.quotation_id?.customer_name || fo.quotation_id?.customer_id?.name || '').toLowerCase();
      const oId = (fo._id || fo.id || '').toLowerCase();
      return qNum.includes(q) || cName.includes(q) || oId.includes(q);
    });
  }, [fulfillmentOrders, orderSearch]);

  const stockPagination = usePagination(filteredStock, 10);
  const ordersPagination = usePagination(filteredOrders, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fulfillment & Stock Overview</h1>
          <p className="text-sm text-slate-500">Multi-warehouse stock reservation & auto-split order routing</p>
        </div>
      </div>

      {/* Orders Awaiting Fulfillment */}
      <Card
        title="Orders Awaiting Fulfillment & Split"
        subtitle="Confirmed quotations ready for warehouse split allocation"
      >
        {/* Search Input for Orders */}
        <div className="mb-4">
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search orders by quote #, customer name, or order ID..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/10 transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Quote #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Splits Count</th>
                <th className="py-3.5 px-4">Split Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordersPagination.paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    {orderSearch ? `No fulfillment orders matching "${orderSearch}".` : 'No fulfillment orders found.'}
                  </td>
                </tr>
              ) : (
                ordersPagination.paginatedItems.map((fo) => {
                  const orderId = fo._id || fo.id;
                  const quoteNumber = fo.quote_number || fo.quotation_id?.quote_number || 'Confirmed Quote';
                  const customerName = fo.customer_name || fo.quotation_id?.customer_name || fo.quotation_id?.customer_id?.name || 'Enterprise Customer';
                  const splitCount = fo.splits?.length || 0;
                  const getBadgeVariant = (st) => {
                    if (st === 'Allocated' || st === 'Fulfilled') return 'success';
                    if (st === 'Backorder') return 'danger';
                    return 'warning';
                  };

                  return (
                    <tr key={orderId} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{orderId.slice(-8)}</td>
                      <td className="py-3.5 px-4 font-bold text-[#714B67]">{quoteNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{customerName}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {splitCount > 0 ? `${splitCount} hub(s)` : 'Pending Calc'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={getBadgeVariant(fo.status)}>{fo.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button size="sm" variant="primary" icon={ArrowRight} onClick={() => onSelectOrder(orderId)}>
                          Review Split
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Orders Pagination */}
        <Pagination
          currentPage={ordersPagination.currentPage}
          totalPages={ordersPagination.totalPages}
          totalItems={ordersPagination.totalItems}
          pageSize={ordersPagination.pageSize}
          onPageChange={ordersPagination.onPageChange}
          onPageSizeChange={ordersPagination.onPageSizeChange}
        />
      </Card>

      {/* Warehouse Stock Matrix */}
      <Card title="Warehouse Stock Levels" subtitle="Real-time available inventory = (In Stock - Reserved)">
        {/* Stock Search */}
        <div className="mb-4">
          <input
            type="text"
            value={stockSearch}
            onChange={(e) => setStockSearch(e.target.value)}
            placeholder="Search warehouse stock by product or depot name..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/10 transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Warehouse Name</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4 text-center">In Stock</th>
                <th className="py-3 px-4 text-center">Reserved</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockPagination.paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                    {stockSearch ? `No inventory matching "${stockSearch}".` : 'No stock inventory data found.'}
                  </td>
                </tr>
              ) : (
                stockPagination.paginatedItems.map((st) => (
                  <tr key={st._id || st.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{st.warehouse_name || st.warehouse_id?.name || 'Main Warehouse'}</td>
                    <td className="py-3 px-4 text-[#714B67] font-semibold">{st.product_name || st.product_id?.name || 'Product'}</td>
                    <td className="py-3 px-4 text-center font-mono">{st.qty_in_stock ?? 0}</td>
                    <td className="py-3 px-4 text-center font-mono text-amber-600">{st.qty_reserved ?? 0}</td>
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-emerald-600">
                      {st.qty_available ?? Math.max(0, (st.qty_in_stock || 0) - (st.qty_reserved || 0))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stock Pagination */}
        <Pagination
          currentPage={stockPagination.currentPage}
          totalPages={stockPagination.totalPages}
          totalItems={stockPagination.totalItems}
          pageSize={stockPagination.pageSize}
          onPageChange={stockPagination.onPageChange}
          onPageSizeChange={stockPagination.onPageSizeChange}
        />
      </Card>
    </div>
  );
};

export default FulfillmentStockView;
