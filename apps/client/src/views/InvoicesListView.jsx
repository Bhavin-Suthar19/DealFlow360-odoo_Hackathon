import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { ArrowRight } from 'lucide-react';

export const InvoicesListView = ({ invoices = [], onSelectInvoice }) => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredInvoices = activeTab === 'All' ? invoices : invoices.filter((i) => i.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoices & Billing Ledger</h1>
          <p className="text-sm text-slate-500">Track customer invoices, due dates, and payment reconciliations</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'All', label: 'All Invoices', badge: invoices.length },
          { id: 'Unpaid', label: 'Unpaid', badge: invoices.filter((i) => i.status === 'Unpaid').length },
          { id: 'Paid', label: 'Paid', badge: invoices.filter((i) => i.status === 'Paid').length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Invoice Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Quote #</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Payment Stage</th>
                <th className="py-3.5 px-4 text-right">Invoice Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-[#714B67] font-mono">{inv.invoice_number}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.quote_number}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{inv.customer_name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{inv.due_date}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="cyan">{inv.payment_stage}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                    ${inv.amount?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={inv.status === 'Paid' ? 'success' : 'danger'}>{inv.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button size="sm" variant="ghost" icon={ArrowRight} onClick={() => onSelectInvoice(inv.id)}>
                      Open Detail
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

export default InvoicesListView;
