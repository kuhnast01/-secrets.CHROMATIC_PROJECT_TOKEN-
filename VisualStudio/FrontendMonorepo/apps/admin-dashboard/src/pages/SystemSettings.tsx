import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {
  Typography, Box, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert, Checkbox,
} from '@mui/material';
import { apiRequest } from '../api';
import { useAdminSession } from '../context/AdminSessionContext';
import { canEdit, canDelete, Role } from '../utils/rbac';
import { getHelp } from '../utils/help';
import { exportToCSV, importFromCSV } from '../utils/importExport';
import { bulkDelete, bulkUpdate } from '../utils/bulkActions';

const defaultSettings = { maintenanceMode: false, version: '', motd: '' };

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(defaultSettings);
  const [dryRunResult, setDryRunResult] = useState<any>(null);
  const [dryRunOpen, setDryRunOpen] = useState(false);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [auditOpen, setAuditOpen] = useState(false);
  const { isAuthenticated } = useAdminSession();
  // Undo/redo stacks
  const undoStack = useRef<any[]>([]);
  const redoStack = useRef<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  // Inline editing state for each field
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);
  const [importing, setImporting] = useState(false);

  const fetchSettings = () => {
    setLoading(true);
    apiRequest('/admin/settings')
      .then(data => {
        setSettings(data);
        // Clear undo/redo on fresh fetch
        undoStack.current = [];
        redoStack.current = [];
      })
      .catch(e => { setError(e.message || 'Failed to load settings'); })
      .finally(() => { setLoading(false); });
  };

  // Archive disables all settings (soft delete)
  const handleArchive = async () => {
    const archived = { maintenanceMode: true, version: '', motd: '' };
    await apiRequest('/admin/settings', { method: 'PUT', body: JSON.stringify(archived) });
    fetchSettings();
  };

  // Undo/redo
  const pushUndo = () => { undoStack.current.push({ ...settings }); if (undoStack.current.length > 20) undoStack.current.shift(); };
  const handleUndo = () => {
    if (undoStack.current.length) {
      redoStack.current.push({ ...settings });
      setSettings(undoStack.current.pop());
    }
  };
  const handleRedo = () => {
    if (redoStack.current.length) {
      undoStack.current.push({ ...settings });
      setSettings(redoStack.current.pop());
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleEdit = (field: string) => {
    setEditingField(field);
    setEditValue(settings[field]);
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue(null);
  };

  const handleEditSave = async () => {
    await apiRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ ...settings, [editingField!]: editValue }),
    });
    setEditingField(null);
    setEditValue(null);
    fetchSettings();
  };

  const handleExport = () => { exportToCSV([settings], 'system_settings.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const [data] = await importFromCSV(e.target.files[0]);
    await apiRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    setImporting(false);
    fetchSettings();
  };

  return (
    <Box>
      <Typography variant="h5">System Settings</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('system') || 'Manage global system settings, maintenance, and MOTD.'}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
        <Button onClick={handleArchive} color="warning" variant="outlined" sx={{ mr: 1 }}>Archive Settings</Button>
        <Button onClick={handleUndo} disabled={!undoStack.current.length} variant="outlined" sx={{ mr: 1 }}>Undo</Button>
        <Button onClick={handleRedo} disabled={!redoStack.current.length} variant="outlined" sx={{ mr: 1 }}>Redo</Button>
        {isAuthenticated && (
          <>
            <Button onClick={async () => {
              try {
                const result = await apiRequest('/admin/settings/dry-run', { method: 'POST', body: JSON.stringify({ action: 'update', data: settings }) });
                setDryRunResult(result);
                setDryRunOpen(true);
              } catch (e: any) {
                setDryRunResult({ error: e.message });
                setDryRunOpen(true);
              }
            }} variant="outlined" color="secondary" sx={{ ml: 1 }}>Dry-Run Update</Button>
            <Button onClick={async () => {
              try {
                const logs = await apiRequest('/admin/audit-log?scope=settings');
                setAuditLog(logs);
                setAuditOpen(true);
              } catch (e: any) {
                setAuditLog([{ message: e.message, timestamp: new Date().toISOString() }]);
                setAuditOpen(true);
              }
            }} variant="outlined" color="info" sx={{ ml: 1 }}>View Audit Log</Button>
          </>
        )}
      </Box>
            {/* Dry-Run Result Dialog */}
            <Dialog open={dryRunOpen} onClose={() => setDryRunOpen(false)}>
              <DialogTitle>Dry-Run Result</DialogTitle>
              <DialogContent>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(dryRunResult, null, 2)}</pre>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDryRunOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>

            {/* Audit Log Dialog */}
            <Dialog open={auditOpen} onClose={() => setAuditOpen(false)} maxWidth="md" fullWidth>
              <DialogTitle>System Settings Audit Log Summary</DialogTitle>
              <DialogContent>
                <List>
                  {auditLog.map((log, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={log.message} secondary={log.timestamp} />
                    </ListItem>
                  ))}
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setAuditOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
      <List>
        <ListItem>
          {editingField === 'maintenanceMode' ? (
            <>
              <Checkbox checked={!!editValue} onChange={e => { setEditValue(e.target.checked); }} />
              <ListItemText primary="Maintenance Mode" secondary={editValue ? 'ON' : 'OFF'} />
              <Button onClick={handleEditSave} color="primary" size="small" sx={{ ml: 1 }}>Save</Button>
              <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
            </>
          ) : (
            <>
              <Checkbox checked={!!settings.maintenanceMode} disabled />
              <ListItemText primary="Maintenance Mode" secondary={settings.maintenanceMode ? 'ON' : 'OFF'} />
              {canEdit(role) && <Button onClick={() => { handleEdit('maintenanceMode'); }} size="small" sx={{ ml: 1 }}>Edit</Button>}
            </>
          )}
        </ListItem>
        <ListItem>
          {editingField === 'version' ? (
            <>
              <TextField label="Version" value={editValue} onChange={e => { setEditValue(e.target.value); }} size="small" sx={{ mr: 1 }} />
              <Button onClick={handleEditSave} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
              <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
            </>
          ) : (
            <>
              <ListItemText primary="Version" secondary={settings.version} />
              {canEdit(role) && <Button onClick={() => { handleEdit('version'); }} size="small" sx={{ ml: 1 }}>Edit</Button>}
            </>
          )}
        </ListItem>
        <ListItem>
          {editingField === 'motd' ? (
            <>
              <TextField label="Message of the Day" value={editValue} onChange={e => { setEditValue(e.target.value); }} size="small" sx={{ mr: 1 }} />
              <Button onClick={handleEditSave} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
              <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
            </>
          ) : (
            <>
              <ListItemText primary="Message of the Day" secondary={settings.motd} />
              {canEdit(role) && <Button onClick={() => { handleEdit('motd'); }} size="small" sx={{ ml: 1 }}>Edit</Button>}
            </>
          )}
        </ListItem>
      </List>
    </Box>
  );
};

export default SystemSettings;
