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
const VIP = () => {
    const [tiers, setTiers] = (0, react_1.useState)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newTier, setNewTier] = (0, react_1.useState)({ name: '', perks: '', price: '', description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editTier, setEditTier] = (0, react_1.useState)({ name: '', perks: '', price: '', description: '' });
    const handleEditInit = (tier) => {
        setEditingId(tier.id);
        setEditTier({ name: tier.name, perks: tier.perks, price: tier.price, description: tier.description });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditTier({ name: '', perks: '', price: '', description: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/vip/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editTier),
        });
        setEditingId(null);
        setEditTier({ name: '', perks: '', price: '', description: '' });
        fetchTiers();
    };
    const fetchTiers = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/vip')
            .then(setTiers)
            .catch(e => { setError(e.message || 'Failed to load VIP tiers'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchTiers();
    }, []);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    const handleDelete = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/vip/${id}`, { method: 'DELETE' });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkDelete)('vip', selected);
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
        await (0, api_1.apiRequest)('/admin/vip', {
            method: 'POST',
            body: JSON.stringify({ ...newTier, image: imageUrl }),
        });
        setShowAdd(false);
        setNewTier({ name: '', perks: '', price: '', description: '', image: '' });
        setImageFile(null);
        fetchTiers();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(tiers, 'vip.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('vip', data.map((t) => t.id), data);
        setImporting(false);
        fetchTiers();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "VIP/Subscription Management" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('vip') || 'Manage VIP tiers, perks, and pricing.' }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add Tier" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleDelete(), disabled: !selected.length, color: "error", variant: "outlined", sx: { mr: 1 }, children: "Delete Selected" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: tiers.map(tier => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === tier.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(tier.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(tier); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleDelete(tier.id), color: "error", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(tier.id), onChange: () => { handleSelect(tier.id); } }), editingId === tier.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", value: editTier.name, onChange: (e) => { setEditTier(t => ({ ...t, name: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Perks", value: editTier.perks, onChange: (e) => { setEditTier(t => ({ ...t, perks: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Price", value: editTier.price, onChange: (e) => { setEditTier(t => ({ ...t, price: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: editTier.description, onChange: (val) => { setEditTier(t => ({ ...t, description: val })); }, theme: "snow", style: { minHeight: 80, marginBottom: 8 } })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: tier.name, secondary: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Perks: ", tier.perks, " | Price: ", tier.price] }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: tier.description } })] }) })), tier.image && (0, jsx_runtime_1.jsx)("img", { src: tier.image, alt: "vip", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, tier.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add VIP Tier" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", fullWidth: true, margin: "normal", value: newTier.name, onChange: e => { setNewTier(t => ({ ...t, name: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Perks", fullWidth: true, margin: "normal", value: newTier.perks, onChange: e => { setNewTier(t => ({ ...t, perks: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Price", fullWidth: true, margin: "normal", value: newTier.price, onChange: e => { setNewTier(t => ({ ...t, price: e.target.value })); } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newTier.description, onChange: val => { setNewTier(i => ({ ...i, description: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Image" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)("div", { ...getRootProps(), style: { border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select image" }))] })) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
};
exports.default = VIP;
