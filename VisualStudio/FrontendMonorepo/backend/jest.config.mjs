/**
 * Jest configuration for liveops-backend (ESM)
 * Highest standards: ESM, TypeScript, monorepo, correct module resolution
 */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleDirectories: ['node_modules', '<rootDir>/node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
    '^@models/(.*)$': '<rootDir>/../packages/models/src/$1',
    '^@api/(.*)$': '<rootDir>/../packages/api/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/../',
    '<rootDir>/../../.vscode/',
    '<rootDir>/../../extensions/',
  ],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json',
        diagnostics: true,
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@dnd-kit|@prisma/client|pino)',
    '/dist/',
  ],
  testPathIgnorePatterns: [
    '/dist/',
  ],
  setupFiles: [
    '<rootDir>/jest.setup.js',
  ],
  verbose: true,
  testTimeout: 30000,
};
