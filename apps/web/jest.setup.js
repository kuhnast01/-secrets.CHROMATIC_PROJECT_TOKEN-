// Jest setup for web: mock fetch for tests
if (typeof global.fetch !== 'function') {
  global.fetch = require('jest-fetch-mock');
}
