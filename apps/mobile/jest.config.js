module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '@testing-library/jest-dom'
  ],
  transform: {
    '^.+\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation|@react-native-community|@react-native-picker|@react-native-async-storage|@react-native-firebase|@react-native-polyfills|expo(nent)?|@expo(nent)?|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated|react-native-safe-area-context|react-native-gesture-handler|react-native-screens|react-native/Libraries)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
