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
const HelpTooltip_1 = require("../components/HelpTooltip");
const initialBlocks = [
    { id: 'event-info', content: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Event Management" }) },
    { id: 'event-image', content: (0, jsx_runtime_1.jsx)("img", { src: "https://placekitten.com/320/120", alt: "event graphic", style: { maxWidth: 320, borderRadius: 8 } }) },
    { id: 'event-widget', content: (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { p: 2, background: '#f5f5f5', borderRadius: 4 }, children: "Widget: Upcoming Events" }) },
];
const Events = () => {
    const [events, setEvents] = (0, react_1.useState)([]);
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
    // Example: Add new text block
    const addTextBlock = () => {
        setBlocks([...blocks, { id: `text-${Date.now()}`, content: (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "New event text block" }) }]);
    };
    // Example: Add new image block
    const addImageBlock = () => {
        setBlocks([...blocks, { id: `img-${Date.now()}`, content: (0, jsx_runtime_1.jsx)("img", { src: "https://placekitten.com/320/120", alt: "added event graphic", style: { maxWidth: 320, borderRadius: 8 } }) }]);
    };
    const [selected, setSelected] = (0, react_1.useState)([]);
    // Admin automation wiring
    const { isAuthenticated } = (0, AdminSessionContext_1.useAdminSession)();
    const { dryRunResult, dryRunOpen, setDryRunOpen, auditLog, auditOpen, setAuditOpen, handleDryRun, handleAuditLog } = (0, useAdminAutomation_1.useAdminAutomation)('events');
    /**
     * Admin Automation Controls (Dry-Run, Audit Log)
     * - Dry-run: Preview effect of bulk delete or update without making changes.
     * - Audit log: View all admin actions for Events.
     * - Integration Docs: See ADMIN_UI_BACKEND_INTEGRATION.md for troubleshooting and maintenance.
     */
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [role, setRole] = (0, react_1.useState)('admin'); // Replace with real user role
    const [showAdd, setShowAdd] = (0, react_1.useState)(false);
    const [newEvent, setNewEvent] = (0, react_1.useState)({ name: '', date: '', active: true, description: '', image: '' });
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const [importing, setImporting] = (0, react_1.useState)(false);
    // Inline editing state
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const [editEvent, setEditEvent] = (0, react_1.useState)({ name: '', date: '', active: true, description: '' });
    const handleEditInit = (event) => {
        setEditingId(event.id);
        setEditEvent({ name: event.name, date: event.date, active: event.active, description: event.description });
    };
    const handleEditCancel = () => {
        setEditingId(null);
        setEditEvent({ name: '', date: '', active: true, description: '' });
    };
    const handleEditSave = async (id) => {
        await (0, api_1.apiRequest)(`/admin/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editEvent),
        });
        setEditingId(null);
        setEditEvent({ name: '', date: '', active: true, description: '' });
        fetchEvents();
    };
    const fetchEvents = () => {
        setLoading(true);
        (0, api_1.apiRequest)('/admin/events')
            .then(setEvents)
            .catch(e => { setError(e.message || 'Failed to load events'); })
            .finally(() => { setLoading(false); });
    };
    (0, react_1.useEffect)(() => {
        fetchEvents();
    }, []);
    const handleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
    };
    const handleDelete = async (id) => {
        if (id) {
            await (0, api_1.apiRequest)(`/admin/events/${id}`, { method: 'DELETE' });
        }
        else if (selected.length) {
            await (0, bulkActions_1.bulkDelete)('events', selected);
            setSelected([]);
        }
        fetchEvents();
    };
    const handleAdd = async () => {
        let imageUrl = newEvent.image;
        if (imageFile) {
            // Simulate upload, replace with real upload logic
            imageUrl = URL.createObjectURL(imageFile);
        }
        await (0, api_1.apiRequest)('/admin/events', {
            method: 'POST',
            body: JSON.stringify({ ...newEvent, image: imageUrl }),
        });
        setShowAdd(false);
        setNewEvent({ name: '', date: '', active: true, description: '', image: '' });
        setImageFile(null);
        fetchEvents();
    };
    const handleExport = () => { (0, importExport_1.exportToCSV)(events, 'events.csv'); };
    const handleImport = async (e) => {
        if (!e.target.files?.length)
            return;
        setImporting(true);
        const data = await (0, importExport_1.importFromCSV)(e.target.files[0]);
        await (0, bulkActions_1.bulkUpdate)('events', data.map((ev) => ev.id), data);
        setImporting(false);
        fetchEvents();
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: addTextBlock, sx: { mr: 1 }, children: "Add Text Block" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: addImageBlock, children: "Add Image Block" }), isAuthenticated && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Button, { onClick: () => handleDryRun('bulkDelete', { ids: selected }), variant: "outlined", color: "secondary", sx: { ml: 1 }, children: ["Dry-Run Bulk Delete", (0, jsx_runtime_1.jsx)(HelpTooltip_1.HelpTooltip, { title: "Preview the effect of a bulk delete without making changes. See ADMIN_UI_BACKEND_INTEGRATION.md for details." })] }), (0, jsx_runtime_1.jsxs)(material_1.Button, { onClick: handleAuditLog, variant: "outlined", color: "info", sx: { ml: 1 }, children: ["View Audit Log", (0, jsx_runtime_1.jsx)(HelpTooltip_1.HelpTooltip, { title: "View all admin actions for Events. Click entries for details. See ADMIN_UI_BACKEND_INTEGRATION.md." })] }), (0, jsx_runtime_1.jsx)(material_1.Button, { href: "/apps/admin-dashboard/ADMIN_UI_BACKEND_INTEGRATION.md", target: "_blank", sx: { ml: 1 }, children: "Integration Docs" })] }))] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: dryRunOpen, onClose: () => setDryRunOpen(false), children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Dry-Run Result" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)("pre", { style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' }, children: JSON.stringify(dryRunResult, null, 2) }) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setDryRunOpen(false), children: "Close" }) })] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: auditOpen, onClose: () => setAuditOpen(false), maxWidth: "md", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Events Audit Log Summary" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsx)(material_1.List, { children: auditLog.map((log, i) => ((0, jsx_runtime_1.jsx)(material_1.ListItem, { children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: log.message, secondary: log.timestamp }) }, i))) }) }), (0, jsx_runtime_1.jsx)(material_1.DialogActions, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setAuditOpen(false), children: "Close" }) })] }), (0, jsx_runtime_1.jsx)(core_1.DndContext, { collisionDetection: core_1.closestCenter, onDragEnd: handleDragEnd, children: (0, jsx_runtime_1.jsx)(sortable_1.SortableContext, { items: blocks.map(b => b.id), strategy: sortable_1.verticalListSortingStrategy, children: blocks.map(block => ((0, jsx_runtime_1.jsx)(DraggableContentBlock_1.default, { id: block.id, children: block.content }, block.id))) }) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Event Management" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: { mb: 2 }, children: (0, help_1.getHelp)('events') }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(true); }, variant: "contained", sx: { mr: 1 }, children: "Add Event" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleDelete(), disabled: !selected.length, color: "error", variant: "outlined", sx: { mr: 1 }, children: "Delete Selected" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleExport, variant: "outlined", sx: { mr: 1 }, children: "Export" }), (0, jsx_runtime_1.jsxs)(material_1.Button, { variant: "outlined", component: "label", children: ["Import", (0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".csv", hidden: true, onChange: handleImport, disabled: importing })] })] }), (0, jsx_runtime_1.jsx)(material_1.List, { children: events.map(event => ((0, jsx_runtime_1.jsxs)(material_1.ListItem, { alignItems: "flex-start", secondaryAction: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: editingId === event.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => handleEditSave(event.id), color: "primary", size: "small", sx: { mr: 1 }, children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleEditCancel, color: "inherit", size: "small", children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, rbac_1.canEdit)(role) && (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { handleEditInit(event); }, size: "small", sx: { mr: 1 }, children: "Edit" }), (0, rbac_1.canDelete)(role) && (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => handleDelete(event.id), color: "error", children: "\uD83D\uDDD1\uFE0F" })] })) }), children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: selected.includes(event.id), onChange: () => { handleSelect(event.id); } }), editingId === event.id ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", value: editEvent.name, onChange: (e) => { setEditEvent(ev => ({ ...ev, name: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Date", value: editEvent.date, onChange: (e) => { setEditEvent(ev => ({ ...ev, date: e.target.value })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Active", value: editEvent.active ? 'Yes' : 'No', onChange: (e) => { setEditEvent(ev => ({ ...ev, active: e.target.value === 'Yes' })); }, size: "small", sx: { mb: 1 } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: editEvent.description, onChange: (val) => { setEditEvent(ev => ({ ...ev, description: val })); }, theme: "snow", style: { minHeight: 80, marginBottom: 8 } })] })) : ((0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: event.name, secondary: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", children: ["Date: ", event.date, " | Active: ", event.active ? 'Yes' : 'No'] }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: event.description } })] }) })), event.image && (0, jsx_runtime_1.jsx)("img", { src: event.image, alt: "event", style: { maxWidth: 80, maxHeight: 60, marginLeft: 12 } })] }, event.id))) }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: showAdd, onClose: () => { setShowAdd(false); }, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Add Event" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Name", fullWidth: true, margin: "normal", value: newEvent.name, onChange: e => { setNewEvent(ev => ({ ...ev, name: e.target.value })); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Date", fullWidth: true, margin: "normal", value: newEvent.date, onChange: e => { setNewEvent(ev => ({ ...ev, date: e.target.value })); } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Description" }), (0, jsx_runtime_1.jsx)(react_quill_1.default, { value: newEvent.description, onChange: val => { setNewEvent(ev => ({ ...ev, description: val })); }, theme: "snow" })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { my: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", children: "Image" }), (0, jsx_runtime_1.jsx)(react_dropzone_1.default, { onDrop: acceptedFiles => { setImageFile(acceptedFiles[0]); }, multiple: false, accept: { 'image/*': [] }, children: ({ getRootProps, getInputProps }) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { ...getRootProps(), sx: { border: '2px dashed #888', p: 2, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }, children: [(0, jsx_runtime_1.jsx)("input", { ...getInputProps() }), imageFile ? ((0, jsx_runtime_1.jsx)("img", { src: URL.createObjectURL(imageFile), alt: "preview", style: { maxWidth: 120, maxHeight: 80 } })) : ((0, jsx_runtime_1.jsx)("span", { children: "Drag & drop or click to select image" }))] })) })] }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Active", fullWidth: true, margin: "normal", value: newEvent.active ? 'Yes' : 'No', onChange: e => { setNewEvent(ev => ({ ...ev, active: e.target.value === 'Yes' })); } })] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => { setShowAdd(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleAdd, variant: "contained", children: "Add" })] })] })] }));
};
exports.default = Events;
