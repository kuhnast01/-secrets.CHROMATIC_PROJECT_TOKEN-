import React, { useEffect, useState } from 'react';

type User = {
  id: string | number;
  name: string;
  email?: string;
  role?: string;
  status?: string;
};

async function fetchUsers(): Promise<User[]> {
  // Replace with real backend endpoint
  const res = await fetch('http://localhost:4000/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>User Management</h2>
      {loading && <div>Loading users...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Email</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Role</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email || '-'}</td>
              <td>{user.role || '-'}</td>
              <td>{user.status || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* TODO: Add search, grant/ban, audit logs, diagnostics, etc. */}
    </div>
  );
}
