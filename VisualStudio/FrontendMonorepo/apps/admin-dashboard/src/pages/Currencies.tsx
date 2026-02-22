/// <reference types="react-quill-css" />
import React, { useEffect, useState } from 'react';
import './Currencies.css';
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

const Currencies: React.FC = () => {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ name: '', symbol: '', rate: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCurrency, setEditCurrency] = useState<{ name: string; symbol: string; rate: string; description: string }>({ name: '', symbol: '', rate: '', description: '' });

  const handleEditInit = (currency: any) => {
    setEditingId(currency.id);
    setEditCurrency({ name: currency.name, symbol: currency.symbol, rate: currency.rate, description: currency.description });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditCurrency({ name: '', symbol: '', rate: '', description: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/currencies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editCurrency),
    });
    setEditingId(null);
    setEditCurrency({ name: '', symbol: '', rate: '', description: '' });
    fetchCurrencies();
  };

  const fetchCurrencies = () => {
    setLoading(true);
    apiRequest('/admin/currencies')
      .then(setCurrencies)
      .catch(e => { setError(e.message || 'Failed to load currencies'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  const handleDelete = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/currencies/${id}`, { method: 'DELETE' });
    } else if (selected.length) {
      await bulkDelete('currencies', selected);
      setSelected([]);
    }
    fetchCurrencies();
  };

  const handleAdd = async () => {
    let imageUrl = newCurrency.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    await apiRequest('/admin/currencies', {
      method: 'POST',
      body: JSON.stringify({ ...newCurrency, image: imageUrl }),
    });
    setShowAdd(false);
    setNewCurrency({ name: '', symbol: '', rate: '', description: '', image: '' });
    setImageFile(null);
    fetchCurrencies();
  };

  const handleExport = () => { exportToCSV(currencies, 'currencies.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('currencies', data.map((c: any) => c.id), data);
    setImporting(false);
    fetchCurrencies();
  };

  return (
    <Box>
      <Typography variant="h5">Currency Management</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('currencies') || 'Manage in-game currencies, exchange rates, and rewards.'}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained" sx={{ mr: 1 }}>Add Currency</Button>}
        {canDelete(role) && <Button onClick={() => handleDelete()} disabled={!selected.length} color="error" variant="outlined" sx={{ mr: 1 }}>Delete Selected</Button>}
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
      </Box>
      <List>
        {currencies.map(currency => (
          <ListItem key={currency.id} alignItems="flex-start" secondaryAction={
            <>
              {editingId === currency.id ? (
                <>
                  <Button onClick={() => handleEditSave(currency.id)} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
                </>
              ) : (
                <>
                  {canEdit(role) && <Button onClick={() => { handleEditInit(currency); }} size="small" sx={{ mr: 1 }}>Edit</Button>}
                  {canDelete(role) && <IconButton onClick={() => handleDelete(currency.id)} color="error">🗑️</IconButton>}
                </>
              )}
            </>
          }>
            <Checkbox checked={selected.includes(currency.id)} onChange={() => { handleSelect(currency.id); }} />
            {editingId === currency.id ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="Name"
                  value={editCurrency.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditCurrency(c => ({ ...c, name: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Symbol"
                  value={editCurrency.symbol}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditCurrency(c => ({ ...c, symbol: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Rate"
                  value={editCurrency.rate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditCurrency(c => ({ ...c, rate: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2">Description</Typography>
                <ReactQuill
                  value={editCurrency.description}
                  onChange={(val: string) => { setEditCurrency(c => ({ ...c, description: val })); }}
                  theme="snow"
                  style={{ minHeight: 80, marginBottom: 8 }}
                />
              </Box>
            ) : (
              <ListItemText
                primary={currency.name}
                secondary={<>
                  <Typography variant="caption">Symbol: {currency.symbol} | Rate: {currency.rate}</Typography>
                  <div dangerouslySetInnerHTML={{ __html: currency.description }} />
                </>}
              />
            )}
            {currency.image && <img src={currency.image} alt="currency" className="currency-image" />}
          </ListItem>
        ))}
      </List>
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
        <DialogTitle>Add Currency</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={newCurrency.name} onChange={e => { setNewCurrency(c => ({ ...c, name: e.target.value })); }} />
          <TextField label="Symbol" fullWidth margin="normal" value={newCurrency.symbol} onChange={e => { setNewCurrency(c => ({ ...c, symbol: e.target.value })); }} />
          <TextField label="Rate" fullWidth margin="normal" value={newCurrency.rate} onChange={e => { setNewCurrency(c => ({ ...c, rate: e.target.value })); }} />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            <ReactQuill value={newCurrency.description} onChange={val => { setNewCurrency(i => ({ ...i, description: val })); }} theme="snow" />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Image</Typography>
            <Dropzone onDrop={acceptedFiles => { setImageFile(acceptedFiles[0]); }} multiple={false} accept={{'image/*': []}}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} style={{ border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                  <input {...getInputProps()} />
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="preview" className="currency-image-preview" />
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

export default Currencies;
