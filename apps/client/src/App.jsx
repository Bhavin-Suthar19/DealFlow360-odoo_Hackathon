import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InternalLayout } from './layouts/InternalLayout';
import { PortalLayout } from './layouts/PortalLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PortalRoute } from './routes/PortalRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<InternalLayout />}>
            <Route index element={<div>Dashboard</div>} />
          </Route>
        </Route>

        <Route element={<PortalRoute />}>
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<div>Customer Negotiation Portal</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
