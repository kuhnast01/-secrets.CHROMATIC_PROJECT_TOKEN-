"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleReload = () => {
            this.setState({ hasError: false, error: null });
            window.location.reload();
        };
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // TODO: Integrate Sentry or other error reporting here
        // console.error(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', padding: 40 }, children: [(0, jsx_runtime_1.jsx)("h2", { style: { color: 'red' }, children: "Something went wrong" }), (0, jsx_runtime_1.jsx)("p", { children: this.state.error?.message || 'An unexpected error occurred.' }), (0, jsx_runtime_1.jsx)("button", { onClick: this.handleReload, children: "Reload" })] }));
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
