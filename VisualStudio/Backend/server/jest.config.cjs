  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
      '**/__tests__/**/*.test.[jt]s',
      '**/__tests__/**/*.test.[jt]sx',
      '**/__tests__/**/*.spec.[jt]s',
      '**/__tests__/**/*.spec.[jt]sx'
    ],
  };
