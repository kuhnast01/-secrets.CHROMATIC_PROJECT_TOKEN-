import { defineConfig } from 'vite';

// Load the React plugin dynamically to avoid ESM "require" errors on Windows
export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default;

  return {
    plugins: [react()],
    server: { port: 5173 }
  };
});
