import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export const PortalLayout = () => {
  const navigate = useNavigate();
  const portalUser = JSON.parse(localStorage.getItem('portal_user') || '{"email":"procurement@acme.com","role":"CUSTOMER"}');

  const handleLogout = () => {
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
    navigate('/portal/login');
  };

  const portalNav = [
    { label: 'My Quotation', path: '/portal' },
    { label: 'Messages', path: '/portal/messages' },
    { label: 'Profile', path: '/portal/profile' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Customer Portal Top Nav */}
      <header
        style={{
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          padding: '0 32px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', fontSize: '18px', color: '#10b981' }}>
            <span style={{ backgroundColor: '#10b981', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              ✓
            </span>
            DealFlow360 Customer Portal
          </div>

          <nav style={{ display: 'flex', gap: '8px' }}>
            {portalNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/portal'}
                style={({ isActive }) => ({
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#10b981' : '#94a3b8',
                  backgroundColor: isActive ? '#1e293b' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{portalUser.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 14px',
              backgroundColor: '#1e293b',
              color: '#cbd5e1',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Exit Portal
          </button>
        </div>
      </header>

      {/* Main Customer View Shell */}
      <main style={{ padding: '32px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;
