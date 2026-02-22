"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
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
const Cosmetics = () => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newItem, setNewItem] = (0, react_1.useState)({ name: '', type: '', rarity: '', description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editItem, setEditItem] = (0, react_1.useState)({ name: '', type: '', rarity: '', description: '' });
    const handleEditInit = (item) => {
        setEditingId(item.id);
        setEditItem({ name: item.name, type: item.type, rarity: item.rarity, description: item.description });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditItem({ name: '', type: '', rarity: '', description: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/cosmetics/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editItem),
        });
        setEditingId(null);
        setEditItem({ name: '', type: '', rarity: '', description: '' });
        fetchItems();
    };
    const fetchItems = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/cosmetics')
            .then(setItems)
            .catch(e => { setError(e.message || 'Failed to load cosmetics'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchItems();
    }, []);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    const handleDelete = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/cosmetics/${id}`, { method: 'DELETE' });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkDelete)('cosmetics', selected);
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
        await (0, api_1.apiRequest)('/admin/cosmetics', {
            method: 'POST',
            body: JSON.stringify({ ...newItem, image: imageUrl }),
        });
        setShowAdd(false);
        setNewItem({ name: '', type: '', rarity: '', description: '', image: '' });
        setImageFile(null);
        fetchItems();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(items, 'cosmetics.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('cosmetics', data.map((i) => i.id), data);
        setImporting(false);
        fetchItems();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Cosmetics Management" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('cosmetics') || 'Manage in-game cosmetics, skins, and items.' }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add Cosmetic" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleDelete(), disabled: !selected.length, color: "error", variant: "outlined", sx: { mr: 1 }, children: "Delete Selected" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: items.map(item => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === item.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(item.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(item); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleDelete(item.id), color: "error", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(item.id), onChange: () => { handleSelect(item.id); } }), editingId === item.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", value: editItem.name, onChange: (e) => { setEditItem(i => ({ ...i, name: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Type", value: editItem.type, onChange: (e) => { setEditItem(i => ({ ...i, type: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Rarity", value: editItem.rarity, onChange: (e) => { setEditItem(i => ({ ...i, rarity: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: editItem.description, onChange: (val) => { setEditItem(i => ({ ...i, description: val })); }, theme: "snow", style: { minHeight: 80, marginBottom: 8 } })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: item.name, secondary: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Type: ", item.type, " | Rarity: ", item.rarity] }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: item.description } })] }) })), item.image && (0, jsx_runtime_1.jsx)("img", { src: item.image, alt: "cosmetic", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, item.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add Cosmetic" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", fullWidth: true, margin: "normal", value: newItem.name, onChange: e => { setNewItem(i => ({ ...i, name: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Type", fullWidth: true, margin: "normal", value: newItem.type, onChange: e => { setNewItem(i => ({ ...i, type: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Rarity", fullWidth: true, margin: "normal", value: newItem.rarity, onChange: e => { setNewItem(i => ({ ...i, rarity: e.target.value })); } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newItem.description, onChange: val => { setNewItem(i => ({ ...i, description: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Image" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { ...getRootProps(), sx: { border: '2px dashed #888', p: 2, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select image" }))] })) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
};
exports.default = Cosmetics;
