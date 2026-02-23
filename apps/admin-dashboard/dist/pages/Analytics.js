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
const api_1 = require("../api");
const AdminSessionContext_1 = require("../context/AdminSessionContext");
const useAdminAutomation_1 = require("../utils/useAdminAutomation");
const HelpTooltip_1 = require("../components/HelpTooltip");
// You can use recharts or chart.js for real charts; here is a placeholder
const initialBlocks = [
    { id: 'analytics-info', content: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Analytics Dashboard" }) },
    { id: 'analytics-image', content: (0, jsx_runtime_1.jsx)("img", { src: "https://placekitten.com/320/120", alt: "analytics graphic", style: { maxWidth: 320, borderRadius: 8 } }) },
    { id: 'analytics-widget', content: (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { p: 2, background: '#f5f5f5', borderRadius: 4 }, children: "Widget: Metrics Overview" }) },
];
const Analytics = () => {
    const [metrics, setMetrics] = (0, react_1.useState)(null);
    // Admin automation wiring
    const { isAuthenticated } = (0, AdminSessionContext_1.useAdminSession)();
    const { dryRunResult, dryRunOpen, setDryRunOpen, auditLog, auditOpen, setAuditOpen, handleDryRun, handleAuditLog } = (0, useAdminAutomation_1.useAdminAutomation)('analytics');
    /**
     * Admin Automation Controls (Dry-Run, Audit Log)
     * - Dry-run: Preview effect of analytics reset or bulk action without making changes.
     * - Audit log: View all admin actions for Analytics.
     * - Integration Docs: See ADMIN_UI_BACKEND_INTEGRATION.md for troubleshooting and maintenance.
     */
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
        setBlocks([...blocks, { id: `text-${Date.now()}`, content: (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "New analytics text block" }) }]);
    };
    // Example: Add new image block
    const addImageBlock = () => {
        setBlocks([...blocks, { id: `img-${Date.now()}`, content: (0, jsx_runtime_1.jsx)("img", { src: "https://placekitten.com/320/120", alt: "added analytics graphic", style: { maxWidth: 320, borderRadius: 8 } }) }]);
    };
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        (0, api_1.apiRequest)('/admin/analytics')
            .then(setMetrics)
            .catch(e => { setError(e.message || 'Failed to load analytics'); })
            .finally(() => { setLoading(false); });
    }, []);
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: addTextBlock, sx: { mr: 1 }, children: "Add Text Block" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: addImageBlock, children: "Add Image Block" }), isAuthenticated && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Button, { onClick: () => handleDryRun('reset', {}), variant: "outlined", color: "secondary", sx: { ml: 1 }, children: ["Dry-Run Analytics Reset", (0, jsx_runtime_1.jsx)(HelpTooltip_1.HelpTooltip, { title: "Preview the effect of an analytics reset without making changes. See ADMIN_UI_BACKEND_INTEGRATION.md for details." })] }), (0, jsx_runtime_1.jsxs)(material_1.Button, { onClick: handleAuditLog, variant: "outlined", color: "info", sx: { ml: 1 }, children: ["View Audit Log", (0, jsx_runtime_1.jsx)(HelpTooltip_1.HelpTooltip, { title: "View all admin actions for Analytics. Click entries for details. See ADMIN_UI_BACKEND_INTEGRATION.md." })] }), (0, jsx_runtime_1.jsx)(material_1.Button, { href: "/apps/admin-dashboard/ADMIN_UI_BACKEND_INTEGRATION.md", target: "_blank", sx: { ml: 1 }, children: "Integration Docs" })] }))] }), (0, jsx_runtime_1.jsxs)(Dialog, { open: dryRunOpen, onClose: () => setDryRunOpen(false), children: [(0, jsx_runtime_1.jsx)(DialogTitle, { children: "Dry-Run Result" }), (0, jsx_runtime_1.jsx)(DialogContent, { children: (0, jsx_runtime_1.jsx)("pre", { style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' }, children: JSON.stringify(dryRunResult, null, 2) }) }), (0, jsx_runtime_1.jsx)(DialogActions, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setDryRunOpen(false), children: "Close" }) })] }), (0, jsx_runtime_1.jsxs)(Dialog, { open: auditOpen, onClose: () => setAuditOpen(false), maxWidth: "md", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(DialogTitle, { children: "Analytics Audit Log Summary" }), (0, jsx_runtime_1.jsx)(DialogContent, { children: (0, jsx_runtime_1.jsx)(List, { children: auditLog.map((log, i) => ((0, jsx_runtime_1.jsx)(ListItem, { children: (0, jsx_runtime_1.jsx)(ListItemText, { primary: log.message, secondary: log.timestamp }) }, i))) }) }), (0, jsx_runtime_1.jsx)(DialogActions, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setAuditOpen(false), children: "Close" }) })] }), (0, jsx_runtime_1.jsx)(core_1.DndContext, { collisionDetection: core_1.closestCenter, onDragEnd: handleDragEnd, children: (0, jsx_runtime_1.jsx)(sortable_1.SortableContext, { items: blocks.map(b => b.id), strategy: sortable_1.verticalListSortingStrategy, children: blocks.map(block => ((0, jsx_runtime_1.jsx)(DraggableContentBlock_1.default, { id: block.id, children: block.content }, block.id))) }) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Analytics Dashboard" }), (0, jsx_runtime_1.jsxs)(material_1.Paper, { sx: { p: 2, mt: 2 }, children: [loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), metrics && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Total Users: ", metrics.totalUsers] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Active Events: ", metrics.activeEvents] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Revenue (This Month): $", metrics.revenueThisMonth] })] }))] })] }));
};
exports.default = Analytics;
