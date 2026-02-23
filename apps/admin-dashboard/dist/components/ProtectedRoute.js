"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const isAuthenticated = () => {
    return !!localStorage.getItem('admin_token');
};
const ProtectedRoute = () => {
    return isAuthenticated() ? (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) : (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login" });
};
exports.default = ProtectedRoute;
