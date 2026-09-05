import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Building2, Lock, Mail, ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';

export const LoginView = ({ onLoginSuccess, onSelectPortal, theme, toggleTheme }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('alex.j@dealflow360.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('sales_rep');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: mode === 'login' ? 'Alex Johnson' : 'New Sales Rep',
      email,
      role
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </div>

      <div className="max-w-md w-full z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-xl shadow-indigo-500/20 mb-2">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">DealFlow360</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Autonomous Sales Operations & Governance Platform</p>
        </div>

        {/* Dual Persona Banner */}
        <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Customer Portal Access</span>
            <p className="text-xs text-slate-600 dark:text-slate-300">View quotes & submit negotiation terms</p>
          </div>
          <Button size="sm" variant="outline" onClick={onSelectPortal} icon={ArrowRight}>
            Portal Login
          </Button>
        </div>

        {/* Card */}
        <Card className="shadow-lg">
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-center text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-center text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Select Role Persona</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="sales_rep">Sales Rep (Alex Johnson)</option>
                <option value="sales_manager">Sales Manager (J. Rao)</option>
                <option value="finance_ops">Finance / Ops (M. Shah)</option>
                <option value="admin">System Administrator (Elena)</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" icon={ShieldCheck}>
              {mode === 'login' ? 'Sign In to Platform' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Protected by JWT & RBAC Middleware Governance
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginView;
