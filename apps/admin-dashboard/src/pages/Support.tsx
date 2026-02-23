/// <reference types="react-quill-css" />
import React, { useEffect, useState, useRef } from 'react';
import {
  Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button, Checkbox, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import Dropzone from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiRequest } from '../api';
import { bulkDelete, bulkUpdate } from '../utils/bulkActions';
import { exportToCSV, importFromCSV } from '../utils/importExport';
import { canEdit, canDelete, Role } from '../utils/rbac';
import { getHelp } from '../utils/help';

const Support: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  // Undo/redo stacks
  const undoStack = useRef<any[][]>([]);
  const redoStack = useRef<any[][]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', user: '', status: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTicket, setEditTicket] = useState<{ subject: string; user: string; status: string }>({ subject: '', user: '', status: '' });

  const handleEditInit = (ticket: any) => {
    setEditingId(ticket.id);
    setEditTicket({ subject: ticket.subject, user: ticket.user, status: ticket.status });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTicket({ subject: '', user: '', status: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/support/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editTicket),
    });
    setEditingId(null);
    setEditTicket({ subject: '', user: '', status: '' });
    fetchTickets();
  };

  const fetchTickets = () => {
    setLoading(true);
    apiRequest('/admin/support')
      .then(data => {
        setTickets(data);
        // Clear undo/redo on fresh fetch
        undoStack.current = [];
        redoStack.current = [];
      })
      .catch(e => { setError(e.message || 'Failed to load tickets'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  // Archive instead of delete (soft delete)
  const handleArchive = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/support/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) });
    } else if (selected.length) {
      await bulkUpdate('support', selected, selected.map(id => ({ id, archived: true })));
      setSelected([]);
    }
    fetchTickets();
  };

  // Duplicate selected tickets
  const handleDuplicate = async () => {
    for (const id of selected) {
      const orig = tickets.find((t: any) => t.id === id);
      if (orig) {
        const copy = { ...orig, id: undefined, subject: orig.subject + ' (copy)' };
        await apiRequest('/admin/support', { method: 'POST', body: JSON.stringify(copy) });
      }
    }
    setSelected([]);
    fetchTickets();
  };

  // Bulk edit: set status for all selected
  const handleBulkEdit = async (field: string, value: any) => {
    await bulkUpdate('support', selected, selected.map(id => ({ id, [field]: value })));
    setSelected([]);
    fetchTickets();
  };

  // Undo/redo
  const pushUndo = () => { undoStack.current.push([...tickets]); if (undoStack.current.length > 20) undoStack.current.shift(); };
  const handleUndo = () => {
    if (undoStack.current.length) {
      redoStack.current.push([...tickets]);
      setTickets(undoStack.current.pop()!);
    }
  };
  const handleRedo = () => {
    if (redoStack.current.length) {
      undoStack.current.push([...tickets]);
      setTickets(redoStack.current.pop()!);
    }
  };

  const handleAdd = async () => {
    let imageUrl = newTicket.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    await apiRequest('/admin/support', {
      method: 'POST',
      body: JSON.stringify({ ...newTicket, image: imageUrl }),
    });
    setShowAdd(false);
    setNewTicket({ subject: '', user: '', status: '', description: '', image: '' });
    setImageFile(null);
    fetchTickets();
  };

  const handleExport = () => { exportToCSV(tickets, 'support.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('support', data.map((t: any) => t.id), data);
    setImporting(false);
    fetchTickets();
  };

  return (
    <Box>
      <Typography variant="h5">Support/Ticket Management</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('support') || 'Manage player support tickets and moderation.'}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained" sx={{ mr: 1 }}>Add Ticket</Button>}
        {canDelete(role) && <Button onClick={() => handleArchive()} disabled={!selected.length} color="warning" variant="outlined" sx={{ mr: 1 }}>Archive Selected</Button>}
        {canEdit(role) && <Button onClick={handleDuplicate} disabled={!selected.length} variant="outlined" sx={{ mr: 1 }}>Duplicate Selected</Button>}
        {canEdit(role) && <Button onClick={() => handleBulkEdit('status', prompt('Set status for all selected:') || '')} disabled={!selected.length} variant="outlined" sx={{ mr: 1 }}>Bulk Edit Status</Button>}
        <Button onClick={handleUndo} disabled={!undoStack.current.length} variant="outlined" sx={{ mr: 1 }}>Undo</Button>
        <Button onClick={handleRedo} disabled={!redoStack.current.length} variant="outlined" sx={{ mr: 1 }}>Redo</Button>
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
      </Box>
      <List>
        {tickets.map(ticket => (
          <ListItem key={ticket.id} alignItems="flex-start" secondaryAction={
            <>
              {editingId === ticket.id ? (
                <>
                  <Button onClick={() => handleEditSave(ticket.id)} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
                </>
              ) : (
                <>
                  {canEdit(role) && <Button onClick={() => { handleEditInit(ticket); }} size="small" sx={{ mr: 1 }}>Edit</Button>}
                  {canDelete(role) && <IconButton onClick={() => handleArchive(ticket.id)} color="warning">🗑️</IconButton>}
                </>
              )}
            </>
          }>
            <Checkbox checked={selected.includes(ticket.id)} onChange={() => { handleSelect(ticket.id); }} />
            {editingId === ticket.id ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="Subject"
                  value={editTicket.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditTicket(i => ({ ...i, subject: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="User"
                  value={editTicket.user}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditTicket(i => ({ ...i, user: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Status"
                  value={editTicket.status}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditTicket(i => ({ ...i, status: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
              </Box>
            ) : (
              <ListItemText primary={ticket.subject} secondary={`User: ${ticket.user} | Status: ${ticket.status}`} />
            )}
            {ticket.image && <img src={ticket.image} alt="ticket" className="ticket-image" />}
          </ListItem>
        ))}
      </List>
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
        <DialogTitle>Add Ticket</DialogTitle>
        <DialogContent>
          <TextField label="Subject" fullWidth margin="normal" value={newTicket.subject} onChange={e => { setNewTicket(t => ({ ...t, subject: e.target.value })); }} />
          <TextField label="User" fullWidth margin="normal" value={newTicket.user} onChange={e => { setNewTicket(t => ({ ...t, user: e.target.value })); }} />
          <TextField label="Status" fullWidth margin="normal" value={newTicket.status} onChange={e => { setNewTicket(t => ({ ...t, status: e.target.value })); }} />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            <ReactQuill value={newTicket.description} onChange={val => { setNewTicket(t => ({ ...t, description: val })); }} theme="snow" />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Image</Typography>
            <Dropzone onDrop={acceptedFiles => { setImageFile(acceptedFiles[0]); }} multiple={false} accept={{'image/*': []}}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} style={{ border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                  <input {...getInputProps()} />
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="preview" className="ticket-image-preview" />
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

export default Support;
