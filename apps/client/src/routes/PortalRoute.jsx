import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PortalRoute = () => {
  const portalToken = localStorage.getItem('portal_token');
  if (!portalToken) {
    return <Navigate to="/portal/login" replace />;
  }
  return <Outlet />;
};
