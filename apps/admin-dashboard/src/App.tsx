import React from 'react';
import { AdminSessionProvider } from './context/AdminSessionContext';
import { Routes, Route, Navigate } from 'react-router-dom';

import Security from './pages/Security';
import Updates from './pages/Updates';
import Users from './pages/Users';
import Shop from './pages/Shop';
import Events from './pages/Events';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuditLog from './pages/AuditLog';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <AdminSessionProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="security" element={<Security />} />
            <Route path="updates" element={<Updates />} />
            <Route path="users" element={<Users />} />
            <Route path="shop" element={<Shop />} />
            <Route path="events" element={<Events />} />
            <Route path="audit-log" element={<AuditLog />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AdminSessionProvider>
  );
};

export default App;
