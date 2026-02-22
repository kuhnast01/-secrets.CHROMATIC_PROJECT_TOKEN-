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
const rbac_1 = require("../utils/rbac");
const help_1 = require("../utils/help");
const importExport_1 = require("../utils/importExport");
const bulkActions_1 = require("../utils/bulkActions");
const NotificationCenter = () => {
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    // Undo/redo stacks
    const undoStack = (0, react_1.useRef)([]);
    const redoStack = (0, react_1.useRef)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newNotification, setNewNotification] = (0, react_1.useState)({ title: '', message: '', type: '', description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editNotification, setEditNotification] = (0, react_1.useState)({ title: '', message: '', type: '' });
    const handleEditInit = (notification) => {
        setEditingId(notification.id);
        setEditNotification({ title: notification.title, message: notification.message, type: notification.type });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditNotification({ title: '', message: '', type: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/notifications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editNotification),
        });
        setEditingId(null);
        setEditNotification({ title: '', message: '', type: '' });
        fetchNotifications();
    };
    const fetchNotifications = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/notifications')
            .then(data => {
            setNotifications(data);
            // Clear undo/redo on fresh fetch
            undoStack.current = [];
            redoStack.current = [];
        })
            .catch(e => { setError(e.message || 'Failed to load notifications'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchNotifications();
    }, []);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    // Archive instead of delete (soft delete)
    const handleArchive = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/notifications/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkUpdate)('notifications', selected, selected.map(id => ({ id, archived: true })));
            setSelected([]);
        }
        fetchNotifications();
    };
    // Duplicate selected notifications
    const handleDuplicate = async () => {
        for (const id of selected) {
            const orig = notifications.find((n) => n.id === id);
            if (orig) {
                const copy = { ...orig, id: undefined, title: orig.title + ' (copy)' };
                await (0, api_1.apiRequest)('/admin/notifications', { method: 'POST', body: JSON.stringify(copy) });
            }
        }
        setSelected([]);
        fetchNotifications();
    };
    // Bulk edit: set type for all selected
    const handleBulkEdit = async (field, value) => {
        await (0, bulkActions_1.bulkUpdate)('notifications', selected, selected.map(id => ({ id, [field]: value })));
        setSelected([]);
        fetchNotifications();
    };
    // Undo/redo
    const pushUndo = () => { undoStack.current.push([...notifications]); if (undoStack.current.length > 20)
        undoStack.current.shift(); };
    const handleUndo = () => {
        if (undoStack.current.length) {
            redoStack.current.push([...notifications]);
            setNotifications(undoStack.current.pop());
        }
    };
    const handleRedo = () => {
        if (redoStack.current.length) {
            undoStack.current.push([...notifications]);
            setNotifications(redoStack.current.pop());
        }
    };
    const handleAdd = async () => {
        let imageUrl = newNotification.image;
        if (imageFile) {
            // Simulate upload, replace with real upload logic
            imageUrl = URL.createObjectURL(imageFile);
        }
        await (0, api_1.apiRequest)('/admin/notifications', {
            method: 'POST',
            body: JSON.stringify({ ...newNotification, image: imageUrl }),
        });
        setShowAdd(false);
        setNewNotification({ title: '', message: '', type: '', description: '', image: '' });
        setImageFile(null);
        fetchNotifications();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(notifications, 'notifications.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('notifications', data.map((n) => n.id), data);
        setImporting(false);
        fetchNotifications();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Notification Center" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('notifications') || 'Manage system and player notifications.' }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add Notification" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleArchive(), disabled: !selected.length, color: "warning", variant: "outlined", sx: { mr: 1 }, children: "Archive Selected" }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleDuplicate, disabled: !selected.length, variant: "outlined", sx: { mr: 1 }, children: "Duplicate Selected" }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleBulkEdit('type', prompt('Set type for all selected:') || ''), disabled: !selected.length, variant: "outlined", sx: { mr: 1 }, children: "Bulk Edit Type" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleUndo, disabled: !undoStack.current.length, variant: "outlined", sx: { mr: 1 }, children: "Undo" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleRedo, disabled: !redoStack.current.length, variant: "outlined", sx: { mr: 1 }, children: "Redo" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: notifications.map(notification => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === notification.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(notification.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(notification); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleArchive(notification.id), color: "warning", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(notification.id), onChange: () => { handleSelect(notification.id); } }), editingId === notification.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Title", value: editNotification.title, onChange: (e) => { setEditNotification(i => ({ ...i, title: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Message", value: editNotification.message, onChange: (e) => { setEditNotification(i => ({ ...i, message: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Type", value: editNotification.type, onChange: (e) => { setEditNotification(i => ({ ...i, type: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Live Preview" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: editNotification.title }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Type: ", editNotification.type] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: editNotification.message })] })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: notification.title, secondary: `Type: ${notification.type} | Message: ${notification.message}` })), notification.image && (0, jsx_runtime_1.jsx)("img", { src: notification.image, alt: "notification", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, notification.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add Notification" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Title", fullWidth: true, margin: "normal", value: newNotification.title, onChange: e => { setNewNotification(n => ({ ...n, title: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Message", fullWidth: true, margin: "normal", value: newNotification.message, onChange: e => { setNewNotification(n => ({ ...n, message: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Type", fullWidth: true, margin: "normal", value: newNotification.type, onChange: e => { setNewNotification(n => ({ ...n, type: e.target.value })); } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newNotification.description, onChange: val => { setNewNotification(n => ({ ...n, description: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Live Preview" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: newNotification.title }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Type: ", newNotification.type] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: newNotification.message }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: newNotification.description } }), imageFile && (0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80, marginTop: 8 } })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Image" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)("div", { ...getRootProps(), style: { border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select image" }))] })) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
};
exports.default = NotificationCenter;
