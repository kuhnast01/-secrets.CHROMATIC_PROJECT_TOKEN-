"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const sortable_1 = require("@dnd-kit/sortable");
const utilities_1 = require("@dnd-kit/utilities");
/**
 * DraggableContentBlock - Wraps any content for drag-and-drop reordering
 * Usage: <DraggableContentBlock id="block1"> ...content... </DraggableContentBlock>
 */
const DraggableContentBlock = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = (0, sortable_1.useSortable)({ id });
    return ((0, jsx_runtime_1.jsx)("div", { ref: setNodeRef, style: {
            transform: utilities_1.CSS.Transform.toString(transform),
            transition,
            background: isDragging ? '#e0f7fa' : undefined,
            borderRadius: 8,
            marginBottom: 16,
            boxShadow: isDragging ? '0 4px 16px #0002' : '0 2px 8px #0001',
            padding: 16,
        }, ...attributes, ...listeners, children: children }));
};
exports.default = DraggableContentBlock;
