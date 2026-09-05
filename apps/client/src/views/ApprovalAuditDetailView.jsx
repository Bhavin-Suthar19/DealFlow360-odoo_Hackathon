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
  Check,
  Clock,
  ShieldAlert,
  DollarSign,
  UserCheck,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const ApprovalAuditDetailView = ({
  approval,
  quote,
  currentUser = {},
  onBack,
  onApprove,
  onReturn,
  onReject
}) => {
  const [note, setNote] = useState('');

  if (!approval) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">No approval record selected.</p>
        <Button variant="ghost" icon={ArrowLeft} onClick={onBack} className="mt-4">
          Back to Approvals
        </Button>
      </div>
    );
  }

  const role = currentUser?.role || 'sales_manager';
  const riskScore = Number(approval.blended_risk_score || quote?.blended_risk_score || 0);
  const isHighRisk = riskScore > 15 || approval.risk_level === 'HIGH';
  const approvalStatus = approval.status || 'Pending';
  const isPending = approvalStatus === 'Pending';
  const isPendingFinance = approval.assigned_to_role === 'finance_ops' || quote?.status === 'Pending Finance Approval';

  // Extract lines from linked quote or approval
  const quoteLines = quote?.lines || approval.quotation_lines || [];
  const quoteNumber = approval.quote_number || quote?.quote_number || 'Quotation';
  const customerName = approval.customer_name || quote?.customer_name || 'Enterprise Customer';
  const customerTier = approval.customer_tier || quote?.customer_tier || 'Gold';
  const totalAmount = Number(quote?.total_amount || approval.total_amount || 0);

  // Compute or extract flagged reasons
  const flaggedReasons = approval.flagged_reasons?.length > 0
    ? approval.flagged_reasons
    : quoteLines
        .filter((l) => (l.discount_pct || 0) > (l.discount_limit_pct || 10))
        .map((l) => ({
          line_item: l.product_name || l.name || 'Catalog Item',
          discount_given: l.discount_pct || 0,
          ceiling_limit: l.discount_limit_pct || 10,
          over_by: Number(((l.discount_pct || 0) - (l.discount_limit_pct || 10)).toFixed(1))
        }));

  const logs = approval.logs || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Governance Review: {quoteNumber}
              </h1>
              <Badge variant={isHighRisk ? 'danger' : 'warning'}>
                Blended Risk: {riskScore}% ({approval.risk_level || (isHighRisk ? 'HIGH' : 'MEDIUM')})
              </Badge>
              <Badge variant="brand">Customer Tier: {customerTier}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customer: <strong className="text-slate-800">{customerName}</strong> | Deal Value:{' '}
              <strong className="text-slate-900 font-mono">${totalAmount.toLocaleString()}</strong> |
              Assigned:{' '}
              <strong className="text-[#714B67]">
                {approval.assigned_user || (isPendingFinance ? 'Financial Operations' : 'Sales Manager')}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              approvalStatus === 'Approved'
                ? 'success'
                : approvalStatus === 'Pending'
                ? isPendingFinance
                  ? 'danger'
                  : 'warning'
                : 'danger'
            }
          >
            Stage: {isPendingFinance ? 'Finance Ops Review' : approvalStatus}
          </Badge>
        </div>
      </div>

      {/* Multi-Tier Governance Stepper */}
      <Card title="Governance Escalation Node Chain" subtitle="Autonomous multi-tier routing pipeline">
        <div className="flex items-center justify-between py-5 px-4 max-w-4xl mx-auto">
          {/* Step 1: Sales Rep Escalated */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-xs">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-700">1. Rep Escalated</span>
            <span className="text-[10px] text-slate-500">Sales Rep</span>
          </div>

          <div className="flex-1 h-0.5 bg-emerald-400 mx-2" />

          {/* Step 2: Sales Manager Review */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-xs ${
                approvalStatus === 'Approved' || isPendingFinance
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                  : isPending && !isPendingFinance
                  ? 'bg-amber-100 border-amber-500 text-amber-800 ring-4 ring-amber-500/20'
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}
            >
              {approvalStatus === 'Approved' || isPendingFinance ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <span
              className={`text-xs font-bold ${
                approvalStatus === 'Approved' || isPendingFinance
                  ? 'text-emerald-700'
                  : isPending && !isPendingFinance
                  ? 'text-amber-700'
                  : 'text-slate-500'
              }`}
            >
              2. Manager Review
            </span>
            <span className="text-[10px] text-slate-500">Sales Manager</span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-2 ${
              approvalStatus === 'Approved' || isPendingFinance ? 'bg-emerald-400' : 'bg-slate-200'
            }`}
          />

          {/* Step 3: Finance Ops Review */}
          <div
            className={`flex flex-col items-center gap-1.5 text-center ${
              !isHighRisk && !isPendingFinance && approvalStatus !== 'Approved' ? 'opacity-40' : ''
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-xs ${
                approvalStatus === 'Approved'
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                  : isPendingFinance
                  ? 'bg-rose-100 border-rose-500 text-rose-800 ring-4 ring-rose-500/20'
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}
            >
              {approvalStatus === 'Approved' ? <Check className="w-5 h-5" /> : '3'}
            </div>
            <span
              className={`text-xs font-bold ${
                approvalStatus === 'Approved'
                  ? 'text-emerald-700'
                  : isPendingFinance
                  ? 'text-rose-700'
                  : 'text-slate-500'
              }`}
            >
              3. Finance Review
            </span>
            <span className="text-[10px] text-slate-500">
              {isHighRisk ? 'Required (>15% Risk)' : 'Auto-Waived'}
            </span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-2 ${approvalStatus === 'Approved' ? 'bg-emerald-400' : 'bg-slate-200'}`}
          />

          {/* Step 4: Confirmed & Order Fulfillment */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-xs ${
                approvalStatus === 'Approved'
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}
            >
              <Check className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-bold ${
                approvalStatus === 'Approved' ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              4. Confirmed
            </span>
            <span className="text-[10px] text-slate-500">Auto Fulfillment</span>
          </div>
        </div>
      </Card>

      {/* Quotation Line Items Breakdown Table */}
      <Card
        title="Quotation Line Items & Discount Inspection"
        subtitle="Detailed line breakdown submitted for governance authorization"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item / Product Name</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Discount %</th>
                <th className="py-3 px-4 text-center">Ceiling Limit</th>
                <th className="py-3 px-4 text-center">Governance Status</th>
                <th className="py-3 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quoteLines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 italic">
                    Line items loaded from linked quotation request.
                  </td>
                </tr>
              ) : (
                quoteLines.map((l, i) => {
                  const unitPrice = Number(l.unit_price || 0);
                  const qty = Number(l.qty || 1);
                  const disc = Number(l.discount_pct || 0);
                  const limit = Number(l.discount_limit_pct || 10);
                  const isOver = disc > limit;
                  const delta = Number((disc - limit).toFixed(1));
                  const lineTotal = qty * unitPrice * (1 - disc / 100);

                  return (
                    <tr key={l.id || l._id || i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {l.product_name || l.name || 'Product SKU'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{qty}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        ${unitPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-600">
                        {disc}%
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-mono">{limit}%</td>
                      <td className="py-3 px-4 text-center">
                        {isOver ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                            +{delta}% Over Cap
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Compliant
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-mono">
                        ${lineTotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {quoteLines.length > 0 && (
              <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold">
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-right text-slate-700">
                    Grand Total Deal Amount:
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 text-base font-mono">
                    ${totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {/* Flagged Reasons Table */}
      {flaggedReasons.length > 0 && (
        <Card
          title="Why This Quote Was Flagged"
          subtitle="Audit of discounts exceeding customer tier and category ceiling limits"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Line Item / Product</th>
                  <th className="py-3 px-4 text-center">Discount Given</th>
                  <th className="py-3 px-4 text-center">Ceiling Limit Allowed</th>
                  <th className="py-3 px-4 text-right">Overage Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flaggedReasons.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{f.line_item}</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-600">{f.discount_given}%</td>
                    <td className="py-3 px-4 text-center text-slate-500">{f.ceiling_limit}%</td>
                    <td className="py-3 px-4 text-right font-extrabold text-rose-600">
                      +{f.over_by}% Over Limit
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Audit Trail Log */}
      <Card title="Audit Steps Log" subtitle="Complete historical timeline of governance events">
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600">
                  Escalated by Sales Rep to Sales Manager for review (Risk Score: {riskScore}%).
                </span>
              </div>
              <Badge variant="warning">Submitted</Badge>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id || log._id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900">{log.user || 'System'}</span>
                  <span className="ml-2 text-xs font-bold text-[#714B67]">[{log.action}]</span>
                  <p className="text-xs text-slate-600 mt-0.5">{log.note}</p>
                </div>
                <span className="text-[10px] text-slate-400">{log.date || 'Today'}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Decision Actions Form */}
      {isPending && (
        <Card
          title="Decision & Audit Authorization"
          subtitle="Record mandatory review note and authorize governance action"
        >
          <div className="space-y-4">
            <Input
              label="Review Note / Audit Reason (Required for compliance log)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Approved: Strategic customer volume renewal. Margin justified by recurring SaaS."
              required
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Approve Button */}
                <Button
                  variant="success"
                  icon={CheckCircle2}
                  disabled={!note.trim()}
                  onClick={() => onApprove(approval.id || approval._id, note)}
                >
                  {isPendingFinance
                    ? 'Grant Final Finance Approval'
                    : isHighRisk
                    ? 'Approve Level 1 (Escalate to Finance)'
                    : 'Approve & Confirm Deal'}
                </Button>

                {/* Return for Revision Button */}
                <Button
                  variant="warning"
                  icon={RotateCcw}
                  disabled={!note.trim()}
                  onClick={() => onReturn(approval.id || approval._id, note)}
                >
                  Return to Sales Rep
                </Button>
              </div>

              {/* Reject / Removal Button */}
              <Button
                variant="danger"
                icon={XCircle}
                disabled={!note.trim()}
                onClick={() => onReject(approval.id || approval._id, note)}
              >
                Reject Quotation (Removal)
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApprovalAuditDetailView;
