/**
 * Jest configuration for web app (ESM)
 * Highest standards: ESM, TypeScript, monorepo, correct module resolution
 */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.test.(ts|tsx|js)',
    '<rootDir>/tests/**/*.test.(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.app.json' }],
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/node_modules',
    '<rootDir>',
  ],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
    '^@models/(.*)$': '<rootDir>/../../packages/models/src/$1',
    '^@api/(.*)$': '<rootDir>/../../packages/api/src/$1',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
