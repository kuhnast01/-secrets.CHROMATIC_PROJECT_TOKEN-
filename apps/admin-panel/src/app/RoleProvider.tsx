"use client";
import React, { createContext, useContext, ReactNode } from 'react';

export type Role = 'admin' | 'operator' | 'designer' | 'support' | 'viewer';

interface RoleContextProps {
  role: Role;
  can: (permission: string) => boolean;
}

const permissions: Record<Role, string[]> = {
  admin: ['view', 'edit', 'publish', 'audit', 'revert'],
  operator: ['view', 'edit', 'publish'],
  designer: ['view', 'edit'],
  support: ['view'],
  viewer: ['view'],
};

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleProvider = ({ role, children }: { role: Role; children: ReactNode }) => {
  const can = (permission: string) => permissions[role].includes(permission);
  return (
    <RoleContext.Provider value={{ role, can }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
};
