import React from 'react';
import { Box } from '@chakra-ui/react';

export const Settings: React.FC = () => (
  <Box p={8}>
    <h1>Settings</h1>
    <p>Themes, API keys, repo paths, permissions, offline/online mode.</p>
  </Box>
);

export default Settings;
