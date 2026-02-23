"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("react-dom/client");
const App_1 = __importDefault(require("./App"));
const ErrorBoundary_1 = require("./components/ErrorBoundary");
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = (0, client_1.createRoot)(rootElement);
    root.render((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }));
}
else {
    // Optionally log or handle missing root element
    console.error('Root element not found');
}
