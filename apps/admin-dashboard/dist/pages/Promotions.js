"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const material_2 = require("@mui/material");
const api_1 = require("../api");
const AdminSessionContext_1 = require("../context/AdminSessionContext");
const bulkActions_1 = require("../utils/bulkActions");
const importExport_1 = require("../utils/importExport");
const rbac_1 = require("../utils/rbac");
const help_1 = require("../utils/help");
const useAdminAutomation_1 = require("../utils/useAdminAutomation");
const HelpTooltip_1 = require("../components/HelpTooltip");
const helpContent = [
    {
        title: 'Promotions Management',
        content: 'Create, edit, and manage promo codes, discounts, and expiration dates. Use bulk actions for efficiency. Archived promos are soft-deleted and can be restored by admins.',
    },
    {
        title: 'Tips',
        content: 'Use the duplicate button to quickly create similar promos. Use bulk edit to update discounts for multiple promos at once. Undo/redo is available for recent changes.',
    },
];
const Promotions = () => {
    const [promos, setPromos] = (0, react_1.useState)([]);
    const { isAuthenticated } = (0, AdminSessionContext_1.useAdminSession)();
    const { dryRunResult, dryRunOpen, setDryRunOpen, auditLog, auditOpen, setAuditOpen, handleDryRun, handleAuditLog } = (0, useAdminAutomation_1.useAdminAutomation)('promotions');
    // Undo/redo stacks
    const undoStack = (0, react_1.useRef)([]);
    const redoStack = (0, react_1.useRef)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newPromo, setNewPromo] = (0, react_1.useState)({ code: '', discount: '', expires: '', description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editPromo, setEditPromo] = (0, react_1.useState)({ code: '', discount: '', expires: '' });
    const handleEditInit = (promo) => {
        setEditingId(promo.id);
        setEditPromo({ code: promo.code, discount: promo.discount, expires: promo.expires });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditPromo({ code: '', discount: '', expires: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/promotions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editPromo),
        });
        setEditingId(null);
        setEditPromo({ code: '', discount: '', expires: '' });
        fetchPromos();
    };
    const [importing, setImporting] = (0, react_1.useState)(false);
    const fetchPromos = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/promotions')
            .then(data => {
            setPromos(data);
            // Clear undo/redo on fresh fetch
            undoStack.current = [];
            redoStack.current = [];
        })
            .catch(e => { setError(e.message || 'Failed to load promotions'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchPromos();
    }, []);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    // Archive instead of delete (soft delete)
    const handleArchive = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/promotions/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkUpdate)('promotions', selected, selected.map(id => ({ id, archived: true })));
            setSelected([]);
        }
        fetchPromos();
    };
    // Duplicate selected promos
    const handleDuplicate = async () => {
        for (const id of selected) {
            const orig = promos.find((p) => p.id === id);
            if (orig) {
                const copy = { ...orig, id: undefined, code: orig.code + '_copy' };
                await (0, api_1.apiRequest)('/admin/promotions', { method: 'POST', body: JSON.stringify(copy) });
            }
        }
        setSelected([]);
        fetchPromos();
    };
    // Bulk edit: set discount for all selected
    const handleBulkEdit = async (field, value) => {
        await (0, bulkActions_1.bulkUpdate)('promotions', selected, selected.map(id => ({ id, [field]: value })));
        setSelected([]);
        fetchPromos();
    };
    // Undo/redo
    const pushUndo = () => { undoStack.current.push([...promos]); if (undoStack.current.length > 20)
        undoStack.current.shift(); };
    const handleUndo = () => {
        if (undoStack.current.length) {
            redoStack.current.push([...promos]);
            setPromos(undoStack.current.pop());
        }
    };
    const handleRedo = () => {
        if (redoStack.current.length) {
            undoStack.current.push([...promos]);
            setPromos(redoStack.current.pop());
        }
    };
    const handleAdd = async () => {
        let imageUrl = newPromo.image;
        if (imageFile) {
            // Simulate upload, replace with real upload logic
            imageUrl = URL.createObjectURL(imageFile);
        }
        await (0, api_1.apiRequest)('/admin/promotions', {
            method: 'POST',
            body: JSON.stringify({ ...newPromo, image: imageUrl }),
        });
        setShowAdd(false);
        setNewPromo({ code: '', discount: '', expires: '', description: '', image: '' });
        setImageFile(null);
        fetchPromos();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(promos, 'promotions.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('promotions', data.map((p) => p.id), data);
        setImporting(false);
        fetchPromos();
    };
    const isMobile = (0, material_2.useMediaQuery)('(max-width:900px)');
    const [sidebarOpen, setSidebarOpen] = react_1.default.useState(false);
    return ((0, jsx_runtime_1.jsxs)(material_2.Box, { sx: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100%' }, children: [(0, jsx_runtime_1.jsx)(material_2.Drawer, { variant: isMobile ? 'temporary' : 'permanent', open: isMobile ? sidebarOpen : true, onClose: () => { setSidebarOpen(false); }, anchor: "right", sx: {
                    width: 300,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: 300, boxSizing: 'border-box', p: 2 },
                }, children: (0, jsx_runtime_1.jsxs)(material_2.Box, { children: [(0, jsx_runtime_1.jsx)(material_2.Typography, { variant: "h6", sx: { mb: 2 }, children: "Help & Tips" }), helpContent.map((h, idx) => ((0, jsx_runtime_1.jsxs)(material_2.Box, { sx: { mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_2.Typography, { variant: "subtitle1", children: h.title }), (0, jsx_runtime_1.jsx)(material_2.Typography, { variant: "body2", children: h.content })] }, idx)))] }) }), (0, jsx_runtime_1.jsxs)(material_2.Box, { sx: { flex: 1, p: isMobile ? 1 : 3, maxWidth: '100vw', overflowX: 'auto' }, children: [(0, jsx_runtime_1.jsxs)(material_2.Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_2.Box, { children: [(0, jsx_runtime_1.jsx)(material_2.Typography, { variant: "h5", children: "Promotions Management" }), (0, jsx_runtime_1.jsx)(material_2.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('promotions') || 'Manage promo codes, discounts, and expiration.' })] }), isMobile && ((0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => { setSidebarOpen(true); }, variant: "outlined", size: "small", children: "Help" }))] }), loading && (0, jsx_runtime_1.jsx)(material_2.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_2.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_2.Box, { sx: { mb: 2, flexWrap: 'wrap', display: 'flex', gap: 1 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", children: "Add Promotion" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => handleArchive(), disabled: !selected.length, color: "warning", variant: "outlined", children: "Archive Selected" }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleDuplicate, disabled: !selected.length, variant: "outlined", children: "Duplicate Selected" }), (0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => handleBulkEdit('discount', prompt('Set discount for all selected:') || ''), disabled: !selected.length, variant: "outlined", children: "Bulk Edit Discount" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleUndo, disabled: !undoStack.current.length, variant: "outlined", children: "Undo" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleRedo, disabled: !redoStack.current.length, variant: "outlined", children: "Redo" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleExport, variant: "outlined", children: "Export" }), (0, jsx_runtime_1.jsxs)(material_2.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] }), isAuthenticated && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_2.Button, { onClick: () => handleDryRun('bulkArchive', { ids: selected }), variant: "outlined", color: "secondary", children: ["Dry-Run Bulk Archive", (0, jsx_runtime_1.jsx)(HelpTooltip_1.HelpTooltip, { title: "Preview the effect of a bulk archive without making changes. See ADMIN_UI_BACKEND_INTEGRATION.md for details." })] }), (0, jsx_runtime_1.jsxs)(material_2.Button, { onClick: handleAuditLog, variant: "outlined", color: "info", children: ["View Audit Log", (0, jsx_runtime_1.jsx)(HelpTooltip_1.HelpTooltip, { title: "View all admin actions for Promotions. Click entries for details. See ADMIN_UI_BACKEND_INTEGRATION.md." })] }), (0, jsx_runtime_1.jsx)(material_2.Button, { href: "/apps/admin-dashboard/ADMIN_UI_BACKEND_INTEGRATION.md", target: "_blank", sx: { ml: 1 }, children: "Integration Docs" })] })), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: dryRunOpen, onClose: () => setDryRunOpen(false), children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Dry-Run Result" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)("pre", { style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' }, children: JSON.stringify(dryRunResult, null, 2) }) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => setDryRunOpen(false), children: "Close" }) })] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: auditOpen, onClose: () => setAuditOpen(false), maxWidth: "md", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Promotions Audit Log Summary" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(material_2.List, { children: auditLog.map((log, i) => ((0, jsx_runtime_1.jsx)(material_2.ListItem, { children: (0, jsx_runtime_1.jsx)(material_2.ListItemText, { primary: log.message, secondary: log.timestamp }) }, i))) }) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => setAuditOpen(false), children: "Close" }) })] })] }), (0, jsx_runtime_1.jsx)(material_2.List, { children: promos.map(promo => ((0, jsx_runtime_1.jsxs)(material_2.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === promo.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => handleEditSave(promo.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => { handleEditInit(promo); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_2.IconButton, { onClick: () => handleArchive(promo.id), color: "warning", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_2.Checkbox, { checked: selected.includes(promo.id), onChange: () => { handleSelect(promo.id); } }), editingId === promo.id ? ((0, jsx_runtime_1.jsxs)(material_2.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Code", value: editPromo.code, onChange: e => { setEditPromo(i => ({ ...i, code: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Discount", value: editPromo.discount, onChange: e => { setEditPromo(i => ({ ...i, discount: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Expires", value: editPromo.expires, onChange: e => { setEditPromo(i => ({ ...i, expires: e.target.value })); }, size: "small", sx: { mb: 1 } })] })) : ((0, jsx_runtime_1.jsx)(material_2.ListItemText, { primary: promo.code, secondary: `Discount: ${promo.discount} | Expires: ${promo.expires}` }))] }, promo.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add Promotion" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Code", fullWidth: true, margin: "normal", value: newPromo.code, onChange: e => { setNewPromo(p => ({ ...p, code: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Discount", fullWidth: true, margin: "normal", value: newPromo.discount, onChange: e => { setNewPromo(p => ({ ...p, discount: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Expires", fullWidth: true, margin: "normal", value: newPromo.expires, onChange: e => { setNewPromo(p => ({ ...p, expires: e.target.value })); } })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_2.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_2.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] })] }));
};
exports.default = Promotions;
