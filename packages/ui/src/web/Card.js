import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Card = ({ children, title }) => (_jsxs("div", { style: { border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: 8 }, children: [title && _jsx("h2", { style: { marginBottom: 8 }, children: title }), children] }));
