import React from 'react';
import { Outlet } from 'react-router-dom';

export const PortalLayout = () => {
  return (
    <div className="portal-shell">
      <header style={{ padding: '16px', background: '#0f172a', color: '#38bdf8' }}>
        <h1>DealFlow360 Customer Portal</h1>
      </header>
      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
};
