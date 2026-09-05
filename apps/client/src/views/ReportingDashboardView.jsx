import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { BarChart3, Download, Filter, Clock, Award } from 'lucide-react';

export const ReportingDashboardView = ({ onExport }) => {
  const [period, setPeriod] = useState('30d');
  const [team, setTeam] = useState('All');

  return (
    <div className="space-y-6">
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Analytics & Reporting</h1>
          <p className="text-sm text-slate-500">Live aggregated metrics from quotations, approvals, and invoices</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={() => onExport('pdf')}>
            Export PDF
          </Button>
          <Button variant="primary" icon={Download} onClick={() => onExport('xlsx')}>
            Export XLS
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">Period:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#714B67]"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="year">Full Year 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Sales Team:</span>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-[#714B67]"
            >
              <option value="All">All Teams</option>
              <option value="Enterprise West">Enterprise West</option>
              <option value="Global Finance">Global Finance</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Quotes Created
            </span>
            <BarChart3 className="w-5 h-5 text-[#714B67]" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">48 Quotes</span>
            <Badge variant="success">+18% vs prev period</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Approval Velocity
            </span>
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">2.4 Hours</span>
            <Badge variant="success">85% Auto-Approved</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Top Upsold Product
            </span>
            <Award className="w-5 h-5 text-[#714B67]" />
          </div>
          <div className="mt-4">
            <span className="text-base font-bold text-slate-900 block">24/7 SLA Support Package</span>
            <span className="text-xs text-[#714B67] font-semibold">+$42,000 incremental margin</span>
          </div>
        </Card>
      </div>

      {/* Performance Summary Table */}
      <Card title="Sales Performance & Discount Compliance Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase bg-slate-100 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Sales Representative</th>
                <th className="py-3 px-4">Quotes Generated</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Avg Discount %</th>
                <th className="py-3 px-4">Compliance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">Alex Johnson</td>
                <td className="py-3 px-4 text-center font-bold">14</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">$148,400</td>
                <td className="py-3 px-4 text-amber-600 font-bold">11.2%</td>
                <td className="py-3 px-4">
                  <Badge variant="success">High Compliance (92%)</Badge>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">Sarah Jenkins</td>
                <td className="py-3 px-4 text-center font-bold">11</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">$92,000</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">6.5%</td>
                <td className="py-3 px-4">
                  <Badge variant="success">Excellent (98%)</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportingDashboardView;
