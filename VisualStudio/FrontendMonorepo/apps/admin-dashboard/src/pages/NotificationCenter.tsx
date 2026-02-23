/// <reference types="react-quill-css" />
import React, { useEffect, useState, useRef } from 'react';
import {
  Typography, Box, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert, Checkbox,
} from '@mui/material';
import Dropzone from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiRequest } from '../api';
import { canEdit, canDelete, Role } from '../utils/rbac';
import { getHelp } from '../utils/help';
import { exportToCSV, importFromCSV } from '../utils/importExport';
import { bulkDelete, bulkUpdate } from '../utils/bulkActions';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  // Undo/redo stacks
  const undoStack = useRef<any[][]>([]);
  const redoStack = useRef<any[][]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: '', message: '', type: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotification, setEditNotification] = useState<{ title: string; message: string; type: string }>({ title: '', message: '', type: '' });

  const handleEditInit = (notification: any) => {
    setEditingId(notification.id);
    setEditNotification({ title: notification.title, message: notification.message, type: notification.type });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditNotification({ title: '', message: '', type: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editNotification),
    });
    setEditingId(null);
    setEditNotification({ title: '', message: '', type: '' });
    fetchNotifications();
  };

  const fetchNotifications = () => {
    setLoading(true);
    apiRequest('/admin/notifications')
      .then(data => {
        setNotifications(data);
        // Clear undo/redo on fresh fetch
        undoStack.current = [];
        redoStack.current = [];
      })
      .catch(e => { setError(e.message || 'Failed to load notifications'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  // Archive instead of delete (soft delete)
  const handleArchive = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/notifications/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) });
    } else if (selected.length) {
      await bulkUpdate('notifications', selected, selected.map(id => ({ id, archived: true })));
      setSelected([]);
    }
    fetchNotifications();
  };

  // Duplicate selected notifications
  const handleDuplicate = async () => {
    for (const id of selected) {
      const orig = notifications.find((n: any) => n.id === id);
      if (orig) {
        const copy = { ...orig, id: undefined, title: orig.title + ' (copy)' };
        await apiRequest('/admin/notifications', { method: 'POST', body: JSON.stringify(copy) });
      }
    }
    setSelected([]);
    fetchNotifications();
  };

  // Bulk edit: set type for all selected
  const handleBulkEdit = async (field: string, value: any) => {
    await bulkUpdate('notifications', selected, selected.map(id => ({ id, [field]: value })));
    setSelected([]);
    fetchNotifications();
  };

  // Undo/redo
  const pushUndo = () => { undoStack.current.push([...notifications]); if (undoStack.current.length > 20) undoStack.current.shift(); };
  const handleUndo = () => {
    if (undoStack.current.length) {
      redoStack.current.push([...notifications]);
      setNotifications(undoStack.current.pop()!);
    }
  };
  const handleRedo = () => {
    if (redoStack.current.length) {
      undoStack.current.push([...notifications]);
      setNotifications(redoStack.current.pop()!);
    }
  };

  const handleAdd = async () => {
    let imageUrl = newNotification.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    await apiRequest('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify({ ...newNotification, image: imageUrl }),
    });
    setShowAdd(false);
    setNewNotification({ title: '', message: '', type: '', description: '', image: '' });
    setImageFile(null);
    fetchNotifications();
  };

  const handleExport = () => { exportToCSV(notifications, 'notifications.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('notifications', data.map((n: any) => n.id), data);
    setImporting(false);
    fetchNotifications();
  };

  return (
    <Box>
      <Typography variant="h5">Notification Center</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('notifications') || 'Manage system and player notifications.'}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained" sx={{ mr: 1 }}>Add Notification</Button>}
        {canDelete(role) && <Button onClick={() => handleArchive()} disabled={!selected.length} color="warning" variant="outlined" sx={{ mr: 1 }}>Archive Selected</Button>}
        {canEdit(role) && <Button onClick={handleDuplicate} disabled={!selected.length} variant="outlined" sx={{ mr: 1 }}>Duplicate Selected</Button>}
        {canEdit(role) && <Button onClick={() => handleBulkEdit('type', prompt('Set type for all selected:') || '')} disabled={!selected.length} variant="outlined" sx={{ mr: 1 }}>Bulk Edit Type</Button>}
        <Button onClick={handleUndo} disabled={!undoStack.current.length} variant="outlined" sx={{ mr: 1 }}>Undo</Button>
        <Button onClick={handleRedo} disabled={!redoStack.current.length} variant="outlined" sx={{ mr: 1 }}>Redo</Button>
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
      </Box>
      <List>
        {notifications.map(notification => (
          <ListItem key={notification.id} alignItems="flex-start" secondaryAction={
            <>
              {editingId === notification.id ? (
                <>
                  <Button onClick={() => handleEditSave(notification.id)} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
                </>
              ) : (
                <>
                  {canEdit(role) && <Button onClick={() => { handleEditInit(notification); }} size="small" sx={{ mr: 1 }}>Edit</Button>}
                  {canDelete(role) && <IconButton onClick={() => handleArchive(notification.id)} color="warning">🗑️</IconButton>}
                </>
              )}
            </>
          }>
            <Checkbox checked={selected.includes(notification.id)} onChange={() => { handleSelect(notification.id); }} />
            {editingId === notification.id ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="Title"
                  value={editNotification.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditNotification(i => ({ ...i, title: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Message"
                  value={editNotification.message}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditNotification(i => ({ ...i, message: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Type"
                  value={editNotification.type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditNotification(i => ({ ...i, type: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }}>
                  <Typography variant="subtitle2">Live Preview</Typography>
                  <Typography variant="h6">{editNotification.title}</Typography>
                  <Typography variant="caption">Type: {editNotification.type}</Typography>
                  <Typography variant="body2">{editNotification.message}</Typography>
                </Box>
              </Box>
            ) : (
              <ListItemText primary={notification.title} secondary={`Type: ${notification.type} | Message: ${notification.message}`} />
            )}
            {notification.image && <img src={notification.image} alt="notification" style={{ maxWidth: 80, maxHeight: 60, marginLeft: 12 }} />}
          </ListItem>
        ))}
      </List>
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
        <DialogTitle>Add Notification</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="normal" value={newNotification.title} onChange={e => { setNewNotification(n => ({ ...n, title: e.target.value })); }} />
          <TextField label="Message" fullWidth margin="normal" value={newNotification.message} onChange={e => { setNewNotification(n => ({ ...n, message: e.target.value })); }} />
          <TextField label="Type" fullWidth margin="normal" value={newNotification.type} onChange={e => { setNewNotification(n => ({ ...n, type: e.target.value })); }} />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            <ReactQuill value={newNotification.description} onChange={val => { setNewNotification(n => ({ ...n, description: val })); }} theme="snow" />
          </Box>
          <Box sx={{ my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }}>
            <Typography variant="subtitle2">Live Preview</Typography>
            <Typography variant="h6">{newNotification.title}</Typography>
            <Typography variant="caption">Type: {newNotification.type}</Typography>
            <Typography variant="body2">{newNotification.message}</Typography>
            <div dangerouslySetInnerHTML={{ __html: newNotification.description }} />
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ maxWidth: 120, maxHeight: 80, marginTop: 8 }} />}
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Image</Typography>
            <Dropzone onDrop={acceptedFiles => { setImageFile(acceptedFiles[0]); }} multiple={false} accept={{'image/*': []}}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} style={{ border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                  <input {...getInputProps()} />
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ maxWidth: 120, maxHeight: 80 }} />
                  ) : (
                    <span>Drag & drop or click to select image</span>
                  )}
                </div>
              )}
            </Dropzone>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowAdd(false); }}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationCenter;
