// Jest setup for admin-dashboard: polyfill TextEncoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
