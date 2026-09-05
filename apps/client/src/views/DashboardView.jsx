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
  TrendingUp,
  CreditCard,
  Truck,
  Repeat,
  BarChart3,
  Package,
  Sliders,
  Globe,
  ArrowUpRight,
  MessageSquare,
  UserCheck
} from 'lucide-react';

export const DashboardView = ({ quotations = [], approvals = [], alerts = [], currentUser = {}, onNavigate }) => {
  const role = currentUser?.role || 'sales_rep';

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const openQuotesCount = quotations.filter((q) => ['Draft', 'Pending Approval', 'Negotiation'].includes(q.status)).length;
  const atRiskDealsCount = alerts.filter((al) => al.status === 'Open').length;
  const totalPipelineValue = quotations.reduce((sum, q) => sum + (q.total_amount || 0), 0);

  // Odoo-Style 10-App Switcher Grid Data
  const appModules = [
    {
      id: 'quotations',
      name: 'CPQ Quotations',
      desc: 'Quote builder & discount rules',
      icon: FileText,
      badge: `${openQuotesCount} Active`,
      bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      roles: ['sales_rep', 'sales_manager', 'admin']
    },
    {
      id: 'approvals',
      name: 'Governance Approvals',
      desc: 'Risk scoring & escalations',
      icon: CheckSquare,
      badge: `${pendingApprovalsCount} Pending`,
      bgColor: 'bg-amber-50 border-amber-200 text-amber-600',
      roles: ['sales_manager', 'finance_ops', 'admin']
    },
    {
      id: 'fulfillment',
      name: 'Fulfillment & Stock',
      desc: 'Multi-warehouse split engine',
      icon: Truck,
      badge: 'Stock Ready',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      roles: ['finance_ops', 'admin']
    },
    {
      id: 'subscriptions',
      name: 'Subscriptions',
      desc: 'ARR & recurring cycles',
      icon: Repeat,
      badge: '$412k ARR',
      bgColor: 'bg-purple-50 border-purple-200 text-purple-600',
      roles: ['finance_ops', 'admin']
    },
    {
      id: 'invoices',
      name: 'Billing & Invoices',
      desc: 'Reconciliations & credit notes',
      icon: CreditCard,
      badge: 'Ledger Active',
      bgColor: 'bg-blue-50 border-blue-200 text-blue-600',
      roles: ['finance_ops', 'admin']
    },
    {
      id: 'deal-health',
      name: 'Deal Health Anomaly',
      desc: 'Stalled deal & margin risk',
      icon: ShieldAlert,
      badge: `${atRiskDealsCount} Alerts`,
      bgColor: 'bg-rose-50 border-rose-200 text-rose-600',
      roles: ['sales_manager', 'admin']
    },
    {
      id: 'messages',
      name: 'Messages & Chat',
      desc: 'Team chat & buyer negotiation',
      icon: MessageSquare,
      badge: '3 Unread',
      bgColor: 'bg-purple-50 border-purple-200 text-purple-700',
      roles: ['sales_rep', 'sales_manager', 'finance_ops', 'admin']
    },
    {
      id: 'reports',
      name: 'Executive Analytics',
      desc: 'Sales performance & compliance',
      icon: BarChart3,
      badge: 'Live Metrics',
      bgColor: 'bg-teal-50 border-teal-200 text-teal-600',
      roles: ['sales_rep', 'sales_manager', 'finance_ops', 'admin']
    },
    {
      id: 'products',
      name: 'Product Catalog',
      desc: 'Pricelists & SKU matrix',
      icon: Package,
      badge: '18 SKUs',
      bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      roles: ['sales_rep', 'sales_manager', 'admin']
    },
    {
      id: 'config',
      name: 'Discount Rules',
      desc: 'Customer tier ceilings & caps',
      icon: Sliders,
      badge: 'Governance',
      bgColor: 'bg-orange-50 border-orange-200 text-orange-600',
      roles: ['sales_manager', 'finance_ops', 'admin']
    }
  ];

  const permittedApps = appModules.filter((app) => app.roles.includes(role));

  return (
    <div className="space-y-6">
      {/* Compact Light Native Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">Role: {role.replace('_', ' ')}</Badge>
            <span className="text-xs text-slate-500 font-medium">Logged in as {currentUser.name || 'User'}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {role === 'sales_rep' && 'Sales Representative Dashboard'}
            {role === 'sales_manager' && 'Sales Manager Governance Dashboard'}
            {role === 'finance_ops' && 'Finance & Operations Control Center'}
            {role === 'admin' && 'System Administrator Overview'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time CPQ quotes, discount ceiling compliance, and team negotiation channels
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(role === 'sales_rep' || role === 'admin') && (
            <Button variant="primary" icon={Plus} onClick={() => onNavigate('quotation-builder')}>
              New Quotation
            </Button>
          )}
          {(role === 'sales_manager' || role === 'finance_ops' || role === 'admin') && (
            <Button variant="secondary" icon={CheckSquare} onClick={() => onNavigate('approvals')}>
              Review Approvals ({pendingApprovalsCount})
            </Button>
          )}
        </div>
      </div>

      {/* Role Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Quotes</span>
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{openQuotesCount}</span>
            <Badge variant="draft">In Progress</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <CheckSquare className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{pendingApprovalsCount}</span>
            <Badge variant="pending">Action Needed</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">At-Risk Deals</span>
            <ShieldAlert className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{atRiskDealsCount}</span>
            <Badge variant="danger">High Risk</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pipeline</span>
            <DollarSign className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">${totalPipelineValue.toLocaleString()}</span>
            <Badge variant="brand">+14% MoM</Badge>
          </div>
        </Card>
      </div>

      {/* Odoo 10-App Switcher Grid Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Integrated Sales Ops Apps</h2>
            <p className="text-xs text-slate-500">Select a module to jump directly to workspace</p>
          </div>
          <Badge variant="brand">{permittedApps.length} Apps Available</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {permittedApps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                onClick={() => onNavigate(app.id)}
                className="bg-white border border-slate-200 p-4 rounded-xl hover:border-[#714B67] hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold ${app.bgColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#714B67] transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{app.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">{app.badge}</span>
                  <span className="text-[10px] font-bold text-[#714B67]">Open &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Pipeline Table */}
        <Card
          title={role === 'sales_manager' ? 'Discount Risk Approvals Queue' : 'Active Quotations Pipeline'}
          subtitle="Real-time status tracking & risk score engine"
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Quote #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Risk Score</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => {
                  const getStatusBadge = (st) => {
                    if (st === 'Approved' || st === 'Confirmed') return <Badge variant="success">{st}</Badge>;
                    if (st === 'Pending Approval') return <Badge variant="pending">Pending Approval</Badge>;
                    if (st === 'Negotiation') return <Badge variant="negotiation">Negotiation</Badge>;
                    return <Badge variant="draft">Draft</Badge>;
                  };

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('quotation-builder', q.id)}
                    >
                      <td className="py-3.5 px-3 font-bold text-[#714B67]">{q.quote_number}</td>
                      <td className="py-3.5 px-3 font-medium">{q.customer_name}</td>
                      <td className="py-3.5 px-3 font-mono font-bold">${q.total_amount?.toLocaleString()}</td>
                      <td className="py-3.5 px-3">
                        <Badge variant={q.blended_risk_score > 15 ? 'danger' : q.blended_risk_score > 5 ? 'warning' : 'success'}>
                          {q.blended_risk_score}%
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3">{getStatusBadge(q.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Live Activity Feed */}
        <Card title="Live Platform Activity" subtitle="Autonomous governance event logs">
          <div className="space-y-4">
            <div className="flex gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-800"><span className="font-bold">Alex Johnson</span> submitted Q-1042 for manager review.</p>
                <span className="text-[10px] text-slate-400">10 minutes ago</span>
              </div>
            </div>

            <div className="flex gap-3 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-800"><span className="font-bold">J. Rao</span> approved level 1 discount for Acme Corp.</p>
                <span className="text-[10px] text-slate-400">45 minutes ago</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-800"><span className="font-bold">Upsell Alert</span>: 24/7 SLA added to Q-1042 (+$3,500).</p>
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
