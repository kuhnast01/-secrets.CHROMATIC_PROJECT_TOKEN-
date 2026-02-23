import React, { useEffect, useState } from 'react';
import {
  Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button, Checkbox, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import Dropzone from 'react-dropzone';

let ReactQuill: typeof import('react-quill') | undefined = undefined;
if (typeof window !== 'undefined') {
  ReactQuill = require('react-quill');
  require('react-quill/dist/quill.snow.css');
}
import { apiRequest } from '../api';
import { HelpTooltip } from '../components/HelpTooltip';
import { useAdminSession } from '../context/AdminSessionContext';
import { bulkDelete, bulkUpdate } from '../utils/bulkActions';
import { exportToCSV, importFromCSV } from '../utils/importExport';
import { canEdit, canDelete, Role } from '../utils/rbac';
import { getHelp } from '../utils/help';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// SortableItem component for drag-and-drop
// import '../styles/Shop.css'; // Removed because file does not exist or is not needed

const SortableItem: React.FC<{ item: any; children: React.ReactNode }> = ({ item, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const className = `sortable-item${isDragging ? ' dragging' : ''}`;
  return (
    <div
      ref={setNodeRef}
      className={className}
      {...attributes}
      {...listeners}
      data-transform={CSS.Transform.toString(transform)}
      data-transition={transition}
    >
      {children}
    </div>
  );
};

const Shop: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [dryRunResult, setDryRunResult] = useState<any>(null);
  const [dryRunOpen, setDryRunOpen] = useState(false);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [auditOpen, setAuditOpen] = useState(false);
  const { isAuthenticated } = useAdminSession();
    // Admin dry-run/override example
    const handleDryRun = async () => {
      try {
        const result = await apiRequest('/admin/shop/dry-run', { method: 'POST', body: JSON.stringify({ action: 'bulkDelete', ids: selected }) });
        setDryRunResult(result);
        setDryRunOpen(true);
      } catch (e: any) {
        setDryRunResult({ error: e.message });
        setDryRunOpen(true);
      }
    };

    // Audit log summary example
    const handleAuditLog = async () => {
      try {
        const logs = await apiRequest('/admin/audit-log?scope=shop');
        setAuditLog(logs);
        setAuditOpen(true);
      } catch (e: any) {
        setAuditLog([{ message: e.message, timestamp: new Date().toISOString() }]);
        setAuditOpen(true);
      }
    };
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [dndItems, setDndItems] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', available: true, description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<{ name: string; price: string; available: boolean; description: string }>({ name: '', price: '', available: true, description: '' });

  const handleEditInit = (item: any) => {
    setEditingId(item.id);
    setEditItem({ name: item.name, price: item.price, available: item.available, description: item.description });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditItem({ name: '', price: '', available: true, description: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/shop/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editItem),
    });
    setEditingId(null);
    setEditItem({ name: '', price: '', available: true, description: '' });
    fetchItems();
  };

  const fetchItems = () => {
    setLoading(true);
    apiRequest('/admin/shop')
      .then(setItems)
      .catch(e => { setError(e.message || 'Failed to load shop items'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchItems();
  }, []);
  useEffect(() => { setDndItems(items); }, [items]);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  const handleDelete = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/shop/${id}`, { method: 'DELETE' });
    } else if (selected.length) {
      await bulkDelete('shop', selected);
      setSelected([]);
    }
    fetchItems();
  };

  const handleAdd = async () => {
    let imageUrl = newItem.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    await apiRequest('/admin/shop', {
      method: 'POST',
      body: JSON.stringify({ ...newItem, image: imageUrl }),
    });
    setShowAdd(false);
    setNewItem({ name: '', price: '', available: true, description: '', image: '' });
    setImageFile(null);
    fetchItems();
  };

  const handleExport = () => { exportToCSV(items, 'shop.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('shop', data.map((i: any) => i.id), data);
    setImporting(false);
    fetchItems();
  };
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = dndItems.findIndex(i => i.id === active.id);
      const newIndex = dndItems.findIndex(i => i.id === over.id);
      const newItems = arrayMove(dndItems, oldIndex, newIndex);
      setDndItems(newItems);
      // Optionally, persist new order to backend
    }
  };
  return (
    <Box>
      <Typography variant="h5">Shop Management</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('shop')}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained" sx={{ mr: 1 }}>Add Item</Button>}
        {canDelete(role) && <Button onClick={() => handleDelete()} disabled={!selected.length} color="error" variant="outlined" sx={{ mr: 1 }}>Delete Selected</Button>}
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
        {isAuthenticated && (
          <>
            <Button onClick={handleDryRun} variant="outlined" color="secondary" sx={{ ml: 1 }}>
              Dry-Run Bulk Delete
              <HelpTooltip title="Preview the effect of a bulk delete without making changes. See ADMIN_UI_BACKEND_INTEGRATION.md for details." />
            </Button>
            <Button onClick={handleAuditLog} variant="outlined" color="info" sx={{ ml: 1 }}>
              View Audit Log
              <HelpTooltip title="View all admin actions for Shop. Click entries for details. See ADMIN_UI_BACKEND_INTEGRATION.md." />
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
                <pre className="dry-run-result">{JSON.stringify(dryRunResult, null, 2)}</pre>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDryRunOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>

            {/* Audit Log Dialog */}
            <Dialog open={auditOpen} onClose={() => setAuditOpen(false)} maxWidth="md" fullWidth>
              <DialogTitle>Shop Audit Log Summary</DialogTitle>
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
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dndItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <List>
            {dndItems.map(item => (
              <SortableItem key={item.id} item={item}>
                <ListItem>
                  <ListItemText primary={item.name} secondary={`Price: $${item.price}`} />
                </ListItem>
              </SortableItem>
            ))}
          </List>
        </SortableContext>
      </DndContext>
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={newItem.name} onChange={e => { setNewItem(i => ({ ...i, name: e.target.value })); }} />
          <TextField label="Price" fullWidth margin="normal" value={newItem.price} onChange={e => { setNewItem(i => ({ ...i, price: e.target.value })); }} />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            {ReactQuill ? (
              <ReactQuill value={newItem.description} onChange={val => { setNewItem(i => ({ ...i, description: val })); }} theme="snow" />
            ) : (
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                value={newItem.description}
                onChange={e => { setNewItem(i => ({ ...i, description: e.target.value })); }}
              />
            )}
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Image</Typography>
            <Dropzone onDrop={acceptedFiles => { setImageFile(acceptedFiles[0]); }} multiple={false} accept={{'image/*': []}}>
              {({ getRootProps, getInputProps }) => (
                <Box {...getRootProps()} className="shop-dropzone">
                  <input {...getInputProps()} />
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="preview" className="shop-dropzone-image" />
                  ) : (
                    <span>Drag & drop or click to select image</span>
                  )}
                </Box>
              )}
            </Dropzone>
          </Box>
          <TextField label="Available" fullWidth margin="normal" value={newItem.available ? 'Yes' : 'No'} onChange={e => { setNewItem(i => ({ ...i, available: e.target.value === 'Yes' })); }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowAdd(false); }}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Shop;
