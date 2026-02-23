"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const core_1 = require("@dnd-kit/core");
const sortable_1 = require("@dnd-kit/sortable");
const DraggableContentBlock_1 = __importDefault(require("../components/DraggableContentBlock"));
const material_1 = require("@mui/material");
const react_dropzone_1 = __importDefault(require("react-dropzone"));
const react_quill_1 = __importDefault(require("react-quill"));
require("react-quill/dist/quill.snow.css");
const api_1 = require("../api");
const bulkActions_1 = require("../utils/bulkActions");
const importExport_1 = require("../utils/importExport");
const rbac_1 = require("../utils/rbac");
const help_1 = require("../utils/help");
const AdminSessionContext_1 = require("../context/AdminSessionContext");
const useAdminAutomation_1 = require("../utils/useAdminAutomation");
const initialBlocks = [
    { id: 'user-info', content: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "User Management" }) },
    { id: 'user-image', content: (0, jsx_runtime_1.jsx)("img", { src: "https://placekitten.com/320/120", alt: "user graphic", style: { maxWidth: 320, borderRadius: 8 } }) },
    { id: 'user-widget', content: (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { p: 2, background: '#f5f5f5', borderRadius: 4 }, children: "Widget: User Stats" }) },
];
const Users = () => {
    // Drag-and-drop blocks
    const [blocks, setBlocks] = (0, react_1.useState)(initialBlocks);
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = blocks.findIndex(b => b.id === active.id);
            const newIndex = blocks.findIndex(b => b.id === over.id);
            const newBlocks = [...blocks];
            const [moved] = newBlocks.splice(oldIndex, 1);
            newBlocks.splice(newIndex, 0, moved);
            setBlocks(newBlocks);
        }
    };
    const addTextBlock = () => {
        setBlocks([...blocks, { id: `text-${Date.now()}`, content: (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "New user text block" }) }]);
    };
    const addImageBlock = () => {
        setBlocks([...blocks, { id: `img-${Date.now()}`, content: (0, jsx_runtime_1.jsx)("img", { src: "https://placekitten.com/320/120", alt: "added user graphic", style: { maxWidth: 320, borderRadius: 8 } }) }]);
    };
    // User management
    const [users, setUsers] = (0, react_1.useState)([]);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newUser, setNewUser] = (0, react_1.useState)({ username: '', password: '', role: 'viewer', bio: '', avatar: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editUser, setEditUser] = (0, react_1.useState)({ username: '', role: '', bio: '' });
    // Admin automation wiring
    const { isAuthenticated } = (0, AdminSessionContext_1.useAdminSession)();
    const { dryRunResult, dryRunOpen, setDryRunOpen, auditLog, auditOpen, setAuditOpen, handleDryRun, handleAuditLog } = (0, useAdminAutomation_1.useAdminAutomation)('users');
    /**
     * Admin Automation Controls (Dry-Run, Audit Log)
     * - Dry-run: Preview effect of bulk delete or update without making changes.
     * - Audit log: View all admin actions for Users.
     * - Integration Docs: See ADMIN_UI_BACKEND_INTEGRATION.md for troubleshooting and maintenance.
     */
    // Fetch users
    const fetchUsers = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/users')
            .then(setUsers)
            .catch(e => { setError(e.message || 'Failed to load users'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => { fetchUsers(); }, []);
    // Select handler
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    // Delete handler
    const handleDelete = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/users/${id}`, { method: 'DELETE' });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkDelete)('users', selected);
            setSelected([]);
        }
        fetchUsers();
    };
    // Add handler
    const handleAdd = async () => {
        let avatarUrl = newUser.avatar;
        if (imageFile) {
            // Simulate upload, replace with real upload logic
            avatarUrl = URL.createObjectURL(imageFile);
        }
        await (0, api_1.apiRequest)('/admin/users', {
            method: 'POST',
            body: JSON.stringify({ ...newUser, avatar: avatarUrl }),
        });
        setShowAdd(false);
        setNewUser({ username: '', password: '', role: 'viewer', bio: '', avatar: '' });
        setImageFile(null);
        fetchUsers();
    };
    // Export handler
    const handleExport = () => { (0, importExport_1.exportToCSV)(users, 'users.csv'); };
    // Import handler
    const handleImport = async (e) => {
        setImporting(true);
        const file = e.target.files?.[0];
        if (file) {
            const imported = await (0, importExport_1.importFromCSV)(file);
            await (0, bulkActions_1.bulkUpdate)('users', imported);
            fetchUsers();
        }
        setImporting(false);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(core_1.DndContext, { collisionDetection: core_1.closestCenter, onDragEnd: handleDragEnd, children: (0, jsx_runtime_1.jsx)(sortable_1.SortableContext, { items: blocks.map(b => b.id), strategy: sortable_1.verticalListSortingStrategy, children: blocks.map(block => ((0, jsx_runtime_1.jsx)(DraggableContentBlock_1.default, { id: block.id, children: block.content }, block.id))) }) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "User Management" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('users') }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add User" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleDelete(), disabled: !selected.length, color: "error", variant: "outlined", sx: { mr: 1 }, children: "Delete Selected" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: users.map(user => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === user.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(user.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(user); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleDelete(user.id), color: "error", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(user.id), onChange: () => { handleSelect(user.id); } }), editingId === user.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Username", value: editUser.username, onChange: (e) => { setEditUser(u => ({ ...u, username: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Role", value: editUser.role, onChange: (e) => { setEditUser(u => ({ ...u, role: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Bio" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: editUser.bio, onChange: (val) => { setEditUser(u => ({ ...u, bio: val })); }, theme: "snow", style: { minHeight: 80, marginBottom: 8 } })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: user.username, secondary: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Role: ", user.role] }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: user.bio } })] }) })), user.avatar && (0, jsx_runtime_1.jsx)("img", { src: user.avatar, alt: "avatar", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, user.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add User" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Username", fullWidth: true, margin: "normal", value: newUser.username, onChange: e => { setNewUser(u => ({ ...u, username: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Password", fullWidth: true, margin: "normal", value: newUser.password, onChange: e => setNewUser(u => ({ ...u, password: e.target.value })) }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Role", fullWidth: true, margin: "normal", value: newUser.role, onChange: e => setNewUser(u => ({ ...u, role: e.target.value })) }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Bio" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newUser.bio, onChange: val => { setNewUser(u => ({ ...u, bio: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Avatar" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { ...getRootProps(), sx: { border: '2px dashed #888', p: 2, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select avatar" }))] })) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
    {
        users.map(user => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === user.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(user.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(user); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleDelete(user.id), color: "error", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(user.id), onChange: () => { handleSelect(user.id); } }), editingId === user.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Username", value: editUser.username, onChange: (e) => { setEditUser(u => ({ ...u, username: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Role", value: editUser.role, onChange: (e) => { setEditUser(u => ({ ...u, role: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Bio" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: editUser.bio, onChange: (val) => { setEditUser(u => ({ ...u, bio: val })); }, theme: "snow", style: { minHeight: 80, marginBottom: 8 } })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: user.username, secondary: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Role: ", user.role] }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: user.bio } })] }) })), user.avatar && (0, jsx_runtime_1.jsx)("img", { src: user.avatar, alt: "avatar", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, user.id)));
    }
};
material_1.List >
    (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add User" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Username", fullWidth: true, margin: "normal", value: newUser.username, onChange: e => setNewUser(u => ({ ...u, username: e.target.value })) }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Password", fullWidth: true, margin: "normal", value: newUser.password, onChange: e => setNewUser(u => ({ ...u, password: e.target.value })) }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Role", fullWidth: true, margin: "normal", value: newUser.role, onChange: e => setNewUser(u => ({ ...u, role: e.target.value })) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { my: 2 } })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] });
material_1.Box >
;
;
;
exports.default = Users;
