import React, { useState } from 'react';
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
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Zap,
  ArrowUpRight,
  Clock
} from 'lucide-react';

const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Recently';
  const now = new Date();
  const date = new Date(dateInput);
  const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const formatAuditAction = (log) => {
  const action = log.action || '';
  const entityType = log.entity_type || '';
  const entityId = log.entity_id || '';
  const userName = log.user_id?.name || (typeof log.user_id === 'string' && log.user_id !== 'system' ? log.user_id : 'System User');

  if (action.includes('/auth/login')) {
    return {
      title: `${userName} authenticated on platform`,
      subtitle: 'Session verified & RBAC token issued',
      type: 'auth'
    };
  }
  if (action.includes('/auth/signup')) {
    return {
      title: `New user account registered`,
      subtitle: `Identity provisioned in MongoDB`,
      type: 'auth'
    };
  }
  if (action.includes('/quotations') && action.startsWith('POST')) {
    return {
      title: `${userName} created quotation draft`,
      subtitle: `CPQ pricing rules & discount limits applied`,
      type: 'quote'
    };
  }
  if (action.includes('/quotations') && action.startsWith('PATCH')) {
    return {
      title: `${userName} updated quotation lines / terms`,
      subtitle: `Recalculated margin & discount risk score`,
      type: 'quote'
    };
  }
  if (action.includes('/submit')) {
    return {
      title: `${userName} submitted quotation for review`,
      subtitle: `Governance approval workflow triggered`,
      type: 'approval'
    };
  }
  if (action.includes('/approve')) {
    return {
      title: `${userName} approved quotation discount`,
      subtitle: `Governance signoff recorded cleanly`,
      type: 'approval'
    };
  }
  if (action.includes('/reject')) {
    return {
      title: `${userName} rejected quotation governance request`,
      subtitle: `Status updated to Rejected`,
      type: 'danger'
    };
  }
  if (action.includes('/deal-health') || action.includes('/alerts')) {
    return {
      title: `Deal health anomaly recalculated`,
      subtitle: `Autonomous governance monitor active`,
      type: 'alert'
    };
  }
  if (action.includes('/notifications')) {
    return {
      title: `Notification sent across role hierarchy`,
      subtitle: `Deal team alert dispatched`,
      type: 'notif'
    };
  }

  // Generic fallback format
  return {
    title: `${userName} performed ${action || 'System Mutation'}`,
    subtitle: `Target: ${entityType} (${entityId})`,
    type: 'default'
  };
};

