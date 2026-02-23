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
const Currencies = () => {
    const [currencies, setCurrencies] = (0, react_1.useState)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newCurrency, setNewCurrency] = (0, react_1.useState)({ name: '', symbol: '', rate: '', description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editCurrency, setEditCurrency] = (0, react_1.useState)({ name: '', symbol: '', rate: '', description: '' });
    const handleEditInit = (currency) => {
        setEditingId(currency.id);
        setEditCurrency({ name: currency.name, symbol: currency.symbol, rate: currency.rate, description: currency.description });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditCurrency({ name: '', symbol: '', rate: '', description: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/currencies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editCurrency),
        });
        setEditingId(null);
        setEditCurrency({ name: '', symbol: '', rate: '', description: '' });
        fetchCurrencies();
    };
    const fetchCurrencies = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/currencies')
            .then(setCurrencies)
            .catch(e => { setError(e.message || 'Failed to load currencies'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchCurrencies();
    }, []);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    const handleDelete = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/currencies/${id}`, { method: 'DELETE' });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkDelete)('currencies', selected);
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
        await (0, api_1.apiRequest)('/admin/currencies', {
            method: 'POST',
            body: JSON.stringify({ ...newCurrency, image: imageUrl }),
        });
        setShowAdd(false);
        setNewCurrency({ name: '', symbol: '', rate: '', description: '', image: '' });
        setImageFile(null);
        fetchCurrencies();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(currencies, 'currencies.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('currencies', data.map((c) => c.id), data);
        setImporting(false);
        fetchCurrencies();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Currency Management" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('currencies') || 'Manage in-game currencies, exchange rates, and rewards.' }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add Currency" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleDelete(), disabled: !selected.length, color: "error", variant: "outlined", sx: { mr: 1 }, children: "Delete Selected" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: currencies.map(currency => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === currency.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(currency.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(currency); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleDelete(currency.id), color: "error", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(currency.id), onChange: () => { handleSelect(currency.id); } }), editingId === currency.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", value: editCurrency.name, onChange: (e) => { setEditCurrency(c => ({ ...c, name: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Symbol", value: editCurrency.symbol, onChange: (e) => { setEditCurrency(c => ({ ...c, symbol: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Rate", value: editCurrency.rate, onChange: (e) => { setEditCurrency(c => ({ ...c, rate: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: editCurrency.description, onChange: (val) => { setEditCurrency(c => ({ ...c, description: val })); }, theme: "snow", style: { minHeight: 80, marginBottom: 8 } })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: currency.name, secondary: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Symbol: ", currency.symbol, " | Rate: ", currency.rate] }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: currency.description } })] }) })), currency.image && (0, jsx_runtime_1.jsx)("img", { src: currency.image, alt: "currency", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, currency.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add Currency" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", fullWidth: true, margin: "normal", value: newCurrency.name, onChange: e => { setNewCurrency(c => ({ ...c, name: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Symbol", fullWidth: true, margin: "normal", value: newCurrency.symbol, onChange: e => { setNewCurrency(c => ({ ...c, symbol: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Rate", fullWidth: true, margin: "normal", value: newCurrency.rate, onChange: e => { setNewCurrency(c => ({ ...c, rate: e.target.value })); } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newCurrency.description, onChange: val => { setNewCurrency(i => ({ ...i, description: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Image" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)("div", { ...getRootProps(), style: { border: '2px dashed #888', padding: 16, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select image" }))] })) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
};
exports.default = Currencies;
