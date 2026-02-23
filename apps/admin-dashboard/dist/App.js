"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const AdminSessionContext_1 = require("./context/AdminSessionContext");
const react_router_dom_1 = require("react-router-dom");
const Security_1 = __importDefault(require("./pages/Security"));
const Updates_1 = __importDefault(require("./pages/Updates"));
const Users_1 = __importDefault(require("./pages/Users"));
const Shop_1 = __importDefault(require("./pages/Shop"));
const Events_1 = __importDefault(require("./pages/Events"));
const Login_1 = __importDefault(require("./pages/Login"));
const Layout_1 = __importDefault(require("./components/Layout"));
const ProtectedRoute_1 = __importDefault(require("./components/ProtectedRoute"));
const AuditLog_1 = __importDefault(require("./pages/AuditLog"));
const Analytics_1 = __importDefault(require("./pages/Analytics"));
const Dashboard_1 = __importDefault(require("./pages/Dashboard"));
const App = () => {
    return ((0, jsx_runtime_1.jsx)(AdminSessionContext_1.AdminSessionProvider, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(Login_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, {}), children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(Layout_1.default, {}), children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)(Dashboard_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "security", element: (0, jsx_runtime_1.jsx)(Security_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "updates", element: (0, jsx_runtime_1.jsx)(Updates_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "users", element: (0, jsx_runtime_1.jsx)(Users_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "shop", element: (0, jsx_runtime_1.jsx)(Shop_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "events", element: (0, jsx_runtime_1.jsx)(Events_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "audit-log", element: (0, jsx_runtime_1.jsx)(AuditLog_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "analytics", element: (0, jsx_runtime_1.jsx)(Analytics_1.default, {}) })] }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/" }) })] }) }));
};
exports.default = App;
