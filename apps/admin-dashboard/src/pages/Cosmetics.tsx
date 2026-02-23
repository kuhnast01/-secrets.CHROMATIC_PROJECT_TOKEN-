import React, { useEffect, useState } from 'react';
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
import styles from './Cosmetics.module.css';

const Cosmetics: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', type: '', rarity: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<{ name: string; type: string; rarity: string; description: string }>({ name: '', type: '', rarity: '', description: '' });

  const handleEditInit = (item: any) => {
    setEditingId(item.id);
    setEditItem({ name: item.name, type: item.type, rarity: item.rarity, description: item.description });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditItem({ name: '', type: '', rarity: '', description: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/cosmetics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editItem),
    });
    setEditingId(null);
    setEditItem({ name: '', type: '', rarity: '', description: '' });
    fetchItems();
  };

  const fetchItems = () => {
    setLoading(true);
    apiRequest('/admin/cosmetics')
      .then(setItems)
      .catch(e => { setError(e.message || 'Failed to load cosmetics'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  const handleDelete = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/cosmetics/${id}`, { method: 'DELETE' });
    } else if (selected.length) {
      await bulkDelete('cosmetics', selected);
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
    await apiRequest('/admin/cosmetics', {
      method: 'POST',
      body: JSON.stringify({ ...newItem, image: imageUrl }),
    });
    setShowAdd(false);
    setNewItem({ name: '', type: '', rarity: '', description: '', image: '' });
    setImageFile(null);
    fetchItems();
  };

  const handleExport = () => { exportToCSV(items, 'cosmetics.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('cosmetics', data.map((i: any) => i.id), data);
    setImporting(false);
    fetchItems();
  };

  return (
    <Box>
      <Typography variant="h5">Cosmetics Management</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('cosmetics') || 'Manage in-game cosmetics, skins, and items.'}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained" sx={{ mr: 1 }}>Add Cosmetic</Button>}
        {canDelete(role) && <Button onClick={() => handleDelete()} disabled={!selected.length} color="error" variant="outlined" sx={{ mr: 1 }}>Delete Selected</Button>}
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
      </Box>
      <List>
        {items.map(item => (
          <ListItem key={item.id} alignItems="flex-start" secondaryAction={
            <>
              {editingId === item.id ? (
                <>
                  <Button onClick={() => handleEditSave(item.id)} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
                </>
              ) : (
                <>
                  {canEdit(role) && <Button onClick={() => { handleEditInit(item); }} size="small" sx={{ mr: 1 }}>Edit</Button>}
                  {canDelete(role) && <IconButton onClick={() => handleDelete(item.id)} color="error">🗑️</IconButton>}
                </>
              )}
            </>
          }>
            <Checkbox checked={selected.includes(item.id)} onChange={() => { handleSelect(item.id); }} />
            {editingId === item.id ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="Name"
                  value={editItem.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditItem(i => ({ ...i, name: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Type"
                  value={editItem.type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditItem(i => ({ ...i, type: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Rarity"
                  value={editItem.rarity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditItem(i => ({ ...i, rarity: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2">Description</Typography>
                <ReactQuill
                  value={editItem.description}
                  onChange={(val: string) => { setEditItem(i => ({ ...i, description: val })); }}
                  theme="snow"
                  style={{ minHeight: 80, marginBottom: 8 }}
                />
              </Box>
            ) : (
              <ListItemText
                primary={item.name}
                secondary={<>
                  <Typography variant="caption">Type: {item.type} | Rarity: {item.rarity}</Typography>
                  <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </>}
              />
            )}
            {item.image && <img src={item.image} alt="cosmetic" className="cosmetic-image" />}
          </ListItem>
        ))}
      </List>
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
        <DialogTitle>Add Cosmetic</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={newItem.name} onChange={e => { setNewItem(i => ({ ...i, name: e.target.value })); }} />
          <TextField label="Type" fullWidth margin="normal" value={newItem.type} onChange={e => { setNewItem(i => ({ ...i, type: e.target.value })); }} />
          <TextField label="Rarity" fullWidth margin="normal" value={newItem.rarity} onChange={e => { setNewItem(i => ({ ...i, rarity: e.target.value })); }} />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            <ReactQuill value={newItem.description} onChange={val => { setNewItem(i => ({ ...i, description: val })); }} theme="snow" />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Image</Typography>
            <Dropzone onDrop={acceptedFiles => { setImageFile(acceptedFiles[0]); }} multiple={false} accept={{'image/*': []}}>
              {({ getRootProps, getInputProps }) => (
                <Box {...getRootProps()} sx={{ border: '2px dashed #888', p: 2, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                  <input {...getInputProps()} />
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ maxWidth: 120, maxHeight: 80 }} />
                  ) : (
                    <span>Drag & drop or click to select image</span>
                  )}
                </Box>
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

export default Cosmetics;
