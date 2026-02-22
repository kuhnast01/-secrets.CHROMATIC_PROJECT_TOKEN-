import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isSessionActive, logout } from '../utils/session';

interface AdminSessionContextProps {
  isAuthenticated: boolean;
  logout: () => void;
}

const AdminSessionContext = createContext<AdminSessionContextProps | undefined>(undefined);

export const AdminSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isSessionActive());

  useEffect(() => {
    const check = () => setIsAuthenticated(isSessionActive());
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  return (
    <AdminSessionContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AdminSessionContext.Provider>
  );
};

export function useAdminSession() {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error('useAdminSession must be used within AdminSessionProvider');
  return ctx;
}
