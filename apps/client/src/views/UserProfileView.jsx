import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import {
  User,
  Mail,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Info,
  DollarSign,
  Award,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export const UserProfileView = ({ currentUser = {}, onUpdateProfile }) => {
  // Database original data
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Feedback notifications
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch true profile data from DB upon mount or when user id/email changes
  useEffect(() => {
    let isMounted = true;

    const fetchProfileFromDb = async () => {
      setIsLoadingProfile(true);
      setErrorMsg('');
      try {
        let dbData = null;
        try {
          const res = await api.users.getProfile();
          dbData = res?.data || res;
        } catch (_) {
          try {
            const authRes = await api.auth.me();
            dbData = authRes?.data?.user || authRes?.user || authRes?.data || authRes;
          } catch (e2) {
            console.warn('API getProfile/me failed, falling back to currentUser context:', e2);
          }
        }

        const resolved = dbData || currentUser || {};
        const profileObj = {
          id: resolved.id || resolved._id || currentUser.id || currentUser._id || '',
          name: resolved.name || currentUser.name || '',
          email: resolved.email || currentUser.email || '',
          department: resolved.department || currentUser.department || '',
          phone: resolved.phone || currentUser.phone || '',
          company_name: resolved.company_name || currentUser.company_name || resolved.name || currentUser.name || '',
          role: resolved.role || currentUser.role || 'sales_rep',
          tier: resolved.tier || currentUser.tier || 'Silver',
          currency: resolved.currency || currentUser.currency || 'USD',
          team_id: resolved.team_id || currentUser.team_id || null
        };

        if (isMounted) {
          setOriginalProfile(profileObj);
          setName(profileObj.name);
          setEmail(profileObj.email);
          setDepartment(profileObj.department);
          setPhone(profileObj.phone);
          setCompanyName(profileObj.company_name);
        }
      } catch (err) {
        console.error('Error fetching profile from database:', err);
        if (isMounted) {
          const fallback = {
            id: currentUser.id || currentUser._id || '',
            name: currentUser.name || '',
            email: currentUser.email || '',
            department: currentUser.department || '',
            phone: currentUser.phone || '',
            company_name: currentUser.company_name || currentUser.name || '',
            role: currentUser.role || 'sales_rep',
            tier: currentUser.tier || 'Silver',
            currency: currentUser.currency || 'USD'
          };
          setOriginalProfile(fallback);
          setName(fallback.name);
          setEmail(fallback.email);
          setDepartment(fallback.department);
          setPhone(fallback.phone);
          setCompanyName(fallback.company_name);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfileFromDb();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, currentUser?.email]);

  const isCustomer = useMemo(() => {
    const role = (originalProfile?.role || currentUser?.role || '').toLowerCase();
    return role === 'customer';
  }, [originalProfile?.role, currentUser?.role]);

  // Check if ANY field has changed compared to database record
  const hasChanges = useMemo(() => {
    if (!originalProfile) return false;

    const nameChanged = (name || '').trim() !== (originalProfile.name || '').trim();
    const emailChanged = (email || '').trim().toLowerCase() !== (originalProfile.email || '').trim().toLowerCase();
    const phoneChanged = (phone || '').trim() !== (originalProfile.phone || '').trim();
    const deptChanged = !isCustomer && (department || '').trim() !== (originalProfile.department || '').trim();
    const companyChanged = isCustomer && (companyName || '').trim() !== (originalProfile.company_name || '').trim();
    const passwordChanged = Boolean(showPasswordChange && password.trim());

    return nameChanged || emailChanged || phoneChanged || deptChanged || companyChanged || passwordChanged;
  }, [name, email, phone, department, companyName, showPasswordChange, password, originalProfile, isCustomer]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setInfoMsg('');

    // 1. Check if any changes were made before calling DB!
    if (!hasChanges) {
      setInfoMsg('No changes detected. Your profile details are already up to date with the database.');
      setTimeout(() => setInfoMsg(''), 4000);
      return;
    }

    // 2. Validate required inputs
    if (!name.trim()) {
      setErrorMsg(isCustomer ? 'Primary Contact Name is required.' : 'Full Name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email Address is required.');
      return;
    }

    if (showPasswordChange && password) {
      if (password.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('New passwords do not match. Please verify.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim()
      };

      if (isCustomer) {
        payload.role = 'customer';
        if (companyName.trim()) {
          payload.company_name = companyName.trim();
        }
      } else {
        payload.department = department.trim();
      }

      if (showPasswordChange && password) {
        payload.password = password;
      }

      let updatedData = null;
      if (onUpdateProfile) {
        const res = await onUpdateProfile(payload);
        updatedData = res?.user || res?.data || res;
      } else {
        const res = await api.users.updateProfile(payload);
        updatedData = res?.data || res;
      }

      // Update originalProfile state to reflect the latest DB state
      const nextOriginal = {
        ...originalProfile,
        ...payload,
        ...(updatedData && typeof updatedData === 'object' ? updatedData : {})
      };
      setOriginalProfile(nextOriginal);

      // Reset password drawer
      setPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);

      setSaved(true);
      setSuccessMsg('Profile changes saved successfully to the database!');
      setTimeout(() => {
        setSaved(false);
        setSuccessMsg('');
      }, 5000);
    } catch (err) {
      console.error('Error updating profile in DB:', err);
      setErrorMsg(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const roleFormatted = (originalProfile?.role || currentUser?.role || 'sales_rep').replace('_', ' ');

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[#714B67] animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700">Fetching account details from database...</p>
        <p className="text-xs text-slate-400 mt-1">Retrieving verified profile and organization record</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#714B67] to-[#8A5F7E] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-[#714B67]/25 border border-white/20">
            {email ? email.slice(0, 2).toUpperCase() : (name ? name.slice(0, 2).toUpperCase() : 'U')}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {email || name || 'User Account'}
              </h1>
              <Badge variant={isCustomer ? 'success' : 'purple'} className="capitalize">
                {isCustomer ? 'Customer Portal' : `Role: ${roleFormatted}`}
              </Badge>
              {hasChanges ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Unsaved Changes
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Synced with DB
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              {name && name !== email && (
                <>
                  <span className="font-semibold text-slate-700">{name}</span>
                  <span className="text-slate-300">•</span>
                </>
              )}
              {isCustomer ? (
                <>
                  {companyName && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="font-semibold text-slate-700">{companyName}</span>
                    </>
                  )}
                  {originalProfile?.tier && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>Tier: {originalProfile.tier}</span>
                    </>
                  )}
                </>
              ) : (
                department && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>Department: {department}</span>
                  </>
                )
              )}
              {phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{phone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={isSaving ? Loader2 : CheckCircle2}
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-sm"
          >
            {isSaving ? 'Saving to Database...' : 'Save Profile Updates'}
          </Button>
        </div>
      </div>

      {/* Info Notification (No Changes Detected) */}
      {infoMsg && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-sm font-bold text-amber-900">{infoMsg}</span>
        </div>
      )}

      {/* Success Notification */}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-bold text-emerald-900">
            {successMsg || 'Profile updated successfully in the database!'}
          </span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="text-sm font-bold text-red-900">{errorMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card
          title={isCustomer ? 'Customer Account Information' : 'Account Profile Details'}
          subtitle={
            isCustomer
              ? 'Manage organization name, primary contact person, and official billing email'
              : 'Update persona information, contact channels, and organizational unit'
          }
          className="lg:col-span-2"
        >
          <form onSubmit={handleSave} className="space-y-5">
            {isCustomer ? (
              /* Customer Specific Fields */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Organization / Company Name"
                    icon={Building2}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Global Industries"
                    required
                  />
                  <Input
                    label="Primary Contact Person"
                    icon={User}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Billing & Official Email"
                    icon={Mail}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="billing@organization.com"
                    required
                  />
                  <Input
                    label="Contact Phone Number"
                    icon={Phone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Pricing Tier Status</label>
                    <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        {originalProfile?.tier || 'Silver'} Tier Client
                      </span>
                      <Badge variant="success" size="sm">Verified</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Account Currency</label>
                    <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                        {originalProfile?.currency || 'USD'}
                      </span>
                      <Badge variant="neutral" size="sm">Default</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Internal Staff Fields */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    icon={User}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                  <Input
                    label="Work Email Address"
                    icon={Mail}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="work.email@dealflow360.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Department / Unit"
                    icon={Building2}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Enterprise West Sales"
                  />
                  <Input
                    label="Direct Phone Number"
                    icon={Phone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">System Role Persona</label>
                    <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
                      <span>{roleFormatted}</span>
                      <Badge variant="purple" size="sm">Active RBAC</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Database User ID</label>
                    <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 truncate">
                      {originalProfile?.id || originalProfile?._id || '—'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Management */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Security & Authentication</h4>
                  <p className="text-xs text-slate-500">
                    {isCustomer
                      ? 'Set or update portal login password for direct account access.'
                      : 'Update your access password or keep your current credentials.'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Lock}
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                  {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
                </Button>
              </div>

              {showPasswordChange && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        label="New Password"
                        icon={Lock}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div>
                      <Input
                        label="Confirm New Password"
                        icon={Lock}
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Passwords are securely hashed using bcrypt in the database.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {hasChanges ? 'You have modified fields that have not yet been saved.' : 'All field values match the database.'}
              </span>
              <Button
                type="submit"
                variant="primary"
                icon={isSaving ? Loader2 : CheckCircle2}
                disabled={isSaving}
              >
                {isSaving ? 'Saving to Database...' : 'Save Profile Updates'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Side Card: Customer or Staff Specific Overview */}
        <div className="space-y-4">
          {isCustomer ? (
            <Card title="Client Account Overview" subtitle="Database Organization Details">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Customer Tier</span>
                  <Badge variant="success">{originalProfile?.tier || 'Silver'} Tier</Badge>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Default Currency</span>
                  <span className="text-xs font-bold text-slate-900">{originalProfile?.currency || 'USD'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Portal Security</span>
                  <Badge variant="purple">Dual JWT + Magic Link</Badge>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Database Record</span>
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-[120px]">
                    {originalProfile?.customer_id || originalProfile?.id || 'Active'}
                  </span>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="RBAC Operational Scope" subtitle="Internal Permissions Profile">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Role Persona</span>
                  <Badge variant="purple">{roleFormatted}</Badge>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Auth Token</span>
                  <span className="text-xs font-bold text-slate-900">Signed JWT (24h)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Database Status</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Connected
                  </span>
                </div>
              </div>
            </Card>
          )}

          <Card title="Security & Authentication" subtitle="Access verification">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Session Authenticated</span>
                  <span className="text-[10px] text-slate-500">Secure Database Verification</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Active Identifier</span>
                  <span className="font-mono text-slate-700 truncate max-w-[130px]">
                    {originalProfile?.email || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Data Source</span>
                  <span className="font-semibold text-emerald-600">MongoDB Live</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Admin User Provisioning Section */}
      {currentUser.role === 'admin' && !isCustomer && (
        <AdminUserProvisioningCard />
      )}
    </div>
  );
};

const AdminUserProvisioningCard = () => {
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provRole, setProvRole] = useState('sales_rep');
  const [provDept, setProvDept] = useState('Enterprise Sales');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleProvision = async (e) => {
    e.preventDefault();
    setIsProvisioning(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.users.provision({
        name: provName.trim(),
        email: provEmail.trim(),
        role: provRole,
        department: provDept.trim()
      });
      setSuccessMsg(`User ${provName} (${provRole}) provisioned successfully in database!`);
      setProvName('');
      setProvEmail('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to provision user.');
    } finally {
      setIsProvisioning(false);
      setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 5000);
    }
  };

  return (
    <Card
      title="Admin Portal — Provision Internal Staff Accounts"
      subtitle="Create internal role accounts (Sales Rep, Sales Manager, Finance Ops) with assigned permissions"
    >
      {successMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 bg-red-50 border border-red-300 rounded-xl p-3 text-xs font-bold text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          {errorMsg}
        </div>
      )}
      <form onSubmit={handleProvision} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Staff Member Name"
          value={provName}
          onChange={(e) => setProvName(e.target.value)}
          required
          placeholder="e.g. Marcus Vance"
        />
        <Input
          label="Work Email Address"
          type="email"
          value={provEmail}
          onChange={(e) => setProvEmail(e.target.value)}
          required
          placeholder="m.vance@dealflow360.com"
        />
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
          <Button
            type="submit"
            variant="primary"
            icon={isProvisioning ? Loader2 : Building2}
            disabled={isProvisioning}
            className="w-full"
          >
            {isProvisioning ? 'Provisioning...' : 'Provision Account'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserProfileView;
