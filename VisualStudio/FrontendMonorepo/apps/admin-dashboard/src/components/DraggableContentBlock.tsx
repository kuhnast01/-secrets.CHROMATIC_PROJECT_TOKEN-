// DraggableContentBlock.tsx
// Reusable drag-and-drop content block for graphics, images, text, widgets
// Industry best practice: modular, clean, well-documented

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Props for DraggableContentBlock
 * @param id Unique identifier for the block
 * @param children Content to render (image, text, widget, etc.)
 */
interface DraggableContentBlockProps {
  id: string;
  children: React.ReactNode;
}

/**
 * DraggableContentBlock - Wraps any content for drag-and-drop reordering
 * Usage: <DraggableContentBlock id="block1"> ...content... </DraggableContentBlock>
 */
const DraggableContentBlock: React.FC<DraggableContentBlockProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? '#e0f7fa' : undefined,
        borderRadius: 8,
        marginBottom: 16,
        boxShadow: isDragging ? '0 4px 16px #0002' : '0 2px 8px #0001',
        padding: 16,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export default DraggableContentBlock;
