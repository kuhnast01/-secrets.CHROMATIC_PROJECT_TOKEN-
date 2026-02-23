import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const Updates: React.FC = () => (
  <div>
    <Typography variant="h5">System Updates</Typography>
    <List>
      <ListItem><ListItemText primary="View and apply game updates" /></ListItem>
      <ListItem><ListItemText primary="Check for new features and patches" /></ListItem>
      <ListItem><ListItemText primary="Rollback to previous version" /></ListItem>
    </List>
  </div>
);

export default Updates;
