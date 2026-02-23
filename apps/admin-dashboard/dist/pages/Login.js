"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const react_router_dom_1 = require("react-router-dom");
const api_1 = require("../api");
const Login = () => {
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { token } = await (0, api_1.apiRequest)('/admin/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            localStorage.setItem('admin_token', token);
            navigate('/');
        }
        catch (err) {
            setError(err.message || 'Login failed');
        }
    };
    return ((0, jsx_runtime_1.jsx)(material_1.Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", children: (0, jsx_runtime_1.jsxs)(material_1.Paper, { sx: { p: 4, minWidth: 320 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Admin Login" }), error && (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleLogin, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Username", fullWidth: true, margin: "normal", value: username, onChange: (e) => { setUsername(e.target.value); } }), (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Password", type: "password", fullWidth: true, margin: "normal", value: password, onChange: (e) => { setPassword(e.target.value); } }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", fullWidth: true, sx: { mt: 2 }, type: "submit", children: "Login" })] })] }) }));
};
exports.default = Login;
