import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {
  Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button, Checkbox, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Drawer, useMediaQuery,
} from '@mui/material';
import { apiRequest } from '../api';
import { useAdminSession } from '../context/AdminSessionContext';
import { bulkDelete, bulkUpdate } from '../utils/bulkActions';
import { exportToCSV, importFromCSV } from '../utils/importExport';
import { canEdit, canDelete, Role } from '../utils/rbac';
import { getHelp } from '../utils/help';
import { useAdminAutomation } from '../utils/useAdminAutomation';
import { HelpTooltip } from '../components/HelpTooltip';

const helpContent = [
  {
    title: 'Promotions Management',
    content: 'Create, edit, and manage promo codes, discounts, and expiration dates. Use bulk actions for efficiency. Archived promos are soft-deleted and can be restored by admins.',
  },
  {
    title: 'Tips',
    content: 'Use the duplicate button to quickly create similar promos. Use bulk edit to update discounts for multiple promos at once. Undo/redo is available for recent changes.',
  },
];

const Promotions: React.FC = () => {
  const [promos, setPromos] = useState<any[]>([]);
  const { isAuthenticated } = useAdminSession();
  const {
    dryRunResult, dryRunOpen, setDryRunOpen,
    auditLog, auditOpen, setAuditOpen,
    handleDryRun, handleAuditLog
  } = useAdminAutomation('promotions');
  // Undo/redo stacks
  const undoStack = useRef<any[][]>([]);
  const redoStack = useRef<any[][]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: '', discount: '', expires: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPromo, setEditPromo] = useState<{ code: string; discount: string; expires: string }>({ code: '', discount: '', expires: '' });

  const handleEditInit = (promo: any) => {
    setEditingId(promo.id);
    setEditPromo({ code: promo.code, discount: promo.discount, expires: promo.expires });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditPromo({ code: '', discount: '', expires: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editPromo),
    });
    setEditingId(null);
    setEditPromo({ code: '', discount: '', expires: '' });
    fetchPromos();
  };
  const [importing, setImporting] = useState(false);

  const fetchPromos = () => {
    setLoading(true);
    apiRequest('/admin/promotions')
      .then(data => {
        setPromos(data);
        // Clear undo/redo on fresh fetch
        undoStack.current = [];
        redoStack.current = [];
      })
      .catch(e => { setError(e.message || 'Failed to load promotions'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  // Archive instead of delete (soft delete)
  const handleArchive = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/promotions/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) });
    } else if (selected.length) {
      await bulkUpdate('promotions', selected, selected.map(id => ({ id, archived: true })));
      setSelected([]);
    }
    fetchPromos();
  };

  // Duplicate selected promos
  const handleDuplicate = async () => {
    for (const id of selected) {
      const orig = promos.find((p: any) => p.id === id);
      if (orig) {
        const copy = { ...orig, id: undefined, code: orig.code + '_copy' };
        await apiRequest('/admin/promotions', { method: 'POST', body: JSON.stringify(copy) });
      }
    }
    setSelected([]);
    fetchPromos();
  };

  // Bulk edit: set discount for all selected
  const handleBulkEdit = async (field: string, value: any) => {
    await bulkUpdate('promotions', selected, selected.map(id => ({ id, [field]: value })));
    setSelected([]);
    fetchPromos();
  };

  // Undo/redo
  const pushUndo = () => { undoStack.current.push([...promos]); if (undoStack.current.length > 20) undoStack.current.shift(); };
  const handleUndo = () => {
    if (undoStack.current.length) {
      redoStack.current.push([...promos]);
      setPromos(undoStack.current.pop()!);
    }
  };
  const handleRedo = () => {
    if (redoStack.current.length) {
      undoStack.current.push([...promos]);
      setPromos(redoStack.current.pop()!);
    }
  };

  const handleAdd = async () => {
    let imageUrl = newPromo.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    await apiRequest('/admin/promotions', {
      method: 'POST',
      body: JSON.stringify({ ...newPromo, image: imageUrl }),
    });
    setShowAdd(false);
    setNewPromo({ code: '', discount: '', expires: '', description: '', image: '' });
    setImageFile(null);
    fetchPromos();
  };

  const handleExport = () => { exportToCSV(promos, 'promotions.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('promotions', data.map((p: any) => p.id), data);
    setImporting(false);
    fetchPromos();
  };

  const isMobile = useMediaQuery('(max-width:900px)');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100%' }}>
      {/* Help Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? sidebarOpen : true}
        onClose={() => { setSidebarOpen(false); }}
        anchor="right"
        sx={{
          width: 300,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 300, boxSizing: 'border-box', p: 2 },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Help & Tips</Typography>
          {helpContent.map((h, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{h.title}</Typography>
              <Typography variant="body2">{h.content}</Typography>
            </Box>
          ))}
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box sx={{ flex: 1, p: isMobile ? 1 : 3, maxWidth: '100vw', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5">Promotions Management</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('promotions') || 'Manage promo codes, discounts, and expiration.'}</Typography>
          </Box>
          {isMobile && (
            <Button onClick={() => { setSidebarOpen(true); }} variant="outlined" size="small">Help</Button>
          )}
        </Box>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ mb: 2, flexWrap: 'wrap', display: 'flex', gap: 1 }}>
          {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained">Add Promotion</Button>}
          {canDelete(role) && <Button onClick={() => handleArchive()} disabled={!selected.length} color="warning" variant="outlined">Archive Selected</Button>}
          {canEdit(role) && <Button onClick={handleDuplicate} disabled={!selected.length} variant="outlined">Duplicate Selected</Button>}
          {canEdit(role) && <Button onClick={() => handleBulkEdit('discount', prompt('Set discount for all selected:') || '')} disabled={!selected.length} variant="outlined">Bulk Edit Discount</Button>}
          <Button onClick={handleUndo} disabled={!undoStack.current.length} variant="outlined">Undo</Button>
          <Button onClick={handleRedo} disabled={!redoStack.current.length} variant="outlined">Redo</Button>
          <Button onClick={handleExport} variant="outlined">Export</Button>
          <Button variant="outlined" component="label">Import
            <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
          </Button>
          {isAuthenticated && (
            <>
              <Button onClick={() => handleDryRun('bulkArchive', { ids: selected })} variant="outlined" color="secondary">
                Dry-Run Bulk Archive
                <HelpTooltip title="Preview the effect of a bulk archive without making changes. See ADMIN_UI_BACKEND_INTEGRATION.md for details." />
              </Button>
              <Button onClick={handleAuditLog} variant="outlined" color="info">
                View Audit Log
                <HelpTooltip title="View all admin actions for Promotions. Click entries for details. See ADMIN_UI_BACKEND_INTEGRATION.md." />
              </Button>
              <Button href="/apps/admin-dashboard/ADMIN_UI_BACKEND_INTEGRATION.md" target="_blank" sx={{ ml: 1 }}>
                Integration Docs
              </Button>
            </>
          )}
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
                  <DialogTitle>Promotions Audit Log Summary</DialogTitle>
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
        </Box>
        <List>
          {promos.map(promo => (
            <ListItem key={promo.id} alignItems="flex-start" secondaryAction={
              <>
                {editingId === promo.id ? (
                  <>
                    <Button onClick={() => handleEditSave(promo.id)} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
                    <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
                  </>
                ) : (
                  <>
                    {canEdit(role) && <Button onClick={() => { handleEditInit(promo); }} size="small" sx={{ mr: 1 }}>Edit</Button>}
                    {canDelete(role) && <IconButton onClick={() => handleArchive(promo.id)} color="warning">🗑️</IconButton>}
                  </>
                )}
              </>
            }>
              <Checkbox checked={selected.includes(promo.id)} onChange={() => { handleSelect(promo.id); }} />
              {editingId === promo.id ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    label="Code"
                    value={editPromo.code}
                    onChange={e => { setEditPromo(i => ({ ...i, code: e.target.value })); }}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Discount"
                    value={editPromo.discount}
                    onChange={e => { setEditPromo(i => ({ ...i, discount: e.target.value })); }}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Expires"
                    value={editPromo.expires}
                    onChange={e => { setEditPromo(i => ({ ...i, expires: e.target.value })); }}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </Box>
              ) : (
                <ListItemText primary={promo.code} secondary={`Discount: ${promo.discount} | Expires: ${promo.expires}`} />
              )}
            </ListItem>
          ))}
        </List>
        <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
          <DialogTitle>Add Promotion</DialogTitle>
          <DialogContent>
            <TextField label="Code" fullWidth margin="normal" value={newPromo.code} onChange={e => { setNewPromo(p => ({ ...p, code: e.target.value })); }} />
            <TextField label="Discount" fullWidth margin="normal" value={newPromo.discount} onChange={e => { setNewPromo(p => ({ ...p, discount: e.target.value })); }} />
            <TextField label="Expires" fullWidth margin="normal" value={newPromo.expires} onChange={e => { setNewPromo(p => ({ ...p, expires: e.target.value })); }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setShowAdd(false); }}>Cancel</Button>
            <Button onClick={handleAdd} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>

  );
};

export default Promotions;
