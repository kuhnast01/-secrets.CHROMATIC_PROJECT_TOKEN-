import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableContentBlock from '../components/DraggableContentBlock';
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
import { bulkDelete, bulkUpdate } from '../utils/bulkActions';
import { exportToCSV, importFromCSV } from '../utils/importExport';
import { canEdit, canDelete, Role } from '../utils/rbac';
import { getHelp } from '../utils/help';
import { useAdminSession } from '../context/AdminSessionContext';
import { useAdminAutomation } from '../utils/useAdminAutomation';
import { HelpTooltip } from '../components/HelpTooltip';

const initialBlocks = [
  { id: 'event-info', content: <Typography variant="h5">Event Management</Typography> },
  { id: 'event-image', content: <img src="https://placekitten.com/320/120" alt="event graphic" style={{ maxWidth: 320, borderRadius: 8 }} /> },
  { id: 'event-widget', content: <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 4 }}>Widget: Upcoming Events</Box> },
];

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [blocks, setBlocks] = useState(initialBlocks);
    const handleDragEnd = (event: any) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = blocks.findIndex(b => b.id === active.id);
        const newIndex = blocks.findIndex(b => b.id === over.id);
        const newBlocks = [...blocks];
        const [moved] = newBlocks.splice(oldIndex, 1);
        newBlocks.splice(newIndex, 0, moved);
        setBlocks(newBlocks);
      }
    };
    // Example: Add new text block
    const addTextBlock = () => {
      setBlocks([...blocks, { id: `text-${Date.now()}`, content: <Typography>New event text block</Typography> }]);
    };
    // Example: Add new image block
    const addImageBlock = () => {
      setBlocks([...blocks, { id: `img-${Date.now()}`, content: <img src="https://placekitten.com/320/120" alt="added event graphic" style={{ maxWidth: 320, borderRadius: 8 }} /> }]);
    };
  const [selected, setSelected] = useState<string[]>([]);
  // Admin automation wiring
  const { isAuthenticated } = useAdminSession();
  const {
    dryRunResult, dryRunOpen, setDryRunOpen,
    auditLog, auditOpen, setAuditOpen,
    handleDryRun, handleAuditLog
  } = useAdminAutomation('events');
    /**
     * Admin Automation Controls (Dry-Run, Audit Log)
     * - Dry-run: Preview effect of bulk delete or update without making changes.
     * - Audit log: View all admin actions for Events.
     * - Integration Docs: See ADMIN_UI_BACKEND_INTEGRATION.md for troubleshooting and maintenance.
     */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', active: true, description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<{ name: string; date: string; active: boolean; description: string }>({ name: '', date: '', active: true, description: '' });

  const handleEditInit = (event: any) => {
    setEditingId(event.id);
    setEditEvent({ name: event.name, date: event.date, active: event.active, description: event.description });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditEvent({ name: '', date: '', active: true, description: '' });
  };

  const handleEditSave = async (id: string) => {
    await apiRequest(`/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editEvent),
    });
    setEditingId(null);
    setEditEvent({ name: '', date: '', active: true, description: '' });
    fetchEvents();
  };

  const fetchEvents = () => {
    setLoading(true);
    apiRequest('/admin/events')
      .then(setEvents)
      .catch(e => { setError(e.message || 'Failed to load events'); })
      .finally(() => { setLoading(false); });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  const handleDelete = async (id?: string) => {
    if (id) {
      await apiRequest(`/admin/events/${id}`, { method: 'DELETE' });
    } else if (selected.length) {
      await bulkDelete('events', selected);
      setSelected([]);
    }
    fetchEvents();
  };

  const handleAdd = async () => {
    let imageUrl = newEvent.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    await apiRequest('/admin/events', {
      method: 'POST',
      body: JSON.stringify({ ...newEvent, image: imageUrl }),
    });
    setShowAdd(false);
    setNewEvent({ name: '', date: '', active: true, description: '', image: '' });
    setImageFile(null);
    fetchEvents();
  };

  const handleExport = () => { exportToCSV(events, 'events.csv'); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    const data = await importFromCSV(e.target.files[0]);
    await bulkUpdate('events', data.map((ev: any) => ev.id), data);
    setImporting(false);
    fetchEvents();
  };

  return (
    <Box>
      {/* Drag-and-drop content blocks section */}
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={addTextBlock} sx={{ mr: 1 }}>Add Text Block</Button>
        <Button variant="outlined" onClick={addImageBlock}>Add Image Block</Button>
        {isAuthenticated && (
          <>
            <Button onClick={() => handleDryRun('bulkDelete', { ids: selected })} variant="outlined" color="secondary" sx={{ ml: 1 }}>
              Dry-Run Bulk Delete
              <HelpTooltip title="Preview the effect of a bulk delete without making changes. See ADMIN_UI_BACKEND_INTEGRATION.md for details." />
            </Button>
            <Button onClick={handleAuditLog} variant="outlined" color="info" sx={{ ml: 1 }}>
              View Audit Log
              <HelpTooltip title="View all admin actions for Events. Click entries for details. See ADMIN_UI_BACKEND_INTEGRATION.md." />
            </Button>
            <Button href="/apps/admin-dashboard/ADMIN_UI_BACKEND_INTEGRATION.md" target="_blank" sx={{ ml: 1 }}>
              Integration Docs
            </Button>
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
              <DialogTitle>Events Audit Log Summary</DialogTitle>
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
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map(block => (
            <DraggableContentBlock key={block.id} id={block.id}>
              {block.content}
            </DraggableContentBlock>
          ))}
        </SortableContext>
      </DndContext>
      {/* Original event management features */}
      <Typography variant="h5">Event Management</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{getHelp('events')}</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && <Button onClick={() => { setShowAdd(true); }} variant="contained" sx={{ mr: 1 }}>Add Event</Button>}
        {canDelete(role) && <Button onClick={() => handleDelete()} disabled={!selected.length} color="error" variant="outlined" sx={{ mr: 1 }}>Delete Selected</Button>}
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>Export</Button>
        <Button variant="outlined" component="label">Import
          <input type="file" accept=".csv" hidden onChange={handleImport} disabled={importing} />
        </Button>
      </Box>
      <List>
        {events.map(event => (
          <ListItem key={event.id} alignItems="flex-start" secondaryAction={
            <>
              {editingId === event.id ? (
                <>
                  <Button onClick={() => handleEditSave(event.id)} color="primary" size="small" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={handleEditCancel} color="inherit" size="small">Cancel</Button>
                </>
              ) : (
                <>
                  {canEdit(role) && <Button onClick={() => { handleEditInit(event); }} size="small" sx={{ mr: 1 }}>Edit</Button>}
                  {canDelete(role) && <IconButton onClick={() => handleDelete(event.id)} color="error">🗑️</IconButton>}
                </>
              )}
            </>
          }>
            <Checkbox checked={selected.includes(event.id)} onChange={() => { handleSelect(event.id); }} />
            {editingId === event.id ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="Name"
                  value={editEvent.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditEvent(ev => ({ ...ev, name: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Date"
                  value={editEvent.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditEvent(ev => ({ ...ev, date: e.target.value })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Active"
                  value={editEvent.active ? 'Yes' : 'No'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditEvent(ev => ({ ...ev, active: e.target.value === 'Yes' })); }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2">Description</Typography>
                <ReactQuill
                  value={editEvent.description}
                  onChange={(val: string) => { setEditEvent(ev => ({ ...ev, description: val })); }}
                  theme="snow"
                  style={{ minHeight: 80, marginBottom: 8 }}
                />
              </Box>
            ) : (
              <ListItemText
                primary={event.name}
                secondary={<>
                  <Typography variant="caption">Date: {event.date} | Active: {event.active ? 'Yes' : 'No'}</Typography>
                  <div dangerouslySetInnerHTML={{ __html: event.description }} />
                </>}
              />
            )}
            {event.image && <img src={event.image} alt="event" style={{ maxWidth: 80, maxHeight: 60, marginLeft: 12 }} />}
          </ListItem>
        ))}
      </List>
      <Dialog open={showAdd} onClose={() => { setShowAdd(false); }}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={newEvent.name} onChange={e => { setNewEvent(ev => ({ ...ev, name: e.target.value })); }} />
          <TextField label="Date" fullWidth margin="normal" value={newEvent.date} onChange={e => { setNewEvent(ev => ({ ...ev, date: e.target.value })); }} />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Description</Typography>
            <ReactQuill value={newEvent.description} onChange={val => { setNewEvent(ev => ({ ...ev, description: val })); }} theme="snow" />
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
          <TextField label="Active" fullWidth margin="normal" value={newEvent.active ? 'Yes' : 'No'} onChange={e => { setNewEvent(ev => ({ ...ev, active: e.target.value === 'Yes' })); }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowAdd(false); }}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Events;
