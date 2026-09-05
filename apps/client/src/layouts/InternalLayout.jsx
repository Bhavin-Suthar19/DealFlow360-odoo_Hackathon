import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export const InternalLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"email":"sales.rep@dealflow360.com","role":"REP"}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Quotations', path: '/quotations' },
    { label: 'Approvals', path: '/approvals' },
    { label: 'Fulfillment', path: '/fulfillment' },
    { label: 'Subscriptions', path: '/subscriptions' },
    { label: 'Invoices', path: '/invoices' },
    { label: 'Deal Health', path: '/deal-health' },
    { label: 'Reports', path: '/reports' },
    { label: 'Products', path: '/products' },
    { label: 'Governance', path: '/governance' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Top Header Nav */}
      <header
        style={{
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '18px', color: '#38bdf8' }}>
            <span style={{ backgroundColor: '#0284c7', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              360
            </span>
            DealFlow360
          </div>

          <nav style={{ display: 'flex', gap: '4px' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                style={({ isActive }) => ({
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  backgroundColor: isActive ? '#0f172a' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc' }}>{user.email}</div>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700' }}>{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: '#334155',
              color: '#cbd5e1',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Shell */}
      <main style={{ padding: '28px 32px', maxWidth: '1600px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default InternalLayout;
