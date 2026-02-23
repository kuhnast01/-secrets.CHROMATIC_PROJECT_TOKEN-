import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const Security: React.FC = () => (
  <div>
    <Typography variant="h5">Security Settings</Typography>
    <List>
      <ListItem><ListItemText primary="Require strong passwords for all users" /></ListItem>
      <ListItem><ListItemText primary="Enable two-factor authentication (2FA)" /></ListItem>
      <ListItem><ListItemText primary="Role-based access control" /></ListItem>
      <ListItem><ListItemText primary="Audit log of all admin actions" /></ListItem>
      <ListItem><ListItemText primary="Session timeout after inactivity" /></ListItem>
    </List>
  </div>
);

export default Security;
