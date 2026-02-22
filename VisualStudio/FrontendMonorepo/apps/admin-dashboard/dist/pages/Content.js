"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/// <reference types="react-quill-css" />
const react_1 = require("react");
const material_1 = require("@mui/material");
const react_dropzone_1 = __importDefault(require("react-dropzone"));
const react_quill_1 = __importDefault(require("react-quill"));
require("react-quill/dist/quill.snow.css");
const api_1 = require("../api");
const bulkActions_1 = require("../utils/bulkActions");
const importExport_1 = require("../utils/importExport");
const rbac_1 = require("../utils/rbac");
const help_1 = require("../utils/help");
const Content = () => {
    const [items, setItems] = (0, react_1.useState)([]);
    // Undo/redo stacks
    const undoStack = (0, react_1.useRef)([]);
    const redoStack = (0, react_1.useRef)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newItem, setNewItem] = (0, react_1.useState)({
        id: '',
        title: '',
        type: '',
        body: '',
        image: '',
    });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editItem, setEditItem] = (0, react_1.useState)({
        title: '',
        type: '',
        body: '',
    });
    const handleEditInit = (item) => {
        setEditingId(item.id);
        setEditItem({ title: item.title, type: item.type, body: item.body });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditItem({ title: '', type: '', body: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/content/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editItem),
        });
        setEditingId(null);
        setEditItem({ title: '', type: '', body: '' });
        fetchItems();
    };
    const fetchItems = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/content')
            .then((data) => {
            setItems(data);
            // Clear undo/redo on fresh fetch
            undoStack.current = [];
            redoStack.current = [];
        })
            .catch((e) => {
            if (typeof e === 'object' &&
                e !== null &&
                'message' in e &&
                typeof e.message === 'string' &&
                e.message &&
                e.message.length > 0) {
                setError(e.message);
            }
            else {
                setError('Failed to load content');
            }
        })
            .finally(() => {
            setLoading(false);
        });
    };
    (0, react_1.useEffect)(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSelect = (id) => {
        setSelected((sel) => (sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id]));
    };
    // Archive instead of delete (soft delete)
    const handleArchive = async (id) => {
        if (typeof id === 'string' && id.length > 0) {
            await (0, api_1.apiRequest)(`/admin/content/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ archived: true }),
            });
        }
        else if (selected.length > 0) {
            await (0, bulkActions_1.bulkUpdate)('content', selected, selected.map((id) => ({ id, archived: true })));
            setSelected([]);
        }
        fetchItems();
    };
    // Duplicate selected items
    const handleDuplicate = async () => {
        for (const id of selected) {
            const orig = items.find((i) => i.id === id);
            if (orig) {
                const copy = { ...orig, id: undefined, title: orig.title + ' (copy)' };
                await (0, api_1.apiRequest)('/admin/content', { method: 'POST', body: JSON.stringify(copy) });
            }
        }
        setSelected([]);
        fetchItems();
    };
    // Bulk edit: set type for all selected
    const handleBulkEdit = async (field, value) => {
        if (selected && selected.length > 0) {
            await (0, bulkActions_1.bulkUpdate)('content', selected, selected.map((id) => ({ id, [field]: value })));
            setSelected([]);
            fetchItems();
        }
    };
    // Undo/redo
    // const pushUndo = (): void => { undoStack.current.push([...items]); if (undoStack.current.length > 20) undoStack.current.shift(); };
    const handleUndo = () => {
        if (undoStack.current.length) {
            redoStack.current.push([...items]);
            const prev = undoStack.current.pop();
            if (prev)
                setItems(prev);
        }
    };
    const handleRedo = () => {
        if (redoStack.current.length) {
            undoStack.current.push([...items]);
            const next = redoStack.current.pop();
            if (next)
                setItems(next);
        }
    };
    const handleAdd = async () => {
        let imageUrl = newItem.image;
        if (imageFile) {
            // Simulate upload, replace with real upload logic
            imageUrl = URL.createObjectURL(imageFile);
        }
        const itemWithId = { ...newItem, id: Date.now().toString(), image: imageUrl };
        await (0, api_1.apiRequest)('/admin/content', {
            method: 'POST',
            body: JSON.stringify(itemWithId),
        });
        setShowAdd(false);
        setNewItem({ id: '', title: '', type: '', body: '', image: '' });
        setImageFile(null);
        fetchItems();
    };
    const handleExport = () => {
        (0, importExport_1.exportToCSV)(items, 'content.csv');
    };
    const handleImport = async (e) => {
        if (!e.target.files || e.target.files.length === 0)
            return;
        setImporting(true);
        const data = (await (0, importExport_1.importFromCSV)(e.target.files[0]));
        await (0, bulkActions_1.bulkUpdate)('content', data.map((i) => i.id), data);
        setImporting(false);
        fetchItems();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: 'Content Management' }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('content') || 'Manage news, announcements, and patch notes.' }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                            setShowAdd(true);
                        }, variant: "contained", sx: { mr: 1 }, children: 'Add Content' })), (0, rbac_1.canDelete)(role) && ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                            void handleArchive();
                        }, disabled: !selected.length, color: "warning", variant: "outlined", sx: { mr: 1 }, children: 'Archive Selected' })), (0, rbac_1.canEdit)(role) && ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                            void handleDuplicate();
                        }, disabled: !selected.length, variant: "outlined", sx: { mr: 1 }, children: 'Duplicate Selected' })), (0, rbac_1.canEdit)(role) && ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                            const type = (typeof globalThis.prompt === 'function'
                                ? globalThis.prompt('Set type for all selected:')
                                : '') ?? '';
                            if (type.length > 0)
                                void handleBulkEdit('type', type);
                        }, disabled: !selected.length, variant: "outlined", sx: { mr: 1 }, children: 'Bulk Edit Type' })), (() => {
                        const canUndo = undoStack.current.length > 0;
                        return ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                                handleUndo();
                            }, disabled: !canUndo, variant: "outlined", sx: { mr: 1 }, children: 'Undo' }));
                    })(), (() => {
                        const canRedo = redoStack.current.length > 0;
                        return ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                                handleRedo();
                            }, disabled: !canRedo, variant: "outlined", sx: { mr: 1 }, children: 'Redo' }));
                    })(), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: 'Export' }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ['Import', (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: (e) => {
                                    void handleImport(e);
                                }, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: items.map((item) => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === item.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                                        void handleEditSave(item.id);
                                    }, color: "primary", size: "small", sx: { mr: 1 }, children: 'Save' }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: 'Cancel' })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                                        handleEditInit(item);
                                    }, size: "small", sx: { mr: 1 }, children: 'Edit' })), (0, rbac_1.canDelete)(role) && ((0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => {
                                        void handleArchive(item.id);
                                    }, color: "warning", children: '🗑️' }))] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(item.id), onChange: () => {
                                handleSelect(item.id);
                            } }), editingId === item.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Title", value: editItem.title, onChange: (e) => {
                                        setEditItem((i) => ({ ...i, title: e.target.value }));
                                    }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Type", value: editItem.type, onChange: (e) => {
                                        setEditItem((i) => ({ ...i, type: e.target.value }));
                                    }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Body" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: 'Body' }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: editItem.body, onChange: (val) => {
                                        setEditItem((i) => ({ ...i, body: val }));
                                    }, theme: "snow", style: { minHeight: 80, marginBottom: 8 } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                                        my: 2,
                                        p: 2,
                                        border: '1px solid #eee',
                                        borderRadius: 2,
                                        background: '#fafbfc',
                                    }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Live Preview" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: 'Live Preview' }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: editItem.title }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Type: ", editItem.type] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", children: `Type: ${editItem.type}` }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: editItem.body } })] })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: item.title, secondary: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Type: ", item.type] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", children: `Type: ${item.type}` }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: item.body } })] }) })), typeof item.image === 'string' && item.image.length > 0 && ((0, jsx_runtime_1.jsx)("img", { src: item.image, alt: "content", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } }))] }, item.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => {
                    setShowAdd(false);
                }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: 'Add Content' }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Title", fullWidth: true, margin: "normal", value: newItem.title, onChange: (e) => {
                                    setNewItem((i) => ({ ...i, title: e.target.value }));
                                } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Type", fullWidth: true, margin: "normal", value: newItem.type, onChange: (e) => {
                                    setNewItem((i) => ({ ...i, type: e.target.value }));
                                } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: 'Body' }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newItem.body, onChange: (val) => {
                                            setNewItem((i) => ({ ...i, body: val }));
                                        }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: 'Live Preview' }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: newItem.title }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", children: `Type: ${newItem.type}` }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: newItem.body } }), imageFile && ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80, marginTop: 8 } }))] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: 'Image' }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: (acceptedFiles) => {
                                            setImageFile(acceptedFiles[0]);
                                        }, multiple: false, accept: { 'image/*': [] }, children: (state) => {
                                            const { getRootProps, getInputProps } = state;
                                            return ((0, jsx_runtime_1.jsxs)("div", { ...getRootProps(), style: {
                                                    border: '2px dashed #888',
                                                    padding: 16,
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    background: '#fafafa',
                                                }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: 'Drag & drop or click to select image' }))] }));
                                        } })] })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                                    setShowAdd(false);
                                }, children: 'Cancel' }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => {
                                    void handleAdd();
                                }, variant: "contained", children: 'Add' })] })] })] }));
};
exports.default = Content;
