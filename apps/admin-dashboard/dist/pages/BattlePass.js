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
const BattlePass = () => {
    const [passes, setPasses] = (0, react_1.useState)([]);
    // Undo/redo stacks
    const undoStack = (0, react_1.useRef)([]);
    const redoStack = (0, react_1.useRef)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newPass, setNewPass] = (0, react_1.useState)({ name: '', season: '', rewards: '', description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editPass, setEditPass] = (0, react_1.useState)({ name: '', season: '', rewards: '' });
    const handleEditInit = (pass) => {
        setEditingId(pass.id);
        setEditPass({ name: pass.name, season: pass.season, rewards: pass.rewards });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditPass({ name: '', season: '', rewards: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/battlepass/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editPass),
        });
        setEditingId(null);
        setEditPass({ name: '', season: '', rewards: '' });
        fetchPasses();
    };
    const fetchPasses = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/battlepass')
            .then(data => {
            setPasses(data);
            // Clear undo/redo on fresh fetch
            undoStack.current = [];
            redoStack.current = [];
        })
            .catch(e => { setError(e.message || 'Failed to load battle passes'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchPasses();
    }, []);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    // Archive instead of delete (soft delete)
    const handleArchive = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/battlepass/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkUpdate)('battlepass', selected, selected.map(id => ({ id, archived: true })));
            setSelected([]);
        }
        fetchPasses();
    };
    // Duplicate selected passes
    const handleDuplicate = async () => {
        for (const id of selected) {
            const orig = passes.find((p) => p.id === id);
            if (orig) {
                const copy = { ...orig, id: undefined, name: orig.name + ' (copy)' };
                await (0, api_1.apiRequest)('/admin/battlepass', { method: 'POST', body: JSON.stringify(copy) });
            }
        }
        setSelected([]);
        fetchPasses();
    };
    // Bulk edit: set season for all selected
    const handleBulkEdit = async (field, value) => {
        await (0, bulkActions_1.bulkUpdate)('battlepass', selected, selected.map(id => ({ id, [field]: value })));
        setSelected([]);
        fetchPasses();
    };
    // Undo/redo
    const pushUndo = () => { undoStack.current.push([...passes]); if (undoStack.current.length > 20)
        undoStack.current.shift(); };
    const handleUndo = () => {
        if (undoStack.current.length) {
            redoStack.current.push([...passes]);
            setPasses(undoStack.current.pop());
        }
    };
    const handleRedo = () => {
        if (redoStack.current.length) {
            undoStack.current.push([...passes]);
            setPasses(redoStack.current.pop());
        }
    };
    const handleAdd = async () => {
        let imageUrl = newPass.image;
        if (imageFile) {
            // Simulate upload, replace with real upload logic
            imageUrl = URL.createObjectURL(imageFile);
        }
        await (0, api_1.apiRequest)('/admin/battlepass', {
            method: 'POST',
            body: JSON.stringify({ ...newPass, image: imageUrl }),
        });
        setShowAdd(false);
        setNewPass({ name: '', season: '', rewards: '', description: '', image: '' });
        setImageFile(null);
        fetchPasses();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(passes, 'battlepass.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('battlepass', data.map((p) => p.id), data);
        setImporting(false);
        fetchPasses();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Battle Pass Management" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('battlepass') || 'Manage battle passes, seasons, and rewards.' }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add Pass" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleArchive(), disabled: !selected.length, color: "warning", variant: "outlined", sx: { mr: 1 }, children: "Archive Selected" }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleDuplicate, disabled: !selected.length, variant: "outlined", sx: { mr: 1 }, children: "Duplicate Selected" }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleBulkEdit('season', prompt('Set season for all selected:') || ''), disabled: !selected.length, variant: "outlined", sx: { mr: 1 }, children: "Bulk Edit Season" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleUndo, disabled: !undoStack.current.length, variant: "outlined", sx: { mr: 1 }, children: "Undo" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleRedo, disabled: !redoStack.current.length, variant: "outlined", sx: { mr: 1 }, children: "Redo" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: passes.map(pass => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === pass.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(pass.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(pass); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleArchive(pass.id), color: "warning", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(pass.id), onChange: () => { handleSelect(pass.id); } }), editingId === pass.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", value: editPass.name, onChange: (e) => { setEditPass(i => ({ ...i, name: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Season", value: editPass.season, onChange: (e) => { setEditPass(i => ({ ...i, season: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Rewards", value: editPass.rewards, onChange: (e) => { setEditPass(i => ({ ...i, rewards: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Live Preview" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: editPass.name }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Season: ", editPass.season] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", children: ["Rewards: ", editPass.rewards] })] })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: pass.name, secondary: `Season: ${pass.season} | Rewards: ${pass.rewards}` })), pass.image && (0, jsx_runtime_1.jsx)("img", { src: pass.image, alt: "battlepass", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, pass.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add Battle Pass" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", fullWidth: true, margin: "normal", value: newPass.name, onChange: e => { setNewPass(p => ({ ...p, name: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Season", fullWidth: true, margin: "normal", value: newPass.season, onChange: e => { setNewPass(p => ({ ...p, season: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Rewards", fullWidth: true, margin: "normal", value: newPass.rewards, onChange: e => { setNewPass(p => ({ ...p, rewards: e.target.value })); } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newPass.description, onChange: val => { setNewPass(i => ({ ...i, description: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2, p: 2, border: '1px solid #eee', borderRadius: 2, background: '#fafbfc' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Live Preview" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: newPass.name }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Season: ", newPass.season] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", children: ["Rewards: ", newPass.rewards] }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: newPass.description } }), imageFile && (0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80, marginTop: 8 } })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Image" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)("div", { ...getRootProps(), style: { border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select image" }))] })) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
};
exports.default = BattlePass;
