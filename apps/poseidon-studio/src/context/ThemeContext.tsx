import React, { createContext, useContext, useState } from 'react';
import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';

const themes = {
  studioBlack: extendTheme({
    config: { initialColorMode: 'dark', useSystemColorMode: false },
    colors: { brand: { 100: '#222', 200: '#333', 300: '#444', 400: '#555', 500: '#0ff' } },
  }),
  oceanic: extendTheme({
    config: { initialColorMode: 'dark', useSystemColorMode: false },
    colors: { brand: { 100: '#0a2740', 200: '#0e4d64', 300: '#137177', 400: '#188977', 500: '#1abc9c' } },
  }),
  minimalLight: extendTheme({
    config: { initialColorMode: 'light', useSystemColorMode: false },
    colors: { brand: { 100: '#fff', 200: '#f7f7f7', 300: '#e1e1e1', 400: '#bdbdbd', 500: '#333' } },
  }),
  terminalPro: extendTheme({
    config: { initialColorMode: 'dark', useSystemColorMode: false },
    colors: { brand: { 100: '#000', 200: '#222', 300: '#393', 400: '#fa0', 500: '#0f0' } },
  }),
  gameUI: extendTheme({
    config: { initialColorMode: 'dark', useSystemColorMode: false },
    colors: { brand: { 100: '#23272e', 200: '#2c313c', 300: '#3a3f4b', 400: '#4b5162', 500: '#ffb347' } },
  }),
};

const ThemeContext = createContext({ theme: 'studioBlack', setTheme: (t: string) => {} });
export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('studioBlack');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ChakraProvider theme={themes[theme as keyof typeof themes]}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};
