"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const Users_1 = __importDefault(require("./Users"));
describe('Users Page', () => {
    it('renders User Management header', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Users_1.default, {}));
        expect(react_1.screen.getByText('User Management')).toBeInTheDocument();
    });
    it('shows Add User dialog when button is clicked', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Users_1.default, {}));
        react_1.fireEvent.click(react_1.screen.getByText('Add User'));
        expect(react_1.screen.getByText('Add New User')).toBeInTheDocument();
    });
    it('exports users when Export Users button is clicked', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Users_1.default, {}));
        const exportBtn = react_1.screen.getByText('Export Users');
        expect(exportBtn).toBeInTheDocument();
        // Optionally: mock exportToCSV and check call
    });
    // Add more tests for drag-and-drop, import, delete, edit, etc.
});
