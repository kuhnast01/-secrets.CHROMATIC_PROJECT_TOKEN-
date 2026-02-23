"use client";
import React, { useState, useEffect } from 'react';
import styles from './UserManagementPanel.module.css';

import { apiFetch } from '../api';

const UserManagementPanel: React.FC = () => {
  type User = { id: string; email: string; name: string; role: string; provider: string };
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    apiFetch('/users')
      .then(setUsers)
      .catch(() => { setUsers([]); });
  }, []);
  return (
    <div className="user-management-panel">
      <h2>User Management</h2>
      <table className="user-table">
        <thead>
          <tr className="user-table-header-row">
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Provider</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{u.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add invite/add user, role change, SSO login buttons here */}
    </div>
  );
};
export default UserManagementPanel;
