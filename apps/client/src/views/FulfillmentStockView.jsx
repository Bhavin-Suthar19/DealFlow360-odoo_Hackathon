import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ArrowRight } from 'lucide-react';

export const FulfillmentStockView = ({ stock = [], fulfillmentOrders = [], onSelectOrder }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fulfillment & Stock Overview</h1>
          <p className="text-sm text-slate-500">Multi-warehouse stock reservation & auto-split order routing</p>
        </div>
      </div>

      {/* Warehouse Stock Matrix */}
      <Card title="Warehouse Stock Levels" subtitle="Real-time available inventory = (In Stock - Reserved)">
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
              {stock.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{st.warehouse_name}</td>
                  <td className="py-3 px-4 text-[#714B67] font-semibold">{st.product_name}</td>
                  <td className="py-3 px-4 text-center font-mono">{st.qty_in_stock}</td>
                  <td className="py-3 px-4 text-center font-mono text-amber-600">{st.qty_reserved}</td>
                  <td className="py-3 px-4 text-center font-mono font-extrabold text-emerald-600">{st.qty_available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Orders Awaiting Fulfillment */}
      <Card title="Orders Awaiting Fulfillment" subtitle="Confirmed quotations ready for warehouse split allocation">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Quote #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Split Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fulfillmentOrders.map((fo) => (
                <tr key={fo.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{fo.id}</td>
                  <td className="py-3.5 px-4 font-bold text-[#714B67]">{fo.quote_number}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{fo.customer_name}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="warning">{fo.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button size="sm" variant="primary" icon={ArrowRight} onClick={() => onSelectOrder(fo.id)}>
                      Review Split
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FulfillmentStockView;
