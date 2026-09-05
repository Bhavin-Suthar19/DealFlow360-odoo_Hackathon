import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { ArrowRight, Filter } from 'lucide-react';

export const ApprovalsListView = ({ approvals = [], onSelectApproval }) => {
  const [filterStatus, setFilterStatus] = useState('Pending');

  const filteredApprovals = filterStatus === 'All' ? approvals : approvals.filter((a) => a.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approvals & Governance Queue</h1>
          <p className="text-sm text-slate-500">Review flagged deals requiring manager or finance approval</p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
        {['Pending', 'Returned', 'Approved', 'Rejected', 'All'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === status
                ? 'bg-[#714B67] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Quote #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Customer Tier</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    No approval records matching status '{filterStatus}'
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#714B67]">{app.quote_number}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{app.customer_name}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={app.customer_tier === 'Gold' ? 'warning' : 'default'}>{app.customer_tier}</Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={app.risk_level === 'HIGH' ? 'danger' : app.risk_level === 'MEDIUM' ? 'warning' : 'success'}>
                        {app.risk_level}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{app.blended_risk_score}%</td>
                    <td className="py-3.5 px-4 text-slate-600">{app.assigned_user || app.assigned_to_role}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={app.status === 'Approved' ? 'success' : app.status === 'Pending' ? 'warning' : 'danger'}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button size="sm" variant="primary" icon={ArrowRight} onClick={() => onSelectApproval(app.id)}>
                        Review Deal
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

export default ApprovalsListView;
