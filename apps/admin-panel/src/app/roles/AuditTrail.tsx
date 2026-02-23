
import React, { useState, useEffect } from 'react';


import { getAuditTrail, AuditEntry } from '../auditTrail';

export default function AuditTrail() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  useEffect(() => {
    let mounted = true;
    async function fetchEntries() {
      const data = await getAuditTrail();
      if (mounted) setEntries(data);
    }
    fetchEntries();
    const interval = setInterval(fetchEntries, 2000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);
  return (
    <div>
      <h2>Audit Trail</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.user}</td>
              <td>{entry.action}</td>
              <td>{entry.details ? JSON.stringify(entry.details) : '-'}</td>
              <td>{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* TODO: Add revert/undo UI */}
    </div>
  );
}
