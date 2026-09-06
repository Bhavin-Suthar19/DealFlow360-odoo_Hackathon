import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Building2, Lock, Mail, ShieldCheck, User, Users, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { api, setAuthToken } from '../services/api';

export const LoginView = ({ onLoginSuccess }) => {
  const { showAlert } = useModal();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('alex.j@dealflow360.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Lockout tracking
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      showAlert({
        title: 'Account Temporarily Locked',
        message: 'Account temporarily locked due to 5 consecutive failed login attempts. Please try again after 15 minutes.',
        variant: 'danger'
      });
      return;
    }

    try {
      const res = await api.auth.login({ email: loginEmail, password: loginPassword });
      const userData = res.data?.user || res.user;
      const token = res.data?.token || res.token;

      if (token) {
        setAuthToken(token);
      }
      setFailedAttempts(0);

      onLoginSuccess(userData);
    } catch (err) {
      const errMsg = err.message || 'Invalid email or password';
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5 || errMsg.includes('locked') || err.statusCode === 429) {
        setIsLocked(true);
        showAlert({
          title: 'Account Temporarily Locked',
          message: errMsg.includes('locked') ? errMsg : 'Account temporarily locked due to 5 consecutive failed login attempts. Please try again after 15 minutes.',
          variant: 'danger'
        });
      } else {
        const remaining = 5 - newAttempts;
        showAlert({
          title: 'Invalid Credentials Warning',
          message: errMsg.includes('remaining') ? errMsg : `Invalid email or password. ${remaining} attempt(s) remaining before temporary account lock.`,
          variant: 'warning'
        });
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    setSignupError('');

    try {
      await api.auth.signup({
        name: fullName,
        email: signupEmail,
        password: signupPassword
      });

      setLoginEmail(signupEmail);
      setLoginPassword(signupPassword);

      showAlert({
        title: 'Account Created Successfully!',
        message: `Customer account created for ${fullName || signupEmail}. Redirecting to log in...`,
        variant: 'success'
      });

      setTimeout(() => {
        setMode('login');
      }, 1500);
    } catch (err) {
      showAlert({
        title: 'Sign Up Error',
        message: err.message || 'Failed to create customer account. Please try again.',
        variant: 'danger'
      });
    }
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

          {isLocked && (
            <div className="mb-4 bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">Account Temporarily Locked</h4>
                <p className="text-[11px] text-rose-700">5 failed attempts detected. Try again after 15 minutes.</p>
              </div>
            </div>
          )}

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
              <div className="relative">
                <Input
                  label="Password"
                  type={showLoginPassword ? 'text' : 'password'}
                  icon={Lock}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  className="absolute right-3 bottom-2 p-1 text-slate-400 hover:text-[#714B67] cursor-pointer transition-colors"
                  tabIndex={-1}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2" icon={ShieldCheck} disabled={isLocked}>
                Sign In to Platform
              </Button>
            </form>
          ) : (
            /* SIGN UP FORM — PUBLIC SIGNUP (DEFAULTS TO CUSTOMER) */
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
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="s.jenkins@customer.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showSignupPassword ? 'text' : 'password'}
                  icon={Lock}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword((v) => !v)}
                  className="absolute right-3 bottom-2 p-1 text-slate-400 hover:text-[#714B67] cursor-pointer transition-colors"
                  tabIndex={-1}
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={signupError}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 bottom-2 p-1 text-slate-400 hover:text-[#714B67] cursor-pointer transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 font-medium">
                Public signups are automatically provisioned with <strong>Customer Account</strong> access. Internal staff accounts (Sales Rep, Manager, Finance Ops) are created by System Administrators.
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2" icon={Users}>
                Create Customer Account
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium">
              Protected by Dual JWT Tokens, HttpOnly Cookies & Redis Lockout
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginView;