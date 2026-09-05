import React from 'react';
import { Outlet } from 'react-router-dom';

export const InternalLayout = () => {
  return (
    <div className="internal-shell">
      <header style={{ padding: '16px', background: '#1e293b', color: '#fff' }}>
        <h1>DealFlow360 Internal Console (Rep/Manager/Finance/Admin)</h1>
      </header>
      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
};
