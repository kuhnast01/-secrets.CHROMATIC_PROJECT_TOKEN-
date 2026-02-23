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
const HelpTooltip_1 = require("../components/HelpTooltip");
const AdminSessionContext_1 = require("../context/AdminSessionContext");
const bulkActions_1 = require("../utils/bulkActions");
const importExport_1 = require("../utils/importExport");
const rbac_1 = require("../utils/rbac");
const help_1 = require("../utils/help");
const core_1 = require("@dnd-kit/core");
const sortable_1 = require("@dnd-kit/sortable");
const utilities_1 = require("@dnd-kit/utilities");
// SortableItem component for drag-and-drop
const SortableItem = ({ item, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = (0, sortable_1.useSortable)({ id: item.id });
    const style = {
        transform: utilities_1.CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    return ((0, jsx_runtime_1.jsx)("div", { ref: setNodeRef, style: style, ...attributes, ...listeners, children: children }));
};
const Shop = () => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [dryRunResult, setDryRunResult] = (0, react_1.useState)(null);
    const [dryRunOpen, setDryRunOpen] = (0, react_1.useState)(false);
    const [auditLog, setAuditLog] = (0, react_1.useState)([]);
    const [auditOpen, setAuditOpen] = (0, react_1.useState)(false);
    const { isAuthenticated } = (0, AdminSessionContext_1.useAdminSession)();
    // Admin dry-run/override example
    const handleDryRun = async () => {
        try {
            const result = await (0, api_1.apiRequest)('/admin/shop/dry-run', { method: 'POST', body: JSON.stringify({ action: 'bulkDelete', ids: selected }) });
            setDryRunResult(result);
            setDryRunOpen(true);
        }
        catch (e) {
            setDryRunResult({ error: e.message });
            setDryRunOpen(true);
        }
    };
    // Audit log summary example
    const handleAuditLog = async () => {
        try {
            const logs = await (0, api_1.apiRequest)('/admin/audit-log?scope=shop');
            setAuditLog(logs);
            setAuditOpen(true);
        }
        catch (e) {
            setAuditLog([{ message: e.message, timestamp: new Date().toISOString() }]);
            setAuditOpen(true);
        }
    };
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [dndItems, setDndItems] = (0, react_1.useState)([]);
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newItem, setNewItem] = (0, react_1.useState)({ name: '', price: '', available: true, description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editItem, setEditItem] = (0, react_1.useState)({ name: '', price: '', available: true, description: '' });
    const handleEditInit = (item) => {
        setEditingId(item.id);
        setEditItem({ name: item.name, price: item.price, available: item.available, description: item.description });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditItem({ name: '', price: '', available: true, description: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/shop/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editItem),
        });
        setEditingId(null);
        setEditItem({ name: '', price: '', available: true, description: '' });
        fetchItems();
    };
    const fetchItems = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/shop')
            .then(setItems)
            .catch(e => { setError(e.message || 'Failed to load shop items'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchItems();
    }, []);
    (0, react_1.useEffect)(() => { setDndItems(items); }, [items]);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    const handleDelete = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/shop/${id}`, { method: 'DELETE' });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkDelete)('shop', selected);
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
        await (0, api_1.apiRequest)('/admin/shop', {
            method: 'POST',
            body: JSON.stringify({ ...newItem, image: imageUrl }),
        });
        setShowAdd(false);
        setNewItem({ name: '', price: '', available: true, description: '', image: '' });
        setImageFile(null);
        fetchItems();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(items, 'shop.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('shop', data.map((i) => i.id), data);
        setImporting(false);
        fetchItems();
    };
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = dndItems.findIndex(i => i.id === active.id);
            const newIndex = dndItems.findIndex(i => i.id === over.id);
            const newItems = (0, sortable_1.arrayMove)(dndItems, oldIndex, newIndex);
            setDndItems(newItems);
            // Optionally, persist new order to backend
        }
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Shop Management" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('shop') }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add Item" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleDelete(), disabled: !selected.length, color: "error", variant: "outlined", sx: { mr: 1 }, children: "Delete Selected" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] }), isAuthenticated && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Button, { onClick: handleDryRun, variant: "outlined", color: "secondary", sx: { ml: 1 }, children: ["Dry-Run Bulk Delete", (0, jsx_runtime_1.jsx)(HelpTooltip_1.HelpTooltip, { title: "Preview the effect of a bulk delete without making changes. See ADMIN_UI_BACKEND_INTEGRATION.md for details." })] }), (0, jsx_runtime_1.jsxs)(material_1.Button, { onClick: handleAuditLog, variant: "outlined", color: "info", sx: { ml: 1 }, children: ["View Audit Log", (0, jsx_runtime_1.jsx)(HelpTooltip_1.HelpTooltip, { title: "View all admin actions for Shop. Click entries for details. See ADMIN_UI_BACKEND_INTEGRATION.md." })] }), (0, jsx_runtime_1.jsx)(material_1.Button, { href: "/apps/admin-dashboard/ADMIN_UI_BACKEND_INTEGRATION.md", target: "_blank", sx: { ml: 1 }, children: "Integration Docs" })] })), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: dryRunOpen, onClose: () => setDryRunOpen(false), children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Dry-Run Result" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)("pre", { style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' }, children: JSON.stringify(dryRunResult, null, 2) }) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setDryRunOpen(false), children: "Close" }) })] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: auditOpen, onClose: () => setAuditOpen(false), maxWidth: "md", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Shop Audit Log Summary" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(material_1.List, { children: auditLog.map((log, i) => ((0, jsx_runtime_1.jsx)(material_1.ListItem, { children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: log.message, secondary: log.timestamp }) }, i))) }) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setAuditOpen(false), children: "Close" }) })] })] }), (0, jsx_runtime_1.jsx)(core_1.DndContext, { collisionDetection: core_1.closestCenter, onDragEnd: handleDragEnd, children: (0, jsx_runtime_1.jsx)(sortable_1.SortableContext, { items: dndItems.map(i => i.id), strategy: sortable_1.verticalListSortingStrategy, children: (0, jsx_runtime_1.jsx)(material_1.List, { children: dndItems.map(item => ((0, jsx_runtime_1.jsx)(SortableItem, { item: item, children: (0, jsx_runtime_1.jsx)(material_1.ListItem, { children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: item.name, secondary: `Price: $${item.price}` }) }) }, item.id))) }) }) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add Item" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", fullWidth: true, margin: "normal", value: newItem.name, onChange: e => { setNewItem(i => ({ ...i, name: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Price", fullWidth: true, margin: "normal", value: newItem.price, onChange: e => { setNewItem(i => ({ ...i, price: e.target.value })); } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newItem.description, onChange: val => { setNewItem(i => ({ ...i, description: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Image" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { ...getRootProps(), sx: { border: '2px dashed #888', p: 2, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select image" }))] })) })] }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Available", fullWidth: true, margin: "normal", value: newItem.available ? 'Yes' : 'No', onChange: e => { setNewItem(i => ({ ...i, available: e.target.value === 'Yes' })); } })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
};
exports.default = Shop;
