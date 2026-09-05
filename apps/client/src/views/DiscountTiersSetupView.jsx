import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Save, CheckCircle2 } from 'lucide-react';

export const DiscountTiersSetupView = ({
  currentUser,
  discountTiers = [],
  categoryCeilings = [],
  approvalRules = [],
  onSaveConfig
}) => {
  const [tiers, setTiers] = useState(discountTiers);
  const [ceilings, setCeilings] = useState(categoryCeilings);
  const [saved, setSaved] = useState(false);
  const isAdmin = !currentUser?.role || currentUser.role === 'admin';

  const handleSave = () => {
    if (!isAdmin) return;
    onSaveConfig({ tiers, ceilings });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Discount Governance & Approval Escalation Setup
            </h1>
            <Badge variant={isAdmin ? 'purple' : 'warning'}>
              {isAdmin ? 'Admin Only' : 'Read-Only (Admin Required)'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Configure customer tier ceilings, category caps, and multi-step approval routing (Administrator restricted)
          </p>
        </div>

        {isAdmin ? (
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Save Governance Configuration
          </Button>
        ) : (
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            Admin Privilege Required to Edit
          </span>
        )}
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-800">
            Governance matrix updated and applied system-wide!
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Tier Ceilings */}
        <Card title="Customer Tier Max Discount Ceiling Matrix" subtitle="Max discount % by customer tier level">
          <div className="space-y-3">
            {tiers.map((t, idx) => (
              <div key={t.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">{t.tier_name} Tier</span>
                  <span className="text-xs text-slate-500">Max Discount Limit</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    disabled={!isAdmin}
                    value={t.max_discount_pct}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTiers(tiers.map((item, i) => (i === idx ? { ...item, max_discount_pct: val } : item)));
                    }}
                    className="w-20 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-[#714B67] text-center focus:outline-none focus:border-[#714B67] disabled:bg-slate-100 disabled:text-slate-400"
                  />
                  <span className="text-sm font-bold text-slate-500">%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Discount Ceilings */}
        <Card title="Product Category Discount Cap Matrix" subtitle="Max discount % enforced per product line category">
          <div className="space-y-3">
            {ceilings.map((c, idx) => (
              <div key={c.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">{c.category_name}</span>
                  <span className="text-xs text-slate-500">Category Ceiling Limit</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    disabled={!isAdmin}
                    value={c.max_discount_pct}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCeilings(ceilings.map((item, i) => (i === idx ? { ...item, max_discount_pct: val } : item)));
                    }}
                    className="w-20 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-600 text-center focus:outline-none focus:border-[#714B67] disabled:bg-slate-100 disabled:text-slate-400"
                  />
                  <span className="text-sm font-bold text-slate-500">%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Approval Escalation Rules Matrix */}
      <Card title="Approval Escalation Routing Rules" subtitle="Automated workflow routing matrix based on blended risk score">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Discount Risk Overage Range</th>
                <th className="py-3.5 px-4">Assigned Risk Level</th>
                <th className="py-3.5 px-4">Required Approval Chain Steps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">0% – 5.0% Overage</td>
                <td className="py-3.5 px-4">
                  <Badge variant="success">LOW RISK</Badge>
                </td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold">No Approval (Auto-Confirmed)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">5.01% – 15.0% Overage</td>
                <td className="py-3.5 px-4">
                  <Badge variant="warning">MEDIUM RISK</Badge>
                </td>
                <td className="py-3.5 px-4 text-amber-700 font-medium">Step 1: Sales Manager Review</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">&gt; 15.0% Overage</td>
                <td className="py-3.5 px-4">
                  <Badge variant="danger">HIGH RISK</Badge>
                </td>
                <td className="py-3.5 px-4 text-rose-700 font-medium">Step 1: Sales Manager → Step 2: Finance / Ops Review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DiscountTiersSetupView;
