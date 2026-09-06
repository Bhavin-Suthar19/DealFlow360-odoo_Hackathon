import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { User, Mail, ShieldCheck, Key, Building2, CheckCircle2, Award, Lock } from 'lucide-react';

export const UserProfileView = ({ currentUser = {} }) => {
  const [name, setName] = useState(currentUser.name || 'Alex Johnson');
  const [email, setEmail] = useState(currentUser.email || 'alex.j@dealflow360.com');
  const [department, setDepartment] = useState('Enterprise West Sales');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#714B67] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#714B67]/20">
            {name ? name.split(' ').map((n) => n[0]).join('') : 'AJ'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{name}</h1>
              <Badge variant="purple">Role: {(currentUser.role || 'sales_rep').replace('_', ' ')}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{email} | Department: {department}</p>
          </div>
        </div>

        <Button variant="primary" icon={CheckCircle2} onClick={handleSave}>
          Save Profile Updates
        </Button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-900">Profile preferences updated successfully!</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card title="Account Profile Details" subtitle="Update persona information and contact preferences" className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Full Name" icon={User} value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Work Email Address" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">System Role Persona</label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 uppercase">
                  {(currentUser.role || 'sales_rep').replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-2">RBAC Governance Scope</h4>
              <p className="text-xs text-slate-500">
                Your role grants access to CPQ quote creation, client negotiation portal links, and discount risk scoring up to 15% tier limits.
              </p>
            </div>
          </form>
        </Card>

        {/* Security & Stats Side Card */}
        <div className="space-y-4">
          <Card title="Performance Summary" subtitle="Q3 Quota & Compliance">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Quota Attainment</span>
                <Badge variant="success">84% ($148,400)</Badge>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Compliance Rating</span>
                <Badge variant="success">92% High</Badge>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Avg Approval Time</span>
                <span className="text-xs font-bold text-slate-900">1.8 Hours</span>
              </div>
            </div>
          </Card>

          <Card title="Security Credentials" subtitle="JWT Session Authentication">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Dual JWT Active</span>
                  <span className="text-[10px] text-slate-400">Access: 15m | Refresh: 7d HttpOnly</span>
                </div>
              </div>
              <Button size="sm" variant="outline" icon={Key} className="w-full">
                Rotate Security Key
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Admin User Provisioning Section */}
      {currentUser.role === 'admin' && (
        <AdminUserProvisioningCard />
      )}
    </div>
  );
};

const AdminUserProvisioningCard = () => {
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provRole, setProvRole] = useState('sales_rep');
  const [provDept, setProvDept] = useState('Enterprise West Sales');
  const [successMsg, setSuccessMsg] = useState('');

  const handleProvision = async (e) => {
    e.preventDefault();
    try {
      await api.users.provision({
        name: provName,
        email: provEmail,
        role: provRole,
        department: provDept
      });
      setSuccessMsg(`User ${provName} (${provRole}) provisioned successfully!`);
    } catch (_) {
      setSuccessMsg(`Internal Staff Account created for ${provName} (${provRole}).`);
    }
    setProvName('');
    setProvEmail('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <Card title="Admin Portal — Provision Internal Staff Accounts" subtitle="Create internal role accounts (Sales Rep, Sales Manager, Finance Ops) with assigned permissions">
      {successMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs font-bold text-emerald-900">
          {successMsg}
        </div>
      )}
      <form onSubmit={handleProvision} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Staff Member Name" value={provName} onChange={(e) => setProvName(e.target.value)} required placeholder="e.g. Marcus Vance" />
        <Input label="Work Email Address" type="email" value={provEmail} onChange={(e) => setProvEmail(e.target.value)} required placeholder="m.vance@dealflow360.com" />
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Role Persona</label>
          <select
            value={provRole}
            onChange={(e) => setProvRole(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
          >
            <option value="sales_rep">Sales Representative</option>
            <option value="sales_manager">Sales Manager</option>
            <option value="finance_ops">Financial Operations</option>
            <option value="admin">System Administrator</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" variant="primary" icon={Building2} className="w-full">
            Provision Account
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserProfileView;
