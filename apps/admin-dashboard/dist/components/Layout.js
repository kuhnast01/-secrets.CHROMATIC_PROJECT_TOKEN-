"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const AdminSessionContext_1 = require("../context/AdminSessionContext");
const material_1 = require("@mui/material");
const react_1 = require("react");
const material_2 = require("@mui/material");
function FeedbackModal({ open, onClose }) {
    const [feedback, setFeedback] = (0, react_1.useState)('');
    const [sent, setSent] = (0, react_1.useState)(false);
    const handleSend = () => {
        // Simulate sending feedback (replace with real API call)
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setFeedback('');
            onClose();
        }, 1500);
    };
    if (!open)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { style: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: (0, jsx_runtime_1.jsxs)("div", { style: { background: '#fff', padding: 32, borderRadius: 8, maxWidth: 480, boxShadow: '0 4px 32px #0003' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Feedback & Support" }), (0, jsx_runtime_1.jsx)("p", { children: "Send us your feedback or request support. We'll review and respond promptly." }), (0, jsx_runtime_1.jsx)(material_2.TextField, { label: "Your feedback", multiline: true, minRows: 3, fullWidth: true, value: feedback, onChange: e => setFeedback(e.target.value), disabled: sent }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 16, display: 'flex', gap: 8 }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSend, disabled: !feedback || sent, children: sent ? 'Sent!' : 'Send Feedback' }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: onClose, disabled: sent, children: "Close" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)("b", { children: "Support:" }), " ", (0, jsx_runtime_1.jsx)("a", { href: "mailto:support@example.com", children: "Contact Support" }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("b", { children: "FAQ:" }), " ", (0, jsx_runtime_1.jsx)("a", { href: "#faq", onClick: () => alert('FAQ coming soon!'), children: "Read FAQ" })] })] }) }));
}
const [feedbackOpen, setFeedbackOpen] = (0, react_1.useState)(false);
function OnboardingModal({ open, onClose }) {
    if (!open)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { style: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: (0, jsx_runtime_1.jsxs)("div", { style: { background: '#fff', padding: 32, borderRadius: 8, maxWidth: 480, boxShadow: '0 4px 32px #0003' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Welcome to the Admin Dashboard" }), (0, jsx_runtime_1.jsx)("p", { children: "This guided onboarding will help you get started and understand key features." }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Checklist:" }), " ", (0, jsx_runtime_1.jsx)("a", { href: "/apps/admin-dashboard/ADMIN_CHECKLIST.md", target: "_blank", rel: "noopener", children: "View onboarding checklist" })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Help:" }), " ", (0, jsx_runtime_1.jsx)("a", { href: "#help", onClick: () => alert('Dashboard help coming soon!'), children: "Dashboard Help" })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("b", { children: "FAQ:" }), " ", (0, jsx_runtime_1.jsx)("a", { href: "#faq", onClick: () => alert('FAQ coming soon!'), children: "Read FAQ" })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Support:" }), " ", (0, jsx_runtime_1.jsx)("a", { href: "mailto:support@example.com", children: "Contact Support" })] })] }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: onClose, children: "Close" })] }) }));
}
const Layout = () => {
    const [onboardingOpen, setOnboardingOpen] = (0, react_1.useState)(false);
    const { isAuthenticated, logout } = (0, AdminSessionContext_1.useAdminSession)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.AppBar, { position: "static", children: (0, jsx_runtime_1.jsxs)(material_1.Toolbar, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", sx: { flexGrow: 1 }, children: "Admin Dashboard" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", component: react_router_dom_1.Link, to: "/", children: "Dashboard" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", component: react_router_dom_1.Link, to: "/security", children: "Security" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", component: react_router_dom_1.Link, to: "/updates", children: "Updates" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", component: react_router_dom_1.Link, to: "/users", children: "Users" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", component: react_router_dom_1.Link, to: "/shop", children: "Shop" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", component: react_router_dom_1.Link, to: "/events", children: "Events" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", component: react_router_dom_1.Link, to: "/audit-log", children: "Audit Log" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", component: react_router_dom_1.Link, to: "/analytics", children: "Analytics" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "secondary", variant: "outlined", style: { marginLeft: 16 }, onClick: () => setOnboardingOpen(true), children: "Onboarding & Help" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "secondary", variant: "outlined", style: { marginLeft: 8 }, href: "http://localhost:4000/api-docs", target: "_blank", rel: "noopener", children: "API Docs" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "secondary", variant: "outlined", style: { marginLeft: 8 }, onClick: () => setFeedbackOpen(true), children: "Feedback & Support" }), (0, jsx_runtime_1.jsx)(FeedbackModal, { open: feedbackOpen, onClose: () => setFeedbackOpen(false) }), isAuthenticated && ((0, jsx_runtime_1.jsx)(material_1.Button, { color: "error", variant: "outlined", style: { marginLeft: 16 }, onClick: logout, children: "Logout" }))] }) }), (0, jsx_runtime_1.jsx)(OnboardingModal, { open: onboardingOpen, onClose: () => setOnboardingOpen(false) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { p: 3 }, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) })] }));
};
exports.default = Layout;
