import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check
} from 'lucide-react';

export const ApprovalAuditDetailView = ({ approval, onBack, onApprove, onReturn, onReject }) => {
  const [note, setNote] = useState('');

  if (!approval) return null;

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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approval Review: {approval.quote_number}</h1>
              <Badge variant={approval.risk_level === 'HIGH' ? 'danger' : 'warning'}>Blended Risk: {approval.risk_level}</Badge>
              <Badge variant="warning">Customer Tier: {approval.customer_tier}</Badge>
            </div>
            <span className="text-xs text-slate-500">Customer: {approval.customer_name} | Assigned to: {approval.assigned_user}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={approval.status === 'Approved' ? 'success' : approval.status === 'Pending' ? 'warning' : 'danger'}>
            Status: {approval.status}
          </Badge>
        </div>
      </div>

      {/* Dynamic Approval Chain Visualization */}
      <Card title="Approval Escalation Node Chain" subtitle="Multi-step governance routing visualization">
        <div className="flex items-center justify-between py-6 px-4 max-w-3xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600">Submitted</span>
            <span className="text-[10px] text-slate-500">Alex Johnson</span>
          </div>

          <div className="flex-1 h-0.5 bg-emerald-500/50 mx-2" />

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <span className="text-xs font-bold text-amber-600">Sales Manager</span>
            <span className="text-[10px] text-slate-500">J. Rao (Pending)</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <span className="text-xs font-semibold text-slate-500">Finance / Ops</span>
            <span className="text-[10px] text-slate-500">M. Shah</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Confirmed</span>
            <span className="text-[10px] text-slate-500">Auto Fulfillment</span>
          </div>
        </div>
      </Card>

      {/* Flagged Reasons Table */}
      <Card title="Why This Quote Was Flagged" subtitle="Line item discount overage audit vs ceiling limits">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Line Item / Product</th>
                <th className="py-3 px-4">Discount Given</th>
                <th className="py-3 px-4">Ceiling Limit Allowed</th>
                <th className="py-3 px-4">Over-By Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approval.flagged_reasons.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{f.line_item}</td>
                  <td className="py-3 px-4 font-bold text-amber-600">{f.discount_given}%</td>
                  <td className="py-3 px-4 text-slate-500">{f.ceiling_limit}%</td>
                  <td className="py-3 px-4 font-extrabold text-rose-600">+{f.over_by}% Over Limit</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Audit Trail Log */}
      <Card title="Audit Steps Log" subtitle="Complete historical timeline of governance events">
        <div className="space-y-3">
          {approval.logs.map((log) => (
            <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">{log.user}</span>
                <span className="ml-2 text-xs font-bold text-[#714B67]">[{log.action}]</span>
                <p className="text-xs text-slate-600 mt-0.5">{log.note}</p>
              </div>
              <span className="text-[10px] text-slate-400">{log.date}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Decision Actions Form */}
      {approval.status === 'Pending' && (
        <Card title="Decision & Audit Action" subtitle="Provide review notes and execute governance decision">
          <div className="space-y-4">
            <Input
              label="Review Note / Reason (Compulsory for audit log)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter approval conditions or rejection reason..."
              required
            />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="success"
                icon={CheckCircle2}
                disabled={!note.trim()}
                onClick={() => onApprove(approval.id, note)}
              >
                Approve & Advance
              </Button>
              <Button
                variant="warning"
                icon={RotateCcw}
                disabled={!note.trim()}
                onClick={() => onReturn(approval.id, note)}
              >
                Return for Revision
              </Button>
              <Button
                variant="danger"
                icon={XCircle}
                disabled={!note.trim()}
                onClick={() => onReject(approval.id, note)}
              >
                Reject Quotation
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApprovalAuditDetailView;
