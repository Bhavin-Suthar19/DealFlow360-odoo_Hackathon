import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  CheckSquare,
  FileText,
  ShieldAlert,
  Plus,
  DollarSign,
  Activity,
  TrendingUp
} from 'lucide-react';

export const DashboardView = ({ quotations = [], approvals = [], alerts = [], onNavigate }) => {
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const openQuotesCount = quotations.filter((q) => ['Draft', 'Pending Approval', 'Negotiation'].includes(q.status)).length;
  const atRiskDealsCount = alerts.filter((al) => al.status === 'Open').length;
  const totalPipelineValue = quotations.reduce((sum, q) => sum + q.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-900/50 shadow-md text-white">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Sales Operations Dashboard</h1>
          <p className="text-sm text-slate-300 mt-1">Autonomous Deal Risk Governance & Real-Time Pipeline Overview</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" icon={Plus} onClick={() => onNavigate('quotation-builder')}>
            New Quotation
          </Button>
          <Button variant="secondary" icon={CheckSquare} onClick={() => onNavigate('approvals')}>
            View Approvals ({pendingApprovalsCount})
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{pendingApprovalsCount}</span>
            <Badge variant="warning">Requires Review</Badge>
          </div>
        </Card>

        <Card className="hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Open Quotations</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{openQuotesCount}</span>
            <Badge variant="primary">Active Deals</Badge>
          </div>
        </Card>

        <Card className="hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">At-Risk Deals</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{atRiskDealsCount}</span>
            <Badge variant="danger">Attention Needed</Badge>
          </div>
        </Card>

        <Card className="hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pipeline Value</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-white">${totalPipelineValue.toLocaleString()}</span>
            <Badge variant="success">+14% MoM</Badge>
          </div>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotations Quick Table */}
        <Card title="Active Quotation Pipeline" subtitle="Recent deal status and calculated risk scores" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">Quote #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Risk Score</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {quotations.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => onNavigate('quotation-builder', q.id)}
                  >
                    <td className="py-3.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">{q.quote_number}</td>
                    <td className="py-3.5 px-3 font-medium">{q.customer_name}</td>
                    <td className="py-3.5 px-3 font-mono font-bold">${q.total_amount.toLocaleString()}</td>
                    <td className="py-3.5 px-3">
                      <Badge variant={q.blended_risk_score > 15 ? 'danger' : q.blended_risk_score > 5 ? 'warning' : 'success'}>
                        {q.blended_risk_score}%
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={q.status === 'Approved' ? 'success' : q.status === 'Pending Approval' ? 'warning' : 'primary'}>
                        {q.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity Feed Widget */}
        <Card title="Live Activity Feed" subtitle="Real-time governance events">
          <div className="space-y-4">
            <div className="flex gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-800 dark:text-slate-200"><span className="font-bold">Alex Johnson</span> submitted Q-1042 for manager review.</p>
                <span className="text-[10px] text-slate-400">10 minutes ago</span>
              </div>
            </div>

            <div className="flex gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-800 dark:text-slate-200"><span className="font-bold">J. Rao</span> approved level 1 discount for Acme Corp.</p>
                <span className="text-[10px] text-slate-400">45 minutes ago</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-800 dark:text-slate-200"><span className="font-bold">Upsell Alert</span>: 24/7 SLA added to Q-1042 (+$3,500).</p>
                <span className="text-[10px] text-slate-400">2 hours ago</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
