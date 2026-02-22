import React from 'react';
import { Button, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

export const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
  return (
    <Button onClick={toggleColorMode} size="sm" variant="ghost" aria-label="Toggle color mode">
      {icon}
    </Button>
  );
};
