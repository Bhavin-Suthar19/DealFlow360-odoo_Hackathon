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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Sales Team</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#714B67]"
                />
              </div>

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
                  <span className="text-xs font-bold text-slate-900 block">JWT Token Active</span>
                  <span className="text-[10px] text-slate-400">Expires in 24 Hours</span>
                </div>
              </div>
              <Button size="sm" variant="outline" icon={Key} className="w-full">
                Rotate Security Key
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
