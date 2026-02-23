"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSessionProvider = void 0;
exports.useAdminSession = useAdminSession;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const session_1 = require("../utils/session");
const AdminSessionContext = (0, react_1.createContext)(undefined);
const AdminSessionProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)((0, session_1.isSessionActive)());
    (0, react_1.useEffect)(() => {
        const check = () => setIsAuthenticated((0, session_1.isSessionActive)());
        window.addEventListener('storage', check);
        return () => window.removeEventListener('storage', check);
    }, []);
    return ((0, jsx_runtime_1.jsx)(AdminSessionContext.Provider, { value: { isAuthenticated, logout: session_1.logout }, children: children }));
};
exports.AdminSessionProvider = AdminSessionProvider;
function useAdminSession() {
    const ctx = (0, react_1.useContext)(AdminSessionContext);
    if (!ctx)
        throw new Error('useAdminSession must be used within AdminSessionProvider');
    return ctx;
}
