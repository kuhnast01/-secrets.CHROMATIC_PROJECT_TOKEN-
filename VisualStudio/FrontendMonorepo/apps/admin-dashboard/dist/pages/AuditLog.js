"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const api_1 = require("../api");
const AuditLog = () => {
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        (0, api_1.apiRequest)('/admin/audit-log')
            .then(setLogs)
            .catch(e => { setError(e.message || 'Failed to load audit log'); })
            .finally(() => { setLoading(false); });
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: "Audit Log" }), loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsx)(material_1.List, { children: logs.map((log, i) => ((0, jsx_runtime_1.jsx)(material_1.ListItem, { children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: log.message, secondary: log.timestamp }) }, i))) })] }));
};
exports.default = AuditLog;
