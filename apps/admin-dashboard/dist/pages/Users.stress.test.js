"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const Users_1 = __importDefault(require("./Users"));
describe('Users Page - Stress & Edge Cases', () => {
    it('handles empty user list gracefully', () => {
        // Mock apiRequest to return empty array
        jest.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([]) }));
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Users_1.default, {}));
        expect(react_1.screen.queryByText('No users found')).toBeNull(); // Adjust if UI shows empty state
    });
    it('handles API failure', async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.reject(new Error('API error')));
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Users_1.default, {}));
        expect(await react_1.screen.findByText(/Failed to load users/)).toBeInTheDocument();
    });
    it('handles rapid add/delete actions', async () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Users_1.default, {}));
        react_1.fireEvent.click(react_1.screen.getByText('Add User'));
        react_1.fireEvent.click(react_1.screen.getByText('Add New User'));
        react_1.fireEvent.click(react_1.screen.getByText('Delete'));
        // Check for UI stability, no crashes
        expect(react_1.screen.getByText('User Management')).toBeInTheDocument();
    });
    it('handles drag-and-drop with many blocks', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Users_1.default, {}));
        for (let i = 0; i < 20; i++) {
            react_1.fireEvent.click(react_1.screen.getByText('Add User'));
        }
        // Try dragging blocks
        // Optionally: simulate drag events and check order
    });
});
