import React from 'react';
import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import Chat from '../../pages/Chat';
import Repo from '../../pages/Repo';
import LiveOps from '../../pages/LiveOps';
import SRE from '../../pages/SRE';
import Settings from '../../pages/Settings';

export const MainPanel: React.FC = () => (
  <Box flex={1} bg="gray.900" color="white" p={6}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/repo" element={<Repo />} />
      <Route path="/liveops" element={<LiveOps />} />
      <Route path="/sre" element={<SRE />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Box>
);
