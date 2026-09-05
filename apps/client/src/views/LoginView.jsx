import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Building2, Lock, Mail, ShieldCheck, ArrowRight, User, Users } from 'lucide-react';

export const LoginView = ({ onLoginSuccess, onSelectPortal }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('alex.j@dealflow360.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginRole, setLoginRole] = useState('sales_rep');

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [department, setDepartment] = useState('Enterprise West');
  const [signupRole, setSignupRole] = useState('sales_rep');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const roleNames = {
      sales_rep: 'Alex Johnson',
      sales_manager: 'J. Rao',
      finance_ops: 'M. Shah',
      admin: 'Elena Rostova'
    };
    onLoginSuccess({
      name: roleNames[loginRole] || 'Alex Johnson',
      email: loginEmail,
      role: loginRole
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    setSignupError('');
    onLoginSuccess({
      name: fullName || 'New Team Member',
      email: signupEmail,
      role: signupRole,
      department
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-md w-full z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#714B67] shadow-xl shadow-[#714B67]/20 mb-2">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">DealFlow360</h1>
          <p className="text-xs text-[#714B67] uppercase font-bold tracking-wider">
            Complete B2B Sales, Quotation & Revenue Ops Platform
          </p>
        </div>

        {/* Dual Persona Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-[#714B67] uppercase tracking-wider block">Customer Portal Access</span>
            <p className="text-xs text-slate-600">View quotes & submit negotiation terms</p>
          </div>
          <Button size="sm" variant="outline" onClick={onSelectPortal} icon={ArrowRight}>
            Portal Login
          </Button>
        </div>

        {/* Card */}
        <Card className="shadow-sm">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-center text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'border-[#714B67] text-[#714B67]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-center text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'border-[#714B67] text-[#714B67]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* LOG IN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                icon={Lock}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Select Role Persona
                </label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#714B67]"
                >
                  <option value="sales_rep">Sales Rep (Alex Johnson)</option>
                  <option value="sales_manager">Sales Manager (J. Rao)</option>
                  <option value="finance_ops">Finance / Ops (M. Shah)</option>
                  <option value="admin">System Administrator (Elena)</option>
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2" icon={ShieldCheck}>
                Sign In to Platform
              </Button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                icon={User}
                placeholder="e.g. Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Work Email Address"
                type="email"
                icon={Mail}
                placeholder="s.jenkins@dealflow360.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
                  >
                    <option value="Enterprise West">Enterprise West</option>
                    <option value="Global Finance">Global Finance</option>
                    <option value="Core Sales">Core Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Requested Role
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
                  >
                    <option value="sales_rep">Sales Representative</option>
                    <option value="sales_manager">Sales Manager</option>
                    <option value="finance_ops">Finance / Operations</option>
                  </select>
                </div>
              </div>

              <Input
                label="Password"
                type="password"
                icon={Lock}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={signupError}
                required
              />

              <Button type="submit" variant="primary" className="w-full mt-2" icon={Users}>
                Create Account & Request Access
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium">
              Protected by JWT & RBAC Middleware Governance
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginView;
