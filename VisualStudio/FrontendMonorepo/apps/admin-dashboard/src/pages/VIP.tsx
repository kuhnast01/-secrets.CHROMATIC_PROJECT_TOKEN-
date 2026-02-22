/// <reference types="react-quill-css" />
import React, { useEffect, useState } from 'react';
import {
  Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button, Checkbox, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import Dropzone from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './VIP.module.css';
import { apiRequest } from '../api';
import { bulkDelete, bulkUpdate } from '../utils/bulkActions';
import { exportToCSV, importFromCSV } from '../utils/importExport';
import { canEdit, canDelete, Role } from '../utils/rbac';
import { getHelp } from '../utils/help';

const VIP: React.FC = () => {
  const [tiers, setTiers] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState(false);
  const [newTier, setNewTier] = useState({ name: '', perks: '', price: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTier, setEditTier] = useState<{ name: string; perks: string; price: string; description: string }>({ name: '', perks: '', price: '', description: '' });

  const handleEditInit = (tier: any) => {
    setEditingId(tier.id);
    setEditTier({ name: tier.name, perks: tier.perks, price: tier.price, description: tier.description });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTier({ name: '', perks: '', price: '', description: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/vip/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editTier),
    });
    setEditingId(null);
    setEditTier({ name: '', perks: '', price: '', description: '' });
    fetchTiers();
  };

  const fetchTiers = () => {
    setLoading(true);
    apiRequest('/admin/vip')
      .then(setTiers)
      .catch(e => { setError(e.message || 'Failed to load VIP tiers'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  const handleDelete = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/vip/${id}`, { method: 'DELETE' });
    } else if (selected.length) {
      await bulkDelete('vip', selected);
      setSelected([]);
    }
    fetchTiers();
  };

  const handleAdd = async () => {
    let imageUrl = newTier.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    await apiRequest('/admin/vip', {
      method: 'POST',
      body: JSON.stringify({ ...newTier, image: imageUrl }),
    });
    setShowAdd(false);
    setNewTier({ name: '', perks: '', price: '', description: '', image: '' });
    setImageFile(null);
    fetchTiers();
  };

  const handleExport = () => { exportToCSV(tiers, 'vip.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('vip', data.map((t: any) => t.id), data);
    setImporting(false);
    fetchTiers();
  };

  return (
    <Box>
      <Typography variant="h5">VIP/Subscription Management</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('vip') || 'Manage VIP tiers, perks, and pricing.'}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained" sx={{ mr: 1 }}>Add Tier</Button>}
        {canDelete(role) && <Button onClick={() => handleDelete()} disabled={!selected.length} color="error" variant="outlined" sx={{ mr: 1 }}>Delete Selected</Button>}
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
      </Box>
      <List>
        {tiers.map(tier => (
          <ListItem key={tier.id} alignItems="flex-start" secondaryAction={
            <>
              {editingId === tier.id ? (
                <>
                  <Button onClick={() => handleEditSave(tier.id)} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
                </>
              ) : (
                <>
                  {canEdit(role) && <Button onClick={() => { handleEditInit(tier); }} size="small" sx={{ mr: 1 }}>Edit</Button>}
                  {canDelete(role) && <IconButton onClick={() => handleDelete(tier.id)} color="error">🗑️</IconButton>}
                </>
              )}
            </>
          }>
            <Checkbox checked={selected.includes(tier.id)} onChange={() => { handleSelect(tier.id); }} />
            {editingId === tier.id ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="Name"
                  value={editTier.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditTier(t => ({ ...t, name: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Perks"
                  value={editTier.perks}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditTier(t => ({ ...t, perks: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Price"
                  value={editTier.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditTier(t => ({ ...t, price: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2">Description</Typography>
                <ReactQuill
                  value={editTier.description}
                  onChange={(val: string) => { setEditTier(t => ({ ...t, description: val })); }}
                  theme="snow"
                  style={{ minHeight: 80, marginBottom: 8 }}
                />
              </Box>
            ) : (
              <ListItemText
                primary={tier.name}
                secondary={<>
                  <Typography variant="caption">Perks: {tier.perks} | Price: {tier.price}</Typography>
                  <div dangerouslySetInnerHTML={{ __html: tier.description }} />
                </>}
              />
            )}
            {tier.image && <img src={tier.image} alt="vip" style={{ maxWidth: 80, maxHeight: 60, marginLeft: 12 }} />}
          </ListItem>
        ))}
      </List>
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
        <DialogTitle>Add VIP Tier</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={newTier.name} onChange={e => { setNewTier(t => ({ ...t, name: e.target.value })); }} />
          <TextField label="Perks" fullWidth margin="normal" value={newTier.perks} onChange={e => { setNewTier(t => ({ ...t, perks: e.target.value })); }} />
          <TextField label="Price" fullWidth margin="normal" value={newTier.price} onChange={e => { setNewTier(t => ({ ...t, price: e.target.value })); }} />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            <ReactQuill value={newTier.description} onChange={val => { setNewTier(i => ({ ...i, description: val })); }} theme="snow" />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Image</Typography>
            <Dropzone onDrop={acceptedFiles => { setImageFile(acceptedFiles[0]); }} multiple={false} accept={{'image/*': []}}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="vip-dropzone">
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

export default VIP;
