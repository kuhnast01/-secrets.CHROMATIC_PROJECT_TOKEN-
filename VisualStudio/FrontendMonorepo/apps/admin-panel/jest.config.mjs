/**
 * Jest configuration for admin-panel (ESM)
 * Highest standards: ESM, TypeScript, monorepo, correct module resolution
 */
export default {
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: '.',
  moduleDirectories: [
    'node_modules',
    '<rootDir>/node_modules',
    '<rootDir>',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\.{1,2}/.*)\.js$': '$1',
    '^@models/(.*)$': '<rootDir>/../../packages/models/src/$1',
    '^@api/(.*)$': '<rootDir>/../../packages/api/src/$1',
    // CSS Modules (both / and \\)
    '^.+\.module\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Regular CSS (optional: mock to empty object)
    '^.+\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
    testPathIgnorePatterns: [
      '/e2e/', // top-level e2e
      '\\e2e\\', // Windows path for top-level e2e
      '/playwright/',
      '\\playwright\\',
      '/test-results/',
      '\\test-results\\',
      '/apps/.*/e2e/',
      '/apps/.*/playwright/',
      '/apps/.*/test-results/',
      '/backend/e2e/',
      '/backend/playwright/',
      '/backend/test-results/',
      '\\apps\\.*\\e2e\\',
      '\\apps\\.*\\playwright\\',
      '\\apps\\.*\\test-results\\',
      '\\backend\\e2e\\',
      '\\backend\\playwright\\',
      '\\backend\\test-results\\',
    ],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(identity-obj-proxy)/)'
  ],
};
