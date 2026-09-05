import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  User,
  Users,
} from 'lucide-react';

import { useLoginMutation, useSignupMutation } from '../features/auth/authApi';
import { useDispatch } from 'react-redux';
import {
  setCredentials,
  setLoading,
  setError,
} from '../features/auth/authSlice';

export const LoginView = ({ onLoginSuccess, onSelectPortal }) => {
  const dispatch = useDispatch();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signup, { isLoading: signupLoading }] = useSignupMutation();

  const [mode, setMode] = useState('login');

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState('sales_rep');
  const [teamId, setTeamId] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMsg('');
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      if (mode === 'login') {
        const result = await login({
          email: loginEmail,
          password: loginPassword,
        }).unwrap();

        const { token, user } = result.data || result;

        dispatch(setCredentials({ user, token }));

        setSuccessMsg('Login successful!');

        setTimeout(() => {
          setSuccessMsg('');
          onLoginSuccess(user);
        }, 500);
      } else {
        if (signupPassword !== confirmPassword) {
          const message = 'Passwords do not match';
          setErrorMessage(message);
          dispatch(setError(message));
          return;
        }

        const payload = {
          name: fullName,
          email: signupEmail,
          password: signupPassword,
          role: signupRole,
        };

        if (teamId.trim()) {
          payload.team_id = teamId.trim();
        }

        await signup(payload).unwrap();

        setSuccessMsg('Account created! Please log in.');

        setMode('login');

        setFullName('');
        setSignupEmail('');
        setSignupPassword('');
        setConfirmPassword('');
        setTeamId('');
      }
    } catch (err) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        'Authentication error';

      setErrorMessage(message);
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const isLoading =
    mode === 'login' ? loginLoading : signupLoading;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full z-10 space-y-6">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#714B67] shadow-xl shadow-[#714B67]/20 mb-2">
            <Building2 className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            DealFlow360
          </h1>

          <p className="text-xs text-[#714B67] uppercase font-bold tracking-wider">
            Complete B2B Sales, Quotation & Revenue Ops Platform
          </p>
        </div>

        {/* Customer Portal */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-[#714B67] uppercase tracking-wider block">
              Customer Portal Access
            </span>

            <p className="text-xs text-slate-600">
              View quotes & submit negotiation terms
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onSelectPortal}
            icon={ArrowRight}
          >
            Portal Login
          </Button>
        </div>

        {/* Login / Signup Card */}
        <Card className="shadow-sm">

          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2.5 text-center text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'border-[#714B67] text-[#714B67]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2.5 text-center text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'border-[#714B67] text-[#714B67]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Signup Name */}
            {mode === 'signup' && (
              <Input
                label="Full Name"
                type="text"
                icon={User}
                placeholder="e.g. Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@dealflow360.com"
              value={mode === 'login' ? loginEmail : signupEmail}
              onChange={(e) => {
                if (mode === 'login') {
                  setLoginEmail(e.target.value);
                } else {
                  setSignupEmail(e.target.value);
                }
              }}
              required
            />

            {/* Role - Signup only */}
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Role
                </label>

                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#714B67]"
                >
                  <option value="sales_rep">Sales Representative</option>
                  <option value="sales_manager">Sales Manager</option>
                  <option value="finance_ops">Finance / Operations</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
            )}

            {/* Password */}
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={mode === 'login' ? loginPassword : signupPassword}
              onChange={(e) => {
                if (mode === 'login') {
                  setLoginPassword(e.target.value);
                } else {
                  setSignupPassword(e.target.value);
                }
              }}
              required
            />

            {/* Confirm Password */}
            {mode === 'signup' && (
              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            {/* Optional Team ID */}
            {mode === 'signup' && (
              <Input
                label="Team ID (Optional)"
                type="text"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              />
            )}

            {/* Error */}
            {errorMessage && (
              <div
                className="text-sm text-red-600"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div
                className="text-sm text-green-600"
                role="alert"
              >
                {successMsg}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              icon={mode === 'login' ? ShieldCheck : Users}
              disabled={isLoading}
            >
              {mode === 'login'
                ? isLoading
                  ? 'Signing In...'
                  : 'Sign In to Platform'
                : isLoading
                  ? 'Creating Account...'
                  : 'Create Account'}
            </Button>
          </form>

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