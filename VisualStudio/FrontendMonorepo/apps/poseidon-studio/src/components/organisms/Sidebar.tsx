import React from 'react';
import { Box, VStack, Divider, Tooltip, IconButton } from '@chakra-ui/react';
import { FiHome, FiMessageCircle, FiFolder, FiGift, FiActivity, FiSettings } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const sections = [
  { label: 'Dashboard', icon: FiHome, route: '/' },
  { label: 'Chat', icon: FiMessageCircle, route: '/chat' },
  { label: 'Repo Explorer', icon: FiFolder, route: '/repo' },
  { label: 'LiveOps', icon: FiGift, route: '/liveops' },
  { label: 'SRE', icon: FiActivity, route: '/sre' },
  { label: 'Settings', icon: FiSettings, route: '/settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Box as="nav" width="72px" bg="gray.800" color="white" py={4} px={2} boxShadow="md" zIndex={2}>
      <VStack spacing={4} align="stretch">
        {sections.map(({ label, icon: Icon, route }) => (
          <Tooltip label={label} placement="right" key={label} hasArrow>
            <IconButton
              aria-label={label}
              icon={<Icon size={24} />}
              variant={location.pathname === route ? 'solid' : 'ghost'}
              colorScheme={location.pathname === route ? 'teal' : undefined}
              size="lg"
              isRound
              _hover={{ bg: 'gray.700' }}
              onClick={() => navigate(route)}
            />
          </Tooltip>
        ))}
        <Divider my={2} />
      </VStack>
    </Box>
  );
};
