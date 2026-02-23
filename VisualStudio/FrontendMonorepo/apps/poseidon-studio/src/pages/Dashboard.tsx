import React from 'react';
import { Box } from '@chakra-ui/react';

export const Dashboard: React.FC = () => (
  <Box p={8}>
    <h1>Dashboard</h1>
    <p>System status, connected repos, active tasks, recent PRs, alerts, quick actions.</p>
  </Box>
);

export default Dashboard;
