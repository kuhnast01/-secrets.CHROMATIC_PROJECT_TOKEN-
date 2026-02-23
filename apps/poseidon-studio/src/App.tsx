import React from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';

import { ThemeSwitcher } from './components/atoms/ThemeSwitcher';
import { ColorModeToggle } from './components/atoms/ColorModeToggle';
import { ResizablePanel } from './components/molecules/ResizablePanel';
import { poseidonEditorApi, EditorAction } from './api/poseidonEditorApi';

export const App: React.FC = () => (
  <ThemeProvider>
    <ChakraProvider>
      <BrowserRouter>
        <Flex direction="column" height="100vh" width="100vw" bg="gray.900">
          <Flex justify="flex-end" align="center" height="48px" px={4} bg="gray.800" boxShadow="sm" gap={2}>
            <ThemeSwitcher />
            <ColorModeToggle />
          </Flex>
          <Flex flex={1} direction="row" minHeight={0}>
            <ResizablePanel side="left" minWidth={120} maxWidth={320} initialWidth={72}>
              <Sidebar />
            </ResizablePanel>
            <MainPanel />
            <ResizablePanel side="right" minWidth={200} maxWidth={400} initialWidth={320}>
              <ContextPanel />
            </ResizablePanel>
          </Flex>
        </Flex>
        {/* Professional editor integration example */}
        {/* Replace with real editor actions and analytics hooks */}
        {/* <button onClick={() => poseidonEditorApi({ type: 'analyze', payload: { data: 'sample' } })}>Analyze</button> */}
      </BrowserRouter>
    </ChakraProvider>
  </ThemeProvider>
);

export default App;
