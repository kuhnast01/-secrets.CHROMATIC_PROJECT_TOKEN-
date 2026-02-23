"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const material_2 = require("@mui/material");
const api_1 = require("../api");
const AdminSessionContext_1 = require("../context/AdminSessionContext");
const rbac_1 = require("../utils/rbac");
const help_1 = require("../utils/help");
const importExport_1 = require("../utils/importExport");
const defaultSettings = { maintenanceMode: false, version: '', motd: '' };
const SystemSettings = () => {
    const [settings, setSettings] = (0, react_1.useState)(defaultSettings);
    const [dryRunResult, setDryRunResult] = (0, react_1.useState)(null);
    const [dryRunOpen, setDryRunOpen] = (0, react_1.useState)(false);
    const [auditLog, setAuditLog] = (0, react_1.useState)([]);
    const [auditOpen, setAuditOpen] = (0, react_1.useState)(false);
    const { isAuthenticated } = (0, AdminSessionContext_1.useAdminSession)();
    // Undo/redo stacks
    const undoStack = (0, react_1.useRef)([]);
    const redoStack = (0, react_1.useRef)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    // Inline editing state for each field
    const [editingField, setEditingField] = (0, react_1.useState)(null);
    const [editValue, setEditValue] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    const fetchSettings = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/settings')
            .then(data => {
            setSettings(data);
            // Clear undo/redo on fresh fetch
            undoStack.current = [];
            redoStack.current = [];
        })
            .catch(e => { setError(e.message || 'Failed to load settings'); })
            .finally(() => { setLoading(false); });
    };
    // Archive disables all settings (soft delete)
    const handleArchive = async () => {
        const archived = { maintenanceMode: true, version: '', motd: '' };
        await (0, api_1.apiRequest)('/admin/settings', { method: 'PUT', body: JSON.stringify(archived) });
        fetchSettings();
    };
    // Undo/redo
    const pushUndo = () => { undoStack.current.push({ ...settings }); if (undoStack.current.length > 20)
        undoStack.current.shift(); };
    const handleUndo = () => {
        if (undoStack.current.length) {
            redoStack.current.push({ ...settings });
            setSettings(undoStack.current.pop());
        }
    };
    const handleRedo = () => {
        if (redoStack.current.length) {
            undoStack.current.push({ ...settings });
            setSettings(redoStack.current.pop());
        }
    };
    (0, react_1.useEffect)(() => {
        fetchSettings();
    }, []);
    const handleEdit = (field) => {
        setEditingField(field);
        setEditValue(settings[field]);
    };
    const handleEditCancel = () => {
        setEditingField(null);
        setEditValue(null);
    };
    const handleEditSave = async () => {
        await (0, api_1.apiRequest)('/admin/settings', {
            method: 'PUT',
            body: JSON.stringify({ ...settings, [editingField]: editValue }),
        });
        setEditingField(null);
        setEditValue(null);
        fetchSettings();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)([settings], 'system_settings.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const [data] = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, api_1.apiRequest)('/admin/settings', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        setImporting(false);
        fetchSettings();
    };
    return ((0, jsx_runtime_1.jsxs)(material_2.Box, { children: [(0, jsx_runtime_1.jsx)(material_2.Typography, { variant: "h5", children: "System Settings" }), (0, jsx_runtime_1.jsx)(material_2.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('system') || 'Manage global system settings, maintenance, and MOTD.' }), loading && (0, jsx_runtime_1.jsx)(material_2.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_2.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_2.Box, { sx: { mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_2.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleArchive, color: "warning", variant: "outlined", sx: { mr: 1 }, children: "Archive Settings" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleUndo, disabled: !undoStack.current.length, variant: "outlined", sx: { mr: 1 }, children: "Undo" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleRedo, disabled: !redoStack.current.length, variant: "outlined", sx: { mr: 1 }, children: "Redo" }), isAuthenticated && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_2.Button, { onClick: async () => {
                                    try {
                                        const result = await (0, api_1.apiRequest)('/admin/settings/dry-run', { method: 'POST', body: JSON.stringify({ action: 'update', data: settings }) });
                                        setDryRunResult(result);
                                        setDryRunOpen(true);
                                    }
                                    catch (e) {
                                        setDryRunResult({ error: e.message });
                                        setDryRunOpen(true);
                                    }
                                }, variant: "outlined", color: "secondary", sx: { ml: 1 }, children: "Dry-Run Update" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: async () => {
                                    try {
                                        const logs = await (0, api_1.apiRequest)('/admin/audit-log?scope=settings');
                                        setAuditLog(logs);
                                        setAuditOpen(true);
                                    }
                                    catch (e) {
                                        setAuditLog([{ message: e.message, timestamp: new Date().toISOString() }]);
                                        setAuditOpen(true);
                                    }
                                }, variant: "outlined", color: "info", sx: { ml: 1 }, children: "View Audit Log" })] }))] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: dryRunOpen, onClose: () => setDryRunOpen(false), children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Dry-Run Result" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)("pre", { style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' }, children: JSON.stringify(dryRunResult, null, 2) }) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => setDryRunOpen(false), children: "Close" }) })] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: auditOpen, onClose: () => setAuditOpen(false), maxWidth: "md", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "System Settings Audit Log Summary" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(material_2.List, { children: auditLog.map((log, i) => ((0, jsx_runtime_1.jsx)(material_2.ListItem, { children: (0, jsx_runtime_1.jsx)(material_2.ListItemText, { primary: log.message, secondary: log.timestamp }) }, i))) }) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => setAuditOpen(false), children: "Close" }) })] }), (0, jsx_runtime_1.jsxs)(material_2.List, { children: [(0, jsx_runtime_1.jsx)(material_2.ListItem, { children: editingField === 'maintenanceMode' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_2.Checkbox, { checked: !!editValue, onChange: e => { setEditValue(e.target.checked); } }), (0, jsx_runtime_1.jsx)(material_2.ListItemText, { primary: "Maintenance Mode", secondary: editValue ? 'ON' : 'OFF' }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleEditSave, color: "primary", size: "small", sx: { ml: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_2.Checkbox, { checked: !!settings.maintenanceMode, disabled: true }), (0, jsx_runtime_1.jsx)(material_2.ListItemText, { primary: "Maintenance Mode", secondary: settings.maintenanceMode ? 'ON' : 'OFF' }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => { handleEdit('maintenanceMode'); }, size: "small", sx: { ml: 1 }, children: "Edit" })] })) }), (0, jsx_runtime_1.jsx)(material_2.ListItem, { children: editingField === 'version' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Version", value: editValue, onChange: e => { setEditValue(e.target.value); }, size: "small", sx: { mr: 1 } }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleEditSave, color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_2.ListItemText, { primary: "Version", secondary: settings.version }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => { handleEdit('version'); }, size: "small", sx: { ml: 1 }, children: "Edit" })] })) }), (0, jsx_runtime_1.jsx)(material_2.ListItem, { children: editingField === 'motd' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Message of the Day", value: editValue, onChange: e => { setEditValue(e.target.value); }, size: "small", sx: { mr: 1 } }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleEditSave, color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_2.ListItemText, { primary: "Message of the Day", secondary: settings.motd }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => { handleEdit('motd'); }, size: "small", sx: { ml: 1 }, children: "Edit" })] })) })] })] }));
};
exports.default = SystemSettings;
