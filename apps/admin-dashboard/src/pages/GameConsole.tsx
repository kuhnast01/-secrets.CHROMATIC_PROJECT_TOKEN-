// GameConsole.tsx
// Modular, maintainable, drag-and-drop for graphics, images, text, widgets

import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableContentBlock from '../components/DraggableContentBlock';

const initialBlocks = [
  { id: 'console-info', content: <Typography variant="h5">Game Console</Typography> },
  { id: 'console-image', content: <img src="https://placekitten.com/320/120" alt="game graphic" style={{ maxWidth: 320, borderRadius: 8 }} /> },
  { id: 'console-widget', content: <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 4 }}>Widget: Game Controls</Box> },
];

const GameConsole: React.FC = () => {
  const [blocks, setBlocks] = useState(initialBlocks);
  const handleDragEnd = (event: any) => {
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
    setBlocks([...blocks, { id: `text-${Date.now()}`, content: <Typography>New game text block</Typography> }]);
  };
  // Example: Add new image block
  const addImageBlock = () => {
    setBlocks([...blocks, { id: `img-${Date.now()}`, content: <img src="https://placekitten.com/320/120" alt="added game graphic" style={{ maxWidth: 320, borderRadius: 8 }} /> }]);
  };
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={addTextBlock} sx={{ mr: 1 }}>Add Text Block</Button>
        <Button variant="outlined" onClick={addImageBlock}>Add Image Block</Button>
      </Box>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map(block => (
            <DraggableContentBlock key={block.id} id={block.id}>
              {block.content}
            </DraggableContentBlock>
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default GameConsole;
