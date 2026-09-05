import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { ArrowRight } from 'lucide-react';

export const SubscriptionsListView = ({ subscriptions = [], onSelectSubscription }) => {
  const [activeTab, setActiveTab] = useState('Active');

  const filteredSubs = subscriptions.filter((s) => s.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recurring Subscriptions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Automated recurring billing schedules and mid-cycle proration</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'Active', label: 'Active Subscriptions', badge: subscriptions.filter((s) => s.status === 'Active').length },
          { id: 'Paused', label: 'Paused', badge: subscriptions.filter((s) => s.status === 'Paused').length },
          { id: 'Cancelled', label: 'Cancelled', badge: subscriptions.filter((s) => s.status === 'Cancelled').length }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Subscription Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Subscription ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Subscription Plan</th>
                <th className="py-3.5 px-4">Cycle</th>
                <th className="py-3.5 px-4">Next Bill Date</th>
                <th className="py-3.5 px-4">Recurring Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    No subscriptions found in '{activeTab}' status
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">{sub.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">{sub.customer_name}</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">{sub.plan_name}</td>
                    <td className="py-3.5 px-4 uppercase text-xs font-bold text-slate-500 dark:text-slate-400">{sub.cycle}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{sub.next_bill_date}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">${sub.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={sub.status === 'Active' ? 'success' : sub.status === 'Paused' ? 'warning' : 'danger'}>
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button size="sm" variant="ghost" icon={ArrowRight} onClick={() => onSelectSubscription(sub.id)}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionsListView;
