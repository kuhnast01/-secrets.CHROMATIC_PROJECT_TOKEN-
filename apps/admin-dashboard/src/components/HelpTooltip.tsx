import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const HelpTooltip: React.FC<{ title: string }> = ({ title }) => (
  <Tooltip title={title} placement="top" arrow>
    <IconButton size="small" sx={{ ml: 0.5 }}>
      <HelpOutlineIcon fontSize="small" />
    </IconButton>
  </Tooltip>
);
