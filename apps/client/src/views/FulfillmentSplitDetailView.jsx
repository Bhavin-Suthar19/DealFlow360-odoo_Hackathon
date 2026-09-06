import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ArrowLeft, CheckCircle2, SlidersHorizontal, Truck, Package, RefreshCw, AlertCircle } from 'lucide-react';

export const FulfillmentSplitDetailView = ({ order, onBack, onAcceptSplit, onManualOverride }) => {
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [splits, setSplits] = useState(order?.splits || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order?.splits) {
      setSplits(order.splits);
    } else {
      setSplits([]);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
        <p className="font-semibold text-slate-700">No fulfillment order selected.</p>
        <Button variant="ghost" icon={ArrowLeft} onClick={onBack} className="mt-4">
          Back to Fulfillment Overview
        </Button>
      </div>
    );
  }

  const orderId = order._id || order.id;
  const quoteNumber = order.quote_number || order.quotation_id?.quote_number || 'Confirmed Quote';
  const customerName = order.customer_name || order.quotation_id?.customer_name || order.quotation_id?.customer_id?.name || 'Enterprise Customer';
  const totalCost = splits.reduce((sum, s) => sum + Number(s.cost || 0), 0);
  const totalQty = splits.reduce((sum, s) => sum + Number(s.qty_fulfilled || 0), 0);
  const totalShipments = splits.reduce((sum, s) => sum + Number(s.estimated_shipments || 1), 0);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await onAcceptSplit(orderId, splits);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverrideSave = async () => {
    setIsSubmitting(true);
    try {
      await onManualOverride(orderId, splits);
    } finally {
      setIsSubmitting(false);
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fulfillment Allocation: {quoteNumber}</h1>
              <Badge variant={order.status === 'Allocated' || order.status === 'Fulfilled' ? 'success' : 'warning'}>
                {order.status}
              </Badge>
            </div>
            <span className="text-xs text-slate-500">
              Customer: <strong className="text-slate-800">{customerName}</strong> • Order Ref: <span className="font-mono text-xs">{orderId}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={SlidersHorizontal}
            onClick={() => setIsOverrideMode(!isOverrideMode)}
            disabled={isSubmitting}
          >
            {isOverrideMode ? 'Cancel Edit' : 'Manual Override'}
          </Button>
          <Button
            variant="success"
            icon={CheckCircle2}
            onClick={handleAccept}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Allocating...' : 'Accept Suggested Split'}
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Allocated Units</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">{totalQty} units</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Estimated Freight Passes</span>
          <span className="text-2xl font-extrabold text-[#714B67] mt-1 block font-mono">{totalShipments} shipments</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Calculated Freight Cost</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block font-mono">${totalCost.toFixed(2)}</span>
        </Card>
      </div>

      {/* Optimization Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-[#714B67] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[#714B67]">Multi-Hub Dispatch & Freight Weight Algorithm</h4>
            <p className="text-xs text-slate-600">
              Orders automatically split across regional warehouses based on stock availability and shipping weight index.
            </p>
          </div>
        </div>
        <Badge variant="purple">Optimal Routing</Badge>
      </div>

      {/* Matrix Table */}
      <Card
        title="Warehouse Allocation Matrix"
        subtitle="Detailed breakdown of per-warehouse item split and freight cost"
      >
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
              {splits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-amber-500" />
                      <p className="font-semibold text-slate-800">No warehouse split generated yet</p>
                      <p className="text-xs text-slate-400">Click below to run the multi-depot shipping optimization algorithm</p>
                      <Button
                        variant="primary"
                        icon={RefreshCw}
                        size="sm"
                        onClick={handleAccept}
                        disabled={isSubmitting}
                        className="mt-2"
                      >
                        Auto-Calculate Split Now
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                splits.map((sp, idx) => {
                  const whName = sp.warehouse_name || sp.warehouse_id?.name || 'Warehouse Depot';
                  const prodName = sp.product_name || sp.product_id?.name || 'Catalog Item';
                  return (
                    <tr key={sp._id || sp.id || idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{whName}</td>
                      <td className="py-3 px-4 text-[#714B67] font-semibold">{prodName}</td>
                      <td className="py-3 px-4 text-center">
                        {isOverrideMode ? (
                          <input
                            type="number"
                            min="0"
                            value={sp.qty_fulfilled}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSplits(splits.map((s, i) => (i === idx ? { ...s, qty_fulfilled: val } : s)));
                            }}
                            className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-center font-bold text-slate-900 focus:outline-none focus:border-[#714B67]"
                          />
                        ) : (
                          <span className="font-extrabold text-slate-900 font-mono">{sp.qty_fulfilled}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-mono">
                        {sp.estimated_shipments || 1} shipment
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-600">
                        ${Number(sp.cost || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {isOverrideMode && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsOverrideMode(false)}>
              Cancel
            </Button>
            <Button
              variant="warning"
              icon={CheckCircle2}
              onClick={handleOverrideSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Manual Allocations'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FulfillmentSplitDetailView;
