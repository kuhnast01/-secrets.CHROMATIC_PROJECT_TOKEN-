import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { apiRequest } from '../api';

const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/admin/audit-log')
      .then(setLogs)
      .catch(e => { setError(e.message || 'Failed to load audit log'); })
      .finally(() => { setLoading(false); });
  }, []);

  return (
    <div>
      <Typography variant="h5">Audit Log</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <List>
        {logs.map((log, i) => (
          <ListItem key={i}>
            <ListItemText primary={log.message} secondary={log.timestamp} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AuditLog;
