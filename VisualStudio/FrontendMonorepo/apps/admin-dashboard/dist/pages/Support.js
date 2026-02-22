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
const Support = () => {
    const [tickets, setTickets] = (0, react_1.useState)([]);
    // Undo/redo stacks
    const undoStack = (0, react_1.useRef)([]);
    const redoStack = (0, react_1.useRef)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newTicket, setNewTicket] = (0, react_1.useState)({ subject: '', user: '', status: '', description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editTicket, setEditTicket] = (0, react_1.useState)({ subject: '', user: '', status: '' });
    const handleEditInit = (ticket) => {
        setEditingId(ticket.id);
        setEditTicket({ subject: ticket.subject, user: ticket.user, status: ticket.status });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditTicket({ subject: '', user: '', status: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/support/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editTicket),
        });
        setEditingId(null);
        setEditTicket({ subject: '', user: '', status: '' });
        fetchTickets();
    };
    const fetchTickets = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/support')
            .then(data => {
            setTickets(data);
            // Clear undo/redo on fresh fetch
            undoStack.current = [];
            redoStack.current = [];
        })
            .catch(e => { setError(e.message || 'Failed to load tickets'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchTickets();
    }, []);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    // Archive instead of delete (soft delete)
    const handleArchive = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/support/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkUpdate)('support', selected, selected.map(id => ({ id, archived: true })));
            setSelected([]);
        }
        fetchTickets();
    };
    // Duplicate selected tickets
    const handleDuplicate = async () => {
        for (const id of selected) {
            const orig = tickets.find((t) => t.id === id);
            if (orig) {
                const copy = { ...orig, id: undefined, subject: orig.subject + ' (copy)' };
                await (0, api_1.apiRequest)('/admin/support', { method: 'POST', body: JSON.stringify(copy) });
            }
        }
        setSelected([]);
        fetchTickets();
    };
    // Bulk edit: set status for all selected
    const handleBulkEdit = async (field, value) => {
        await (0, bulkActions_1.bulkUpdate)('support', selected, selected.map(id => ({ id, [field]: value })));
        setSelected([]);
        fetchTickets();
    };
    // Undo/redo
    const pushUndo = () => { undoStack.current.push([...tickets]); if (undoStack.current.length > 20)
        undoStack.current.shift(); };
    const handleUndo = () => {
        if (undoStack.current.length) {
            redoStack.current.push([...tickets]);
            setTickets(undoStack.current.pop());
        }
    };
    const handleRedo = () => {
        if (redoStack.current.length) {
            undoStack.current.push([...tickets]);
            setTickets(redoStack.current.pop());
        }
    };
    const handleAdd = async () => {
        let imageUrl = newTicket.image;
        if (imageFile) {
            // Simulate upload, replace with real upload logic
            imageUrl = URL.createObjectURL(imageFile);
        }
        await (0, api_1.apiRequest)('/admin/support', {
            method: 'POST',
            body: JSON.stringify({ ...newTicket, image: imageUrl }),
        });
        setShowAdd(false);
        setNewTicket({ subject: '', user: '', status: '', description: '', image: '' });
        setImageFile(null);
        fetchTickets();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(tickets, 'support.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('support', data.map((t) => t.id), data);
        setImporting(false);
        fetchTickets();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Support/Ticket Management" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('support') || 'Manage player support tickets and moderation.' }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add Ticket" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleArchive(), disabled: !selected.length, color: "warning", variant: "outlined", sx: { mr: 1 }, children: "Archive Selected" }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleDuplicate, disabled: !selected.length, variant: "outlined", sx: { mr: 1 }, children: "Duplicate Selected" }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleBulkEdit('status', prompt('Set status for all selected:') || ''), disabled: !selected.length, variant: "outlined", sx: { mr: 1 }, children: "Bulk Edit Status" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleUndo, disabled: !undoStack.current.length, variant: "outlined", sx: { mr: 1 }, children: "Undo" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleRedo, disabled: !redoStack.current.length, variant: "outlined", sx: { mr: 1 }, children: "Redo" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: tickets.map(ticket => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === ticket.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(ticket.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(ticket); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleArchive(ticket.id), color: "warning", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(ticket.id), onChange: () => { handleSelect(ticket.id); } }), editingId === ticket.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Subject", value: editTicket.subject, onChange: (e) => { setEditTicket(i => ({ ...i, subject: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "User", value: editTicket.user, onChange: (e) => { setEditTicket(i => ({ ...i, user: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Status", value: editTicket.status, onChange: (e) => { setEditTicket(i => ({ ...i, status: e.target.value })); }, size: "small", sx: { mb: 1 } })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: ticket.subject, secondary: `User: ${ticket.user} | Status: ${ticket.status}` })), ticket.image && (0, jsx_runtime_1.jsx)("img", { src: ticket.image, alt: "ticket", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, ticket.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add Ticket" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Subject", fullWidth: true, margin: "normal", value: newTicket.subject, onChange: e => { setNewTicket(t => ({ ...t, subject: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "User", fullWidth: true, margin: "normal", value: newTicket.user, onChange: e => { setNewTicket(t => ({ ...t, user: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Status", fullWidth: true, margin: "normal", value: newTicket.status, onChange: e => { setNewTicket(t => ({ ...t, status: e.target.value })); } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newTicket.description, onChange: val => { setNewTicket(t => ({ ...t, description: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Image" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)("div", { ...getRootProps(), style: { border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select image" }))] })) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
};
exports.default = Support;
