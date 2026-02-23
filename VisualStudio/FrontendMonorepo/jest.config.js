module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/api/src/**/*.{ts,tsx}',
    'apps/web/src/**/*.{ts,tsx}',
    'apps/mobile/src/**/*.{ts,tsx}'
  ],
  coverageReporters: ['text', 'lcov'],
};
