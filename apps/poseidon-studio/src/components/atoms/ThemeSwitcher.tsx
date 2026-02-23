import React from 'react';
import { HStack, Text, Select } from '@chakra-ui/react';
import { useThemeContext } from '../../context/ThemeContext';

const themeOptions = [
  { value: 'studioBlack', label: 'Studio Black' },
  { value: 'oceanic', label: 'Oceanic (Poseidon)' },
  { value: 'minimalLight', label: 'Minimal Light' },
  { value: 'terminalPro', label: 'Terminal Pro' },
  { value: 'gameUI', label: 'Game UI' },
];

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useThemeContext();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  return (
    <HStack p={2}>
      <Text id="theme-switcher-label" fontSize="sm" color="gray.400">
        Theme:
      </Text>
      <Select
        aria-labelledby="theme-switcher-label"
        title="Theme Switcher"
        size="sm"
        value={theme}
        onChange={handleChange}
        width="180px"
        bg="gray.700"
        color="white"
        borderColor="gray.600"
      >
        {themeOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </HStack>
  );
};
