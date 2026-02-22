import React, { useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';

export const ResizablePanel: React.FC<{
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
  side: 'left' | 'right';
  children: React.ReactNode;
}> = ({ minWidth = 180, maxWidth = 400, initialWidth = 240, side, children }) => {
  const [width, setWidth] = useState(initialWidth);
  const dragging = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    const startX = e.clientX;
    const startWidth = width;
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!dragging.current) return;
      let newWidth = side === 'left'
        ? startWidth + (moveEvent.clientX - startX)
        : startWidth - (moveEvent.clientX - startX);
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(newWidth);
    };
    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <Box
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      height="100%"
      position="relative"
      bg={side === 'left' ? 'gray.800' : 'gray.850'}
      borderRight={side === 'left' ? '2px solid #222' : undefined}
      borderLeft={side === 'right' ? '2px solid #222' : undefined}
      zIndex={2}
    >
      {children}
      <Box
        position="absolute"
        top={0}
        bottom={0}
        right={side === 'left' ? 0 : undefined}
        left={side === 'right' ? 0 : undefined}
        width="6px"
        cursor="col-resize"
        _hover={{ bg: 'gray.700' }}
        onMouseDown={onMouseDown}
        zIndex={3}
      />
    </Box>
  );
};
