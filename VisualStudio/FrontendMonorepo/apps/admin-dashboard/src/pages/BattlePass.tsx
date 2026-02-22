/// <reference types="react-quill-css" />
import React, { useEffect, useState, useRef } from 'react';
import styles from './BattlePass.module.css';
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

const BattlePass: React.FC = () => {
  const [passes, setPasses] = useState<any[]>([]);
  // Undo/redo stacks
  const undoStack = useRef<any[][]>([]);
  const redoStack = useRef<any[][]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState(false);
  const [newPass, setNewPass] = useState({ name: '', season: '', rewards: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPass, setEditPass] = useState<{ name: string; season: string; rewards: string }>({ name: '', season: '', rewards: '' });

  const handleEditInit = (pass: any) => {
    setEditingId(pass.id);
    setEditPass({ name: pass.name, season: pass.season, rewards: pass.rewards });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditPass({ name: '', season: '', rewards: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/battlepass/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editPass),
    });
    setEditingId(null);
    setEditPass({ name: '', season: '', rewards: '' });
    fetchPasses();
  };

  const fetchPasses = () => {
    setLoading(true);
    apiRequest('/admin/battlepass')
      .then(data => {
        setPasses(data);
        // Clear undo/redo on fresh fetch
        undoStack.current = [];
        redoStack.current = [];
      })
      .catch(e => { setError(e.message || 'Failed to load battle passes'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  // Archive instead of delete (soft delete)
  const handleArchive = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/battlepass/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) });
    } else if (selected.length) {
      await bulkUpdate('battlepass', selected, selected.map(id => ({ id, archived: true })));
      setSelected([]);
    }
    fetchPasses();
  };

  // Duplicate selected passes
  const handleDuplicate = async () => {
    for (const id of selected) {
      const orig = passes.find((p: any) => p.id === id);
      if (orig) {
        const copy = { ...orig, id: undefined, name: orig.name + ' (copy)' };
        await apiRequest('/admin/battlepass', { method: 'POST', body: JSON.stringify(copy) });
      }
    }
    setSelected([]);
    fetchPasses();
  };

  // Bulk edit: set season for all selected
  const handleBulkEdit = async (field: string, value: any) => {
    await bulkUpdate('battlepass', selected, selected.map(id => ({ id, [field]: value })));
    setSelected([]);
    fetchPasses();
  };

  // Undo/redo
  const pushUndo = () => { undoStack.current.push([...passes]); if (undoStack.current.length > 20) undoStack.current.shift(); };
  const handleUndo = () => {
    if (undoStack.current.length) {
      redoStack.current.push([...passes]);
      setPasses(undoStack.current.pop()!);
    }
  };
  const handleRedo = () => {
    if (redoStack.current.length) {
      undoStack.current.push([...passes]);
      setPasses(redoStack.current.pop()!);
    }
  };

  const handleAdd = async () => {
    let imageUrl = newPass.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    await apiRequest('/admin/battlepass', {
      method: 'POST',
      body: JSON.stringify({ ...newPass, image: imageUrl }),
    });
    setShowAdd(false);
    setNewPass({ name: '', season: '', rewards: '', description: '', image: '' });
    setImageFile(null);
    fetchPasses();
  };

  const handleExport = () => { exportToCSV(passes, 'battlepass.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('battlepass', data.map((p: any) => p.id), data);
    setImporting(false);
    fetchPasses();
  };

  return (
    <Box>
      <Typography variant="h5">Battle Pass Management</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('battlepass') || 'Manage battle passes, seasons, and rewards.'}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained" sx={{ mr: 1 }}>Add Pass</Button>}
        {canDelete(role) && <Button onClick={() => handleArchive()} disabled={!selected.length} color="warning" variant="outlined" sx={{ mr: 1 }}>Archive Selected</Button>}
        {canEdit(role) && <Button onClick={handleDuplicate} disabled={!selected.length} variant="outlined" sx={{ mr: 1 }}>Duplicate Selected</Button>}
        {canEdit(role) && <Button onClick={() => handleBulkEdit('season', prompt('Set season for all selected:') || '')} disabled={!selected.length} variant="outlined" sx={{ mr: 1 }}>Bulk Edit Season</Button>}
        <Button onClick={handleUndo} disabled={!undoStack.current.length} variant="outlined" sx={{ mr: 1 }}>Undo</Button>
        <Button onClick={handleRedo} disabled={!redoStack.current.length} variant="outlined" sx={{ mr: 1 }}>Redo</Button>
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
      </Box>
      <List>
        {passes.map(pass => (
          <ListItem key={pass.id} alignItems="flex-start" secondaryAction={
            <>
              {editingId === pass.id ? (
                <>
                  <Button onClick={() => handleEditSave(pass.id)} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
                </>
              ) : (
                <>
                  {canEdit(role) && <Button onClick={() => { handleEditInit(pass); }} size="small" sx={{ mr: 1 }}>Edit</Button>}
                  {canDelete(role) && <IconButton onClick={() => handleArchive(pass.id)} color="warning">🗑️</IconButton>}
                </>
              )}
            </>
          }>
            <Checkbox checked={selected.includes(pass.id)} onChange={() => { handleSelect(pass.id); }} />
            {editingId === pass.id ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="Name"
                  value={editPass.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditPass(i => ({ ...i, name: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Season"
                  value={editPass.season}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditPass(i => ({ ...i, season: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Rewards"
                  value={editPass.rewards}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditPass(i => ({ ...i, rewards: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }}>
                  <Typography variant="subtitle2">Live Preview</Typography>
                  <Typography variant="h6">{editPass.name}</Typography>
                  <Typography variant="caption">Season: {editPass.season}</Typography>
                  <Typography variant="body2">Rewards: {editPass.rewards}</Typography>
                </Box>
              </Box>
            ) : (
              <ListItemText primary={pass.name} secondary={`Season: ${pass.season} | Rewards: ${pass.rewards}`} />
            )}
            {pass.image && <img src={pass.image} alt="battlepass" className="battlepass-image" />}
          </ListItem>
        ))}
      </List>
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
        <DialogTitle>Add Battle Pass</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={newPass.name} onChange={e => { setNewPass(p => ({ ...p, name: e.target.value })); }} />
          <TextField label="Season" fullWidth margin="normal" value={newPass.season} onChange={e => { setNewPass(p => ({ ...p, season: e.target.value })); }} />
          <TextField label="Rewards" fullWidth margin="normal" value={newPass.rewards} onChange={e => { setNewPass(p => ({ ...p, rewards: e.target.value })); }} />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            <ReactQuill value={newPass.description} onChange={val => { setNewPass(i => ({ ...i, description: val })); }} theme="snow" />
          </Box>
          <Box sx={{ my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }}>
            <Typography variant="subtitle2">Live Preview</Typography>
            <Typography variant="h6">{newPass.name}</Typography>
            <Typography variant="caption">Season: {newPass.season}</Typography>
            <Typography variant="body2">Rewards: {newPass.rewards}</Typography>
            <div dangerouslySetInnerHTML={{ __html: newPass.description }} />
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ maxWidth: 120, maxHeight: 80, marginTop: 8 }} />}
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Image</Typography>
            <Dropzone onDrop={acceptedFiles => { setImageFile(acceptedFiles[0]); }} multiple={false} accept={{'image/*': []}}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} style={{ border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                  <input {...getInputProps()} />
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="preview" className={styles.previewImage} />
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

export default BattlePass;