export const DashboardView = ({
  quotations = [],
  approvals = [],
  alerts = [],
  auditLogs = [],
  currentUser = {},
  onNavigate,
  onRefresh
}) => {
  const role = currentUser?.role || 'sales_rep';
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Pagination States for Quotations Pipeline
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quotePage, setQuotePage] = useState(1);
  const quotesPerPage = 5;

  // Pagination for Live Platform Activity
  const [activityPage, setActivityPage] = useState(1);
  const activityPerPage = 5;

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const openQuotesCount = quotations.filter((q) =>
    ['Draft', 'Pending Approval', 'Negotiation', 'Pending Manager Approval', 'Pending Customer Approval'].includes(q.status)
  ).length;
  const atRiskDealsCount = alerts.filter((al) => al.status === 'Open').length;
  const totalPipelineValue = quotations.reduce((sum, q) => sum + (q.total_amount || 0), 0);

  // Filtered Quotations
  const filteredQuotations = quotations.filter((q) => {
    if (!quoteSearch.trim()) return true;
    const term = quoteSearch.toLowerCase();
    return (
      (q.quote_number && q.quote_number.toLowerCase().includes(term)) ||
      (q.customer_name && q.customer_name.toLowerCase().includes(term)) ||
      (q.status && q.status.toLowerCase().includes(term))
    );
  });

  const totalQuotePages = Math.max(1, Math.ceil(filteredQuotations.length / quotesPerPage));
  const paginatedQuotations = filteredQuotations.slice(
    (quotePage - 1) * quotesPerPage,
    quotePage * quotesPerPage
  );

  // Prepare Live Activity Feed (From live DB audit logs, or graceful defaults if newly seeded)
  const displayLogs = auditLogs.length > 0 ? auditLogs : [
    {
      _id: 'seed-log-1',
      action: 'POST /quotations/submit',
      entity_type: 'quotation',
      entity_id: 'q-1042',
      user_id: { name: 'Alex Johnson' },
      timestamp: new Date(Date.now() - 1000 * 60 * 12)
    },
    {
      _id: 'seed-log-2',
      action: 'POST /approvals/approve',
      entity_type: 'approval',
      entity_id: 'app-1',
      user_id: { name: 'J. Rao' },
      timestamp: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      _id: 'seed-log-3',
      action: 'POST /auth/login',
      entity_type: 'auth',
      entity_id: 'deepak',
      user_id: { name: 'Deepak' },
      timestamp: new Date(Date.now() - 1000 * 60 * 90)
    },
    {
      _id: 'seed-log-4',
      action: 'POST /deal-health/recalculate',
      entity_type: 'deal-health',
      entity_id: 'system',
      user_id: { name: 'System Anomaly Engine' },
      timestamp: new Date(Date.now() - 1000 * 60 * 180)
    }
  ];

  const totalActivityPages = Math.max(1, Math.ceil(displayLogs.length / activityPerPage));
  const paginatedLogs = displayLogs.slice(
    (activityPage - 1) * activityPerPage,
    activityPage * activityPerPage
  );

  return (
    <div className="space-y-6">
      {/* Native Control Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">Role: {role.replace('_', ' ')}</Badge>
            <span className="text-xs text-slate-500 font-medium">
              Logged in as {currentUser.name || 'User'}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {role === 'sales_rep' && 'Sales Representative Operations'}
            {role === 'sales_manager' && 'Sales Manager Governance Dashboard'}
            {role === 'finance_ops' && 'Finance & Revenue Operations Control Center'}
            {role === 'admin' && 'System Administrator Overview'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live database synchronizer for active quotations pipeline, discount compliance & platform events
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? 'animate-spin' : ''}
          >
            {isRefreshing ? 'Syncing...' : 'Sync Live DB'}
          </Button>

          {(role === 'sales_rep' || role === 'admin') && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => onNavigate('quotation-builder')}
            >
              New Quotation
            </Button>
          )}

          {(role === 'sales_manager' || role === 'finance_ops' || role === 'admin') && (
            <Button
              variant="secondary"
              size="sm"
              icon={CheckSquare}
              onClick={() => onNavigate('approvals')}
            >
              Approvals ({pendingApprovalsCount})
            </Button>
          )}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Pipeline Quotes
            </span>
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{openQuotesCount}</span>
            <Badge variant="draft">In Progress</Badge>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {quotations.length} total quotations in database
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Approvals
            </span>
            <CheckSquare className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{pendingApprovalsCount}</span>
            <Badge variant="pending">Action Required</Badge>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Risk-scored governance queue
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              At-Risk Deals
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{atRiskDealsCount}</span>
            <Badge variant="danger">Health Alerts</Badge>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Stalled or margin anomaly detected
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Pipeline Value
            </span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">
              ${totalPipelineValue.toLocaleString()}
            </span>
            <Badge variant="brand">Live DB</Badge>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Aggregated order book
          </div>
        </Card>
      </div>

      {/* Main Content Grid: Active Quotations Pipeline & Live Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ACTIVE QUOTATIONS PIPELINE (2 COLS) */}
        <Card
          title={role === 'sales_manager' ? 'Discount Risk Governance Pipeline' : 'Active Quotations Pipeline'}
          subtitle="Real-time MongoDB quote store with blended risk scoring"
          className="lg:col-span-2"
        >
          {/* Search bar inside pipeline */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={quoteSearch}
                onChange={(e) => {
                  setQuoteSearch(e.target.value);
                  setQuotePage(1);
                }}
                placeholder="Search by quote #, customer or status..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#714B67] text-slate-800"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {paginatedQuotations.length} of {filteredQuotations.length} quotes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="text-[11px] uppercase bg-slate-50 text-slate-500 border-b border-slate-200 font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Quote #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedQuotations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-xs text-slate-400">
                      No quotations found in live database matching your query.
                    </td>
                  </tr>
                ) : (
                  paginatedQuotations.map((q) => {
                    const quoteId = q.id || q._id;
                    const getStatusBadge = (st) => {
                      if (st === 'Approved' || st === 'Confirmed') return <Badge variant="success">{st}</Badge>;
                      if (st?.includes('Approval') || st === 'Pending') return <Badge variant="pending">{st}</Badge>;
                      if (st === 'Negotiation' || st === 'Under Negotiation') return <Badge variant="negotiation">{st}</Badge>;
                      if (st === 'Rejected') return <Badge variant="danger">{st}</Badge>;
                      return <Badge variant="draft">{st || 'Draft'}</Badge>;
                    };

                    const riskScore = q.blended_risk_score || 0;

                    return (
                      <tr
                        key={quoteId}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => onNavigate('quotation-detail', quoteId)}
                      >
                        <td className="py-3 px-3 font-bold text-[#714B67] group-hover:underline">
                          {q.quote_number || quoteId}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{q.customer_name || 'Acme Corp'}</div>
                          {q.sales_rep_name && (
                            <div className="text-[10px] text-slate-400">Rep: {q.sales_rep_name}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          ${(q.total_amount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              riskScore > 15 ? 'danger' : riskScore > 5 ? 'warning' : 'success'
                            }
                          >
                            {riskScore}% Risk
                          </Badge>
                        </td>
                        <td className="py-3 px-3">{getStatusBadge(q.status)}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('quotation-detail', quoteId);
                            }}
                            className="text-xs font-bold text-[#714B67] hover:underline cursor-pointer inline-flex items-center gap-1"
                          >
                            View &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Quotation Pagination Controls */}
          {totalQuotePages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Page {quotePage} of {totalQuotePages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  icon={ChevronLeft}
                  disabled={quotePage <= 1}
                  onClick={() => setQuotePage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={ChevronRight}
                  disabled={quotePage >= totalQuotePages}
                  onClick={() => setQuotePage((p) => Math.min(totalQuotePages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* LIVE PLATFORM ACTIVITY (1 COL) */}
        <Card
          title="Live Platform Activity"
          subtitle="Autonomous audit events & state mutations"
        >
          <div className="space-y-3.5">
            {paginatedLogs.map((log) => {
              const formatted = formatAuditAction(log);
              const timeString = formatTimeAgo(log.timestamp);

              const getIconBg = (type) => {
                if (type === 'auth') return 'bg-purple-50 border-purple-200 text-purple-600';
                if (type === 'approval') return 'bg-emerald-50 border-emerald-200 text-emerald-600';
                if (type === 'danger') return 'bg-rose-50 border-rose-200 text-rose-600';
                if (type === 'alert') return 'bg-amber-50 border-amber-200 text-amber-600';
                return 'bg-blue-50 border-blue-200 text-blue-600';
              };

              return (
                <div
                  key={log._id || log.id || Math.random()}
                  className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0"
                >
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${getIconBg(
                      formatted.type
                    )}`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {formatted.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {formatted.subtitle}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{timeString}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Pagination Controls */}
          {totalActivityPages > 1 && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">
                {activityPage} / {totalActivityPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={activityPage <= 1}
                  onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={activityPage >= totalActivityPages}
                  onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
                  className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
