/// <reference types="react-quill-css" />
import React, { useEffect, useState, useRef } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  Checkbox,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import Dropzone from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Content.module.css';
import { apiRequest } from '../api';
import { bulkUpdate } from '../utils/bulkActions';
import { exportToCSV, importFromCSV } from '../utils/importExport';
import { canEdit, canDelete, Role } from '../utils/rbac';
import { getHelp } from '../utils/help';

const Content: React.FC = () => {
  interface ContentItem {
    id: string;
    title: string;
    type: string;
    body: string;
    image?: string;
  }
  const [items, setItems] = useState<ContentItem[]>([]);
  // Undo/redo stacks
  const undoStack = useRef<ContentItem[][]>([]);
  const redoStack = useRef<ContentItem[][]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [role] = useState<Role>('admin'); // Replace with real user role
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<ContentItem>({
    id: '',
    title: '',
    type: '',
    body: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState<boolean>(false);
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<{ title: string; type: string; body: string }>({
    title: '',
    type: '',
    body: '',
  });
  const handleEditInit = (item: ContentItem): void => {
    setEditingId(item.id);
    setEditItem({ title: item.title, type: item.type, body: item.body });
  };

  const handleEditCancel = (): void => {
    setEditingId(null);
    setEditItem({ title: '', type: '', body: '' });
  };

  const handleEditSave = async (id: string): Promise<void> => {
    await apiRequest(`/admin/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(editItem),
    });
    setEditingId(null);
    setEditItem({ title: '', type: '', body: '' });
    fetchItems();
  };

  const fetchItems = (): void => {
    setLoading(true);
    apiRequest('/admin/content')
      .then((data: ContentItem[]) => {
        setItems(data);
        // Clear undo/redo on fresh fetch
        undoStack.current = [];
        redoStack.current = [];
      })
      .catch((e: unknown) => {
        if (
          typeof e === 'object' &&
          e !== null &&
          'message' in e &&
          typeof (e as { message?: string }).message === 'string' &&
          (e as { message?: string }).message &&
          ((e as { message?: string }).message as string).length > 0
        ) {
          setError((e as { message: string }).message);
        } else {
          setError('Failed to load content');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: string): void => {
    setSelected((sel) => (sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id]));
  };

  // Archive instead of delete (soft delete)
  const handleArchive = async (id?: string): Promise<void> => {
    if (typeof id === 'string' && id.length > 0) {
      await apiRequest(`/admin/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ archived: true }),
      });
    } else if (selected.length > 0) {
      await bulkUpdate(
        'content',
        selected,
        selected.map((id) => ({ id, archived: true }))
      );
      setSelected([]);
    }
    fetchItems();
  };

  // Duplicate selected items
  const handleDuplicate = async (): Promise<void> => {
    for (const id of selected) {
      const orig = items.find((i: ContentItem) => i.id === id);
      if (orig) {
        const copy = { ...orig, id: undefined, title: orig.title + ' (copy)' };
        await apiRequest('/admin/content', { method: 'POST', body: JSON.stringify(copy) });
      }
    }
    setSelected([]);
    fetchItems();
  };

  // Bulk edit: set type for all selected
  const handleBulkEdit = async (field: string, value: string): Promise<void> => {
    if (selected && selected.length > 0) {
      await bulkUpdate(
        'content',
        selected,
        selected.map((id) => ({ id, [field]: value }))
      );
      setSelected([]);
      fetchItems();
    }
  };

  // Undo/redo
  // const pushUndo = (): void => { undoStack.current.push([...items]); if (undoStack.current.length > 20) undoStack.current.shift(); };
  const handleUndo = (): void => {
    if (undoStack.current.length) {
      redoStack.current.push([...items]);
      const prev = undoStack.current.pop();
      if (prev) setItems(prev);
    }
  };
  const handleRedo = (): void => {
    if (redoStack.current.length) {
      undoStack.current.push([...items]);
      const next = redoStack.current.pop();
      if (next) setItems(next);
    }
  };

  const handleAdd = async (): Promise<void> => {
    let imageUrl = newItem.image;
    if (imageFile) {
      // Simulate upload, replace with real upload logic
      imageUrl = URL.createObjectURL(imageFile);
    }
    const itemWithId = { ...newItem, id: Date.now().toString(), image: imageUrl };
    await apiRequest('/admin/content', {
      method: 'POST',
      body: JSON.stringify(itemWithId),
    });
    setShowAdd(false);
    setNewItem({ id: '', title: '', type: '', body: '', image: '' });
    setImageFile(null);
    fetchItems();
  };

  const handleExport = (): void => {
    exportToCSV(items, 'content.csv');
  };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) return;
    setImporting(true);
    const data = (await importFromCSV(e.target.files[0])) as ContentItem[];
    await bulkUpdate(
      'content',
      data.map((i: ContentItem) => i.id),
      data
    );
    setImporting(false);
    fetchItems();
  };

  return (
    <Box>
      <Typography variant="h5">{'Content Management'}</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {getHelp('content') || 'Manage news, announcements, and patch notes.'}
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        {canEdit(role) && (
          <Button
            onClick={() => {
              setShowAdd(true);
            }}
            variant="contained"
            sx={{ mr: 1 }}
          >
            {'Add Content'}
          </Button>
        )}
        {canDelete(role) && (
          <Button
            onClick={() => {
              void handleArchive();
            }}
            disabled={!selected.length}
            color="warning"
            variant="outlined"
            sx={{ mr: 1 }}
          >
            {'Archive Selected'}
          </Button>
        )}
        {canEdit(role) && (
          <Button
            onClick={() => {
              void handleDuplicate();
            }}
            disabled={!selected.length}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            {'Duplicate Selected'}
          </Button>
        )}
        {canEdit(role) && (
          <Button
            onClick={() => {
              const type =
                (typeof globalThis.prompt === 'function'
                  ? globalThis.prompt('Set type for all selected:')
                  : '') ?? '';
              if (type.length > 0) void handleBulkEdit('type', type);
            }}
            disabled={!selected.length}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            {'Bulk Edit Type'}
          </Button>
        )}
        {(() => {
          const canUndo = undoStack.current.length > 0;
          return (
            <Button
              onClick={() => {
                handleUndo();
              }}
              disabled={!canUndo}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              {'Undo'}
            </Button>
          );
        })()}
        {(() => {
          const canRedo = redoStack.current.length > 0;
          return (
            <Button
              onClick={() => {
                handleRedo();
              }}
              disabled={!canRedo}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              {'Redo'}
            </Button>
          );
        })()}
        <Button onClick={handleExport} variant="outlined" sx={{ mr: 1 }}>
          {'Export'}
        </Button>
        <Button variant="outlined" component="label">
          {'Import'}
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => {
              void handleImport(e);
            }}
            disabled={importing}
          />
        </Button>
      </Box>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            alignItems="flex-start"
            secondaryAction={
              <>
                {editingId === item.id ? (
                  <>
                    <Button
                      onClick={() => {
                        void handleEditSave(item.id);
                      }}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      {'Save'}
                    </Button>
                    <Button onClick={handleEditCancel} color="inherit" size="small">
                      {'Cancel'}
                    </Button>
                  </>
                ) : (
                  <>
                    {canEdit(role) && (
                      <Button
                        onClick={() => {
                          handleEditInit(item);
                        }}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        {'Edit'}
                      </Button>
                    )}
                    {canDelete(role) && (
                      <IconButton
                        onClick={() => {
                          void handleArchive(item.id);
                        }}
                        color="warning"
                      >
                        {'🗑️'}
                      </IconButton>
                    )}
                  </>
                )}
              </>
            }
          >
            <Checkbox
              checked={selected.includes(item.id)}
              onChange={() => {
                handleSelect(item.id);
              }}
            />
            {editingId === item.id ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  label="Title"
                  value={editItem.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEditItem((i) => ({ ...i, title: e.target.value }));
                  }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Type"
                  value={editItem.type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEditItem((i) => ({ ...i, type: e.target.value }));
                  }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2">Body</Typography>
                {/* Lint: Body label */}
                <Typography variant="subtitle2">{'Body'}</Typography>
                <ReactQuill
                  value={editItem.body}
                  onChange={(val: string) => {
                    setEditItem((i) => ({ ...i, body: val }));
                  }}
                  theme="snow"
                  style={{ minHeight: 80, marginBottom: 8 }}
                />
                <Box
                  sx={{
                    my: 2,
                    p: 2,
                    border: '1px solid #eee',
                    borderRadius: 2,
                    background: '#fafbfc',
                  }}
                >
                  <Typography variant="subtitle2">Live Preview</Typography>
                  {/* Lint: Live Preview label */}
                  <Typography variant="subtitle2">{'Live Preview'}</Typography>
                  <Typography variant="h6">{editItem.title}</Typography>
                  <Typography variant="caption">Type: {editItem.type}</Typography>
                  {/* Lint: Type label */}
                  <Typography variant="caption">{`Type: ${editItem.type}`}</Typography>
                  <div dangerouslySetInnerHTML={{ __html: editItem.body }} />
                </Box>
              </Box>
            ) : (
              <ListItemText
                primary={item.title}
                secondary={
                  <>
                    <Typography variant="caption">Type: {item.type}</Typography>
                    {/* Lint: Type label */}
                    <Typography variant="caption">{`Type: ${item.type}`}</Typography>
                    <div dangerouslySetInnerHTML={{ __html: item.body }} />
                  </>
                }
              />
            )}
            {typeof item.image === 'string' && item.image.length > 0 && (
              <img
                src={item.image}
                alt="content"
                className="content-image"
              />
            )}
          </ListItem>
        ))}
      </List>
      <Dialog
        open={showAdd}
        onClose={() => {
          setShowAdd(false);
        }}
      >
        <DialogTitle>{'Add Content'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newItem.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewItem((i) => ({ ...i, title: e.target.value }));
            }}
          />
          <TextField
            label="Type"
            fullWidth
            margin="normal"
            value={newItem.type}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewItem((i) => ({ ...i, type: e.target.value }));
            }}
          />
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">{'Body'}</Typography>
            <ReactQuill
              value={newItem.body}
              onChange={(val: string) => {
                setNewItem((i) => ({ ...i, body: val }));
              }}
              theme="snow"
            />
          </Box>
          <Box
            className={styles.livePreview}
          >
            <Typography variant="subtitle2">{'Live Preview'}</Typography>
            <Typography variant="h6">{newItem.title}</Typography>
            <Typography variant="caption">{`Type: ${newItem.type}`}</Typography>
            <div dangerouslySetInnerHTML={{ __html: newItem.body }} />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className={styles.contentImagePreview}
              />
            )}
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">{'Image'}</Typography>
            <Dropzone
              onDrop={(acceptedFiles: File[]) => {
                setImageFile(acceptedFiles[0]);
              }}
              multiple={false}
              accept={{ 'image/*': [] }}
            >
              {(state) => {
                const { getRootProps, getInputProps } = state;
                return (
                  <div
                    {...getRootProps()}
                    className={styles.dropzone}
                  >
                    <input {...getInputProps()} />
                    {imageFile ? (
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="preview"
                        className={styles.contentImagePreview}
                      />
                    ) : (
                      <span>{'Drag & drop or click to select image'}</span>
                    )}
                  </div>
                );
              }}
            </Dropzone>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAdd(false);
            }}
          >
            {'Cancel'}
          </Button>
          <Button
            onClick={() => {
              void handleAdd();
            }}
            variant="contained"
          >
            {'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Content;
