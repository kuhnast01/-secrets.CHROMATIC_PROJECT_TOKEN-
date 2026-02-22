"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const core_1 = require("@dnd-kit/core");
const sortable_1 = require("@dnd-kit/sortable");
const DraggableContentBlock_1 = __importDefault(require("../components/DraggableContentBlock"));
/**
 * Dashboard - Industry best practice drag-and-drop for widgets, graphics, images, text
 * Modular, maintainable, easy to extend
 */
const initialBlocks = [
    { id: 'welcome', content: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", children: "Welcome to the Admin Dashboard" }) },
    { id: 'info', content: (0, jsx_runtime_1.jsx)(material_1.Typography, { sx: { mt: 2 }, children: "Use the navigation above to manage security, users, shop, events, and system updates." }) },
    { id: 'image', content: (0, jsx_runtime_1.jsx)("img", { src: "https://placekitten.com/320/120", alt: "dashboard graphic", style: { maxWidth: 320, borderRadius: 8 } }) },
    { id: 'widget', content: (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { p: 2, background: '#f5f5f5', borderRadius: 4 }, children: "Widget: Quick Stats" }) },
];
const Dashboard = () => {
    const [blocks, setBlocks] = (0, react_1.useState)(initialBlocks);
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = blocks.findIndex(b => b.id === active.id);
            const newIndex = blocks.findIndex(b => b.id === over.id);
            const newBlocks = [...blocks];
            const [moved] = newBlocks.splice(oldIndex, 1);
            newBlocks.splice(newIndex, 0, moved);
            setBlocks(newBlocks);
        }
    };
    // Example: Add new text block
    const addTextBlock = () => {
        setBlocks([...blocks, { id: `text-${Date.now()}`, content: (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "New text block" }) }]);
    };
    // Example: Add new image block
    const addImageBlock = () => {
        setBlocks([...blocks, { id: `img-${Date.now()}`, content: (0, jsx_runtime_1.jsx)("img", { src: "https://placekitten.com/320/120", alt: "added graphic", style: { maxWidth: 320, borderRadius: 8 } }) }]);
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: addTextBlock, sx: { mr: 1 }, children: "Add Text Block" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", onClick: addImageBlock, children: "Add Image Block" })] }), (0, jsx_runtime_1.jsx)(core_1.DndContext, { collisionDetection: core_1.closestCenter, onDragEnd: handleDragEnd, children: (0, jsx_runtime_1.jsx)(sortable_1.SortableContext, { items: blocks.map(b => b.id), strategy: sortable_1.verticalListSortingStrategy, children: blocks.map(block => ((0, jsx_runtime_1.jsx)(DraggableContentBlock_1.default, { id: block.id, children: block.content }, block.id))) }) })] }));
};
exports.default = Dashboard;
