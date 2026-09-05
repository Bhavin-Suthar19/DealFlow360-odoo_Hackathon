import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ArrowLeft, CheckCircle2, SlidersHorizontal, Truck } from 'lucide-react';

export const FulfillmentSplitDetailView = ({ order, onBack, onAcceptSplit, onManualOverride }) => {
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [splits, setSplits] = useState(order ? order.splits : []);

  if (!order) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fulfillment Allocation: {order.quote_number}</h1>
              <Badge variant="warning">{order.status}</Badge>
            </div>
            <span className="text-xs text-slate-500">Customer: {order.customer_name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={SlidersHorizontal} onClick={() => setIsOverrideMode(!isOverrideMode)}>
            {isOverrideMode ? 'Cancel Override' : 'Manual Override'}
          </Button>
          <Button variant="success" icon={CheckCircle2} onClick={() => onAcceptSplit(order.id)}>
            Accept Suggested Split
          </Button>
        </div>
      </div>

      {/* Optimization Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-[#714B67] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[#714B67]">Algorithmic Shipping Cost Optimization Applied</h4>
            <p className="text-xs text-slate-600">
              Split configured to minimize total shipment passes weighted by warehouse shipping weight.
            </p>
          </div>
        </div>
        <Badge variant="purple">Optimal Route</Badge>
      </div>

      {/* Matrix Table */}
      <Card title="Warehouse Allocation Matrix" subtitle="Detailed breakdown of per-warehouse item split and freight cost">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Warehouse Depot</th>
                <th className="py-3 px-4">Product Allocated</th>
                <th className="py-3 px-4 text-center">Qty Fulfilled</th>
                <th className="py-3 px-4 text-center">Est. Shipments</th>
                <th className="py-3 px-4 text-right">Freight Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {splits.map((sp, idx) => (
                <tr key={sp.id || idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{sp.warehouse_name}</td>
                  <td className="py-3 px-4 text-[#714B67] font-semibold">{sp.product_name}</td>
                  <td className="py-3 px-4 text-center">
                    {isOverrideMode ? (
                      <input
                        type="number"
                        value={sp.qty_fulfilled}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSplits(splits.map((s, i) => (i === idx ? { ...s, qty_fulfilled: val } : s)));
                        }}
                        className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-center font-bold text-slate-900 focus:outline-none focus:border-[#714B67]"
                      />
                    ) : (
                      <span className="font-extrabold text-slate-900">{sp.qty_fulfilled}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">{sp.estimated_shipments} shipment</td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-600">${sp.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isOverrideMode && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
            <Button variant="warning" onClick={() => onManualOverride(order.id, splits)}>
              Save Manual Allocations
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FulfillmentSplitDetailView;
